import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://discordfeeds.com",
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 1.0
        },
        {
            url: "https://discordfeeds.com/dashboard/guilds",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9
        },
        {
            url: "https://discordfeeds.com/dashboard/webhooks",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9
        },
        {
            url: "https://discordfeeds.com/dashboard/profile",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8
        },
        {
            url: "https://discordfeeds.com/contact",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6
        },
        {
            url: "https://discordfeeds.com/termsandconditions",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6
        },
        {
            url: "https://discordfeeds.com/privacypolicy",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6
        }
    ]
}