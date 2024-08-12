"use server";

import { getChannel } from "./ServerActions";
import { Channel, FeedResponse, FeedType, Guild } from "@/types/APITypes";
import { GuildFormSchema, GuildFormSchemaType } from "@/types/form/GuildFormSchema";
import { validateRequest } from "../auth";
import { isGuildActive, upgradeGuild } from "../components/backend/database";
import { errors, MAXIMUM_FEEDS_NOT_UPGRADED, MAXIMUM_FEEDS_UPGRADED } from "./Utils";
import { GuildPayment, User } from "../components/backend/db/schema";

const permissions: any = {
    "ADMINISTRATOR": BigInt(0x0000000000000008),
    "MANAGE_GUILD": BigInt(0x0000000000000020)
}

export async function processUpgradeForm(guildId: string): Promise<void | { message: string }> {
    const { user, session } = await validateRequest();
    if (!session) return errors.NOT_LOGGED_IN;

    const payment: GuildPayment | undefined = await upgradeGuild(guildId, user.id);
    if (!payment) return Promise.reject(new Error(errors.SERVER_UNKNOWN_ERROR.message));
}

export async function processForm({ id, form, guild }: {
    id?: string,
    form: GuildFormSchemaType,
    guild: string
}): Promise<void | { message: string }> {
    var jobDetails;

    const { session } = await validateRequest();
    if (!session) return errors.NOT_LOGGED_IN;

    const valid = GuildFormSchema.safeParse(form).success;
    if (!valid) return errors.INVALID_INFORMATION;

    switch (form.platform.platform) {
        case FeedType.YouTube:
            var channelId: string | undefined = undefined;
            var reason: any = undefined;

            await getChannel(form.platform.url).then((value) => {
                channelId = value;
            }).catch((error) => {
                reason = error;
            })

            if (reason) return reason;

            jobDetails = {
                "name": form.name,
                "channel": channelId,
                "youtubeUrl": form.platform.url
            }

            break;
        case FeedType.Reddit:
            jobDetails = {
                "name": form.name,
                "subreddit": form.platform.subreddit,
                "type": form.platform.type
            }
            break;
    }

    // Check if the feed exists first for update.
    const url = id === undefined ? `${process.env.API_URL}/guilds` : `${process.env.API_URL}/guilds/guild-${guild}/${id}`;
    const method = id === undefined ? "POST" : "PATCH";

    const guilds: Guild[] = await getGuilds(session.accessToken, true);
    const channels: Channel[] = await getChannels(guild, true);

    if (!guilds || !channels || guilds.find((value) => {
        if (value.id === guild) return value;
    }) === undefined || channels.find((value) => {
        if (value.id === form.channel) return value;
    }) === undefined) return errors.INVALID_INFORMATION;

    const payment: {
        payment: GuildPayment | undefined;
        user: User | undefined;
    } = await isGuildActive(guild);
    const feeds = await getFeeds(guild);

    if (!payment.payment && feeds.length >= MAXIMUM_FEEDS_NOT_UPGRADED) return errors.custom(`You've reached the limit of ${MAXIMUM_FEEDS_NOT_UPGRADED} feeds.`);
    if (payment.payment && feeds.length >= MAXIMUM_FEEDS_UPGRADED) return errors.custom(`You've reached the limit of ${MAXIMUM_FEEDS_UPGRADED} feeds.`);

    const response = await fetch(url, {
        method: method,
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "jobType": form.platform.platform,
            "guild": guild,
            "channel": form.channel,
            "interval": form.interval,
            "jobDetails": jobDetails
        })
    });

    if (!response.ok) {
        if (response.status == 409) {
            return errors.FEED_ALREADY_EXISTS;
        } else if (response.status == 400) {
            return errors.INVALID_INFORMATION;
        } else {
            return Promise.reject(new Error(errors.SERVER_UNKNOWN_ERROR.message));
        }

        // Throw error in the future for https://sentry.io/
    }
}

export async function getFeeds(guildId: string): Promise<FeedResponse[]> {
    const response = await fetch(`${process.env.API_URL}/guild-${guildId}`, {
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) return Promise.reject(new Error(errors.SERVER_UNKNOWN_ERROR.message));

    const body: FeedResponse[] = await response.json();

    return Promise.resolve(body);
}

export async function getChannels(guildId: string, force?: boolean): Promise<Channel[]> {
    const response = await fetch(`${process.env.API_URL}/bot/${guildId}/channels`, {
        next: {
            revalidate: !!force ? 0 : 15
        },
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) return Promise.reject(new Error(errors.SERVER_UNKNOWN_ERROR.message));

    const body: Channel[] = await response.json();

    return Promise.resolve(body);
}

export async function getTotalGuilds(): Promise<number> {
    const response = await fetch(`${process.env.API_URL}/bot/guilds`, {
        next: {
            revalidate: 0
        },
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) return Promise.reject(new Error(errors.SERVER_UNKNOWN_ERROR.message));
    const body: { guilds: number } = await response.json();
    return body.guilds;
}

export async function getGuilds(access_token: string, force?: boolean): Promise<Guild[]> {
    var response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
        next: {
            revalidate: !!force ? 0 : 15
        },
        headers: {
            "Authorization": "Bearer " + access_token,
            "Content-Type": "application/json"
        }
    });

    if (response.status === 429) return Promise.reject(new Error(errors.TOO_MANY_REQUESTS.message));

    if (!response.ok) {
        const text = await response.text();
        return Promise.reject(new Error(text));
    }
    // Throw error in https://sentry.io/

    const body = await response.json();
    const guilds: Guild[] = [];
    const guildIds: string[] = [];

    for (let id in body) {
        let userPermissions: string[] = [];
        let permissionInt: bigint = BigInt(body[id].permissions);

        for (let permission in permissions) {
            if ((permissionInt & permissions[permission]) == permissions[permission]) userPermissions.push(permission);
        }

        guildIds.push(body[id].id);
        guilds.push({
            id: body[id].id as string,
            name: body[id].name as string,
            icon: body[id].icon !== null ? `https://cdn.discordapp.com/icons/${body[id].id}/${body[id].icon}.png` as string : null,
            permissions: userPermissions
        });
    }

    response = await fetch(`${process.env.API_URL}/bot/sanitize`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(guildIds)
    });

    if (!response.ok) return Promise.reject(new Error(errors.SERVER_UNKNOWN_ERROR.message));

    // Throw error in https://sentry.io/

    const sanitized: string[] = await response.json();

    return Promise.resolve(guilds.filter((guild) => sanitized.includes(guild.id)));
}

export async function deleteFeed(id: string, guild: string) {
    const url = `${process.env.API_URL}/guild-${guild}/${id}`;
    await fetch(url, {
        method: "DELETE"
    });
}