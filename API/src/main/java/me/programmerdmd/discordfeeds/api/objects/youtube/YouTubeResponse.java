package me.programmerdmd.discordfeeds.api.objects.youtube;

import java.util.List;

public class YouTubeResponse {

    private String name;
    private String externalId;
    private String url;
    private String icon;

    private List<YouTubeVideo> videos;

    public YouTubeResponse(String name, String externalId, String url, String icon, List<YouTubeVideo> videos) {
        this.name = name;
        this.externalId = externalId;
        this.url = url;
        this.icon = icon;

        this.videos = videos;
    }

    public String getName() {
        return name;
    }

    public String getExternalId() { return externalId; }

    public String getUrl() {
        return url;
    }

    public String getIcon() { return icon; }

    public List<YouTubeVideo> getVideos() {
        return videos;
    }
}
