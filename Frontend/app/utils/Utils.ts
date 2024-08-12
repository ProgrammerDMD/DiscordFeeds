export const MAXIMUM_FEEDS_NOT_UPGRADED = 5;
export const MAXIMUM_FEEDS_UPGRADED = 10;
export const MAXIMUM_FEEDS_WEBHOOKS = 10;

export const errors = {
    "NOT_LOGGED_IN": { message: "You are not logged in for this request!" },
    "INVALID_INFORMATION": { message: "Some of the provided information is invalid." },
    "SERVER_CONFLICT_ERROR": { message: "The information you provided contains duplicates!" },
    "SERVER_UNKNOWN_ERROR": { message: "An unknown error has occurred, please try later or refresh the page." },
    "FEED_ALREADY_EXISTS": { message: "A feed with the specified details already exists!" },
    "TOO_MANY_REQUESTS": { message: "Too many requests, try again in a few seconds!" },
    "NOT_SUBSCRIBED": { message: "You need to be a subscribed member!" },
    custom: (message: string) => {
        return { message: message }
    }
}