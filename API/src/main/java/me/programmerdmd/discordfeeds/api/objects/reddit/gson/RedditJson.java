package me.programmerdmd.discordfeeds.api.objects.reddit.gson;

import java.util.List;

public class RedditJson {

    public RedditData data;

    public List<RedditData.Post> getPosts() {
        return data.posts;
    }

}
