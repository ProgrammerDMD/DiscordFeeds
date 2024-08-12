package me.programmerdmd.discordfeeds.api.objects.youtube;

public class YouTubeVideo {

    private String id;
    private String url;
    private String title;
    private String description;
    private String thumbnail;

    private int views;
    private int likes;

    private long date;

    public YouTubeVideo(String id, String url, String title, String description, String thumbnail, int views, int likes, long date) {
        this.id = id;
        this.url = url;
        this.title = title;
        this.description = description;
        this.thumbnail = thumbnail;

        this.views = views;
        this.likes = likes;

        this.date = date;
    }

    public String getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public int getViews() {
        return views;
    }

    public int getLikes() {
        return likes;
    }

    public long getDate() {
        return date;
    }
}
