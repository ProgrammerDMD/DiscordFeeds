import { Lucia, Session, User } from "lucia";
import { adapter } from "./components/backend/database";
import { Discord } from "arctic";
import { cookies } from "next/headers";
import { cache } from "react";

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username,
            avatar: attributes.avatar,
            guildCredits: attributes.guildCredits,
            deleting: attributes.deleting,
            deletingAt: attributes.deletingAt
        }
    },
    getSessionAttributes: (attributes) => {
        return {
            accessToken: attributes.accessToken,
            refreshToken: attributes.refreshToken,
            dtExpiresAt: attributes.dtExpiresAt
        }
    }
});

export const discord = new Discord(process.env.DISCORD_ID!, process.env.DISCORD_SECRET!, `${process.env.BASE_URL}/api/callback/discord`);

export const validateRequest = cache(
    async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
        const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
        if (!sessionId) {
            return {
                user: null,
                session: null
            }
        }

        const result = await lucia.validateSession(sessionId);
        try {
            if (result.session) {
                const differenceInSeconds = (result.session.dtExpiresAt.getTime() - Date.now()) / 1000;
                if (differenceInSeconds <= 86400) {
                    const tokens = await discord.refreshAccessToken(result.session.refreshToken);

                    await lucia.invalidateSession(result.session.id);
                    const session = await lucia.createSession(result.user.id, {
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                        dtExpiresAt: tokens.accessTokenExpiresAt
                    }, {
                        sessionId: result.session.id
                    });

                    return {
                        user: result.user,
                        session: session
                    }
                }
            }
            if (result.session && result.session.fresh) {
                const sessionCookie = lucia.createSessionCookie(result.session.id);
                cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            }
            if (!result.session) {
                const sessionCookie = lucia.createBlankSessionCookie();
                cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            }
        } catch (error) {

        }
        return result;
    }
);

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
        DatabaseSessionAttributes: DatabaseSessionAttributes;
    }
    interface DatabaseUserAttributes {
        username: string;
        avatar: string | undefined;
        guildCredits: number;
        deleting: boolean;
        deletingAt: number | undefined;
    }
    interface DatabaseSessionAttributes {
        accessToken: string;
        refreshToken: string;
        dtExpiresAt: Date;
    }
}

