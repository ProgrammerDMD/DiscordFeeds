package me.programmerdmd.discordfeeds.api.objects.reddit;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;


public class RedditResponse {

    private boolean found;
    private String subreddit;
    private List<RedditPost> posts;

    public RedditResponse(boolean found, String subreddit, List<RedditPost> posts) {
        this.found = found;
        this.posts = posts;
        this.subreddit = subreddit;
    }

    public boolean isFound() {
        return found;
    }

    @JsonProperty("subreddit")
    public String getSubReddit() {
        return subreddit;
    }

    public List<RedditPost> getPosts() {
        return posts;
    }

}
