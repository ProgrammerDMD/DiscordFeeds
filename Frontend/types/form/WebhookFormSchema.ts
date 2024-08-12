import { z } from "zod";
import { FeedType } from "../APITypes";

function error(message: string) {
    return {
        errorMap: () => {
            return { message: message };
        }
    } 
}

const PlatformSchema = z.discriminatedUnion("platform", [
    z.object({
        platform: z.literal(FeedType.Reddit),
        subreddit: z.string().min(3, {
            message: "The name of the subreddit is too short!"
        }).max(21, {
            message: "The name of the subreddit is too long!"
        }),
        type: z.string(error("Please select a valid 'Sort By' option.")).min(3).max(6)
    }),
    z.object({
        platform: z.literal(FeedType.YouTube),
        url: z.string(error("Please provide a valid YouTube url.")).url()
    })
], error("Please select one of the available platforms."));

export const WebhookFormSchema = z.object({
    name: z.string().trim().min(3, {
        message: "The name of the feed is too short!"
    }).max(20, {
        message: "The name of the feed is too long!"
    }),

    webhook: z.string(error("Please provide a valid webhook url.")).trim().min(5).max(255),

    interval: z.string(error("Please select an interval from the options provided.")).trim().min(3).max(5),

    platform: PlatformSchema
});

export type WebhookFormSchemaType = z.infer<typeof WebhookFormSchema>;
