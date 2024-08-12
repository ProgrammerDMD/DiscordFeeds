"use server";

import { getChannel } from "./ServerActions";
import { FeedResponse, FeedType } from "@/types/APITypes";
import { WebhookFormSchema, WebhookFormSchemaType } from "@/types/form/WebhookFormSchema";
import { validateRequest } from "../auth";
import { errors, MAXIMUM_FEEDS_WEBHOOKS } from "./Utils";
import { getUserPayment } from "../components/backend/database";

export async function processForm({ id, form }: {
    id?: string,
    form: WebhookFormSchemaType
}): Promise<void | { message: string }> {
    var jobDetails;

    const { user, session } = await validateRequest();
    if (!session) return errors.NOT_LOGGED_IN;

    const valid = WebhookFormSchema.safeParse(form).success;
    if (!valid) return errors.INVALID_INFORMATION;

    const payment = await getUserPayment(user.id);
    if (!payment) return errors.NOT_SUBSCRIBED;
    
    const feeds = await getFeeds();
    if (feeds.length >= MAXIMUM_FEEDS_WEBHOOKS) return errors.custom(`You've reached the limit of ${MAXIMUM_FEEDS_WEBHOOKS} feeds.`);

    switch (form.platform.platform) {
        case FeedType.YouTube:
            var channelId: string | undefined = undefined;
            var reason: any = undefined;
            await getChannel(form.platform.url).then((value) => {
                channelId = value;
            }).catch((error) => {
                reason = error;
            });

            if (reason) return { message: reason.message }

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

    const url = id === undefined ? `${process.env.API_URL}/webhooks` : `${process.env.API_URL}/webhooks/user-${user.id}/${id}`;
    const method = id === undefined ? "POST" : "PATCH";

    const response = await fetch(url, {
        method: method,
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "jobType": form.platform.platform,
            "userId": user.id,
            "webhook": form.webhook,
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

export async function getFeeds(): Promise<FeedResponse[]> {
    const { user } = await validateRequest();
    if (!user) return Promise.reject(new Error(errors.NOT_LOGGED_IN.message));

    const response = await fetch(`${process.env.API_URL}/user-${user.id}`, {
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) return Promise.reject(new Error(errors.SERVER_UNKNOWN_ERROR.message));

    const body: FeedResponse[] = await response.json();

    return body;
}

export async function deleteFeed(id: string) {
    const { user } = await validateRequest();
    if (!user) return;

    const url = `${process.env.API_URL}/user-${user.id}/${id}`;
    await fetch(url, {
        method: "DELETE"
    });
}