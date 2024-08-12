import { discord, lucia } from "@/app/auth";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { Users } from "../../../components/backend/db/schema";
import { db } from "../../../components/backend/db/drizzle";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = cookies().get("discord_oauth_state")?.value ?? null;

    if (!code || !state || state !== storedState) {
        return new Response(null, {
            status: 400
        });
    }

    try {
        const tokens = await discord.validateAuthorizationCode(code);
        const response = await fetch("https://discord.com/api/v10/users/@me", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });

        const user: {
            id: string;
            username: string;
            avatar: string | undefined;
        } = await response.json();

        const [ dbUser ] = await db.insert(Users).values({
            id: user.id,
            username: user.username,
            avatar: user.avatar
        }).onConflictDoUpdate({
            target: [Users.id],
            set: {
                username: user.username,
                avatar: user.avatar,
            }
        }).returning();

        if (!dbUser) {
            throw new Error("Couldn't execute database operation.");
        }

        const session = await lucia.createSession(dbUser.id, {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            dtExpiresAt: tokens.accessTokenExpiresAt
        });
        const sessionCookie = lucia.createSessionCookie(session.id);
        
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/"
            }
        });
    } catch (error) {
        if (error instanceof OAuth2RequestError) {
            return new Response(null, {
                status: 400
            });
        }
        return new Response(null, {
            status: 500
        });
    }
}