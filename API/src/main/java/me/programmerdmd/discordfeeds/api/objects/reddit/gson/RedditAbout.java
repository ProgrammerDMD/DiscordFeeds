package me.programmerdmd.discordfeeds.api.objects.reddit.gson;

import org.springframework.web.util.HtmlUtils;

public class RedditAbout {

    public Data data;

    public String getCommunityIcon() {
        return HtmlUtils.htmlUnescape(data.community_icon);
    }

    public static class Data {
        public String community_icon;
    }

}
