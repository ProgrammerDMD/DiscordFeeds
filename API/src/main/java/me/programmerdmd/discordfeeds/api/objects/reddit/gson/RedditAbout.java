package me.programmerdmd.discordfeeds.api.objects.reddit.gson;

import org.springframework.web.util.HtmlUtils;

public class RedditAbout {

    public Data data;

    public String getCommunityIcon() {
        return HtmlUtils.htmlUnescape(data.icon_img);
    }

    public static class Data {
        public String icon_img;
    }

}
