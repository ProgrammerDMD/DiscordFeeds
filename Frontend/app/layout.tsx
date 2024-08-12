import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Discord Feeds",
  description: "Receive notifications from your favorite social media platforms (YouTube and Reddit) on Discord channels, or through webhooks.",
  keywords: ["discord", "notifications", "feeds", "notification", "feed", "social media", "social media platforms", "youtube", "reddit", "webhook", "webhooks"],
  icons: {
    icon: "/discord-feeds.svg"
  },
  openGraph: {
    type: "website",
    url: "https://discordfeeds.com",
    title: "Discord Feeds",
    siteName: "Discord Feeds",
    description: "Receive notifications from your favorite social media platforms (YouTube and Reddit) on Discord channels, or through webhooks.",
    images: [{
      url: "https://discordfeeds.com/discord-feeds.svg"
    }]
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en">
    <body>{children}</body>
  </html>
}
