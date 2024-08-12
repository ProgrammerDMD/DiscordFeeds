package me.programmerdmd.discordfeeds.api.objects.youtube.gson;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class YouTubeInitialData {

    public Metadata metadata;

    public static class MetadataRenderer {
        public String externalId;
        public Avatar avatar;
    }

    public static class Metadata {
        @SerializedName("channelMetadataRenderer")
        public MetadataRenderer renderer;
    }

    public static class Header {
        @SerializedName("c4TabbedHeaderRenderer")
        public Renderer renderer;
    }

    public static class Renderer {
        public Avatar avatar;
    }

    public static class Avatar {
        public List<Thumbnail> thumbnails;
    }

    public static class Thumbnail {
        public int height;
        public int width;
        public String url;
    }

}
