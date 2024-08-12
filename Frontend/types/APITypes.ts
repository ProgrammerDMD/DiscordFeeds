export interface Guild {
    id: string,
    name: string,
    icon: string | null,
    permissions: string[]
}

export interface Channel {
    id: string,
    name: string
}

export enum FeedType {
    YouTube = "YouTube",
    Reddit = "Reddit"
}

export interface FeedResponse {
    id: string,
    group: string,
    interval: string,
    jobDetails: {
        name: string,
        discord_channel?: string,
        job_type: FeedType,
        webhook?: string,
        channel?: string,
        subreddit?: string,
        type?: string
        youtubeUrl?: string
    }
}