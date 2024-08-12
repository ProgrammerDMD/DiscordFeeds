package me.programmerdmd.discordfeeds.api.objects.reddit;

import com.fasterxml.jackson.annotation.JsonProperty;
import me.programmerdmd.discordfeeds.api.objects.reddit.gson.RedditData;

import java.util.List;

public class RedditPost {

    private String id;
    private String title;
    private String text;
    private String author;
    private String url;

    private String flairColor;
    private List<RedditData.Flair> flairs;
    private List<String> images;

    private int upvotes;
    private int downvotes;

    private boolean over18;
    private long date;

    public RedditPost(String id, String title, String text, String author, String url, String flairColor, List<RedditData.Flair> flairs, List<String> images, int upvotes, int downvotes, boolean over18, long date) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.author = author;
        this.url = url;

        this.flairColor = flairColor;
        this.flairs = flairs;
        this.images = images;

        this.upvotes = upvotes;
        this.downvotes = downvotes;

        this.over18 = over18;
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getText() {
        return text;
    }

    public String getAuthor() {
        return author;
    }

    public String getUrl() {
        return url;
    }

    public String getFlairColor() {
        return flairColor;
    }

    public List<RedditData.Flair> getFlairs() {
        return flairs;
    }

    public List<String> getImages() {
        return images;
    }

    @JsonProperty("upvotes")
    public int getUpVotes() {
        return upvotes;
    }

    @JsonProperty("downvotes")
    public int getDownVotes() {
        return downvotes;
    }

    public boolean isOver18() {
        return over18;
    }

    public long getDate() {
        return date;
    }
}
