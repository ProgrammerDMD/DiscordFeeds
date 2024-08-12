package me.programmerdmd.discordfeeds.api.objects.reddit.gson;

import com.google.gson.annotations.SerializedName;
import org.springframework.web.util.HtmlUtils;

import java.util.List;
import java.util.Map;

public class RedditData {

    @SerializedName("children")
    public List<Post> posts;

    public static class Post {

        public PostData data;

        public String getText() {
            return data.text != null ? HtmlUtils.htmlUnescape(HtmlUtils.htmlUnescape(data.text)).trim() : null;
        }

        public String getAuthor() {
            return HtmlUtils.htmlUnescape(data.author);
        }

        public String getId() {
            return data.id;
        }

        public String getTitle() {
            return HtmlUtils.htmlUnescape(data.title);
        }

        public String getThumbnail() {
            return HtmlUtils.htmlUnescape(data.thumbnail);
        }

        public int getAwards() {
            return data.awards;
        }

        public int getUpVotes() {
            return data.ups;
        }

        public int getDownVotes() {
            return data.downs;
        }

        public long getDate() {
            return data.created;
        }

        public List<Flair> getFlairs() {
            return data.flairs;
        }

        public String getImageUrl() {
            if (getGallery() != null && getMedia() != null) {
                return HtmlUtils.htmlUnescape(getMedia().get(getGallery().get(0).media_id).source.url);
            }

            if (data.preview != null && data.preview.images != null && data.preview.images.size() > 0) {
                return HtmlUtils.htmlUnescape(data.preview.images.get(0).source.url);
            }

            return null;
        }

        public Map<String, Media> getMedia() {
            return data.media;
        }

        public List<Gallery.GalleryData> getGallery() {
            return data.gallery != null ? data.gallery.data : null;
        }

        public boolean isHidden() {
            return data.hidden;
        }

        public String getColor() {
            return data.link_flair_background_color;
        }

        public String getUrl() {
            return "https://www.reddit.com" + data.permalink ;
        }

        public boolean isStickied() { return data.stickied; }

        public static class PostData {

            @SerializedName("name")
            public String id;
            public String author;
            public String title;
            public String thumbnail;
            public String link_flair_background_color;
            public String url;

            public String permalink;
            public String subreddit;
            public String subreddit_type;
            public String subreddit_name_prefixed;

            @SerializedName("selftext")
            public String text;

            @SerializedName("total_awards_received")
            public int awards;
            public int ups;
            public int downs;
            public long created;

            public boolean media_only;
            public boolean hide_score;
            public boolean is_gallery;
            public boolean is_created_from_ads_ui;
            public boolean is_meta;
            public boolean stickied;
            public boolean hidden;
            public boolean over_18;

            @SerializedName("link_flair_richtext")
            public List<Flair> flairs;

            @SerializedName("gallery_data")
            public Gallery gallery;

            @SerializedName("media_metadata")
            public Map<String, Media> media;

            public Preview preview;
        }
    }

    public static class Preview {

        public List<Image> images;
        public boolean enabled;

        public String getUrl() {
            return images != null && images.size() > 0 ? images.get(0).source.url : null;
        }

        public static class Image {

            public String id;
            public Data source;
            public List<Data> resolutions;

            public static class Data {
                public String url;
                public int width;
                public int height;
            }
        }

    }

    public static class Media {

        public String status;

        public String id;

        @SerializedName("e")
        public String type;

        @SerializedName("m")
        public String mime;

        @SerializedName("p")
        public List<Image> previews;

        @SerializedName("s")
        public Image source;

        public static class Image {

            public int x;

            public int y;

            @SerializedName("u")
            public String url;

            public String gif;

            public String mp4;

        }
    }

    public static class Gallery {

        @SerializedName("items")
        public List<GalleryData> data;

        public static class GalleryData {
            public String caption;
            public String outbound_url;
            public String media_id;
            public String id;
        }

    }

    public static class Flair {

        @SerializedName("e")
        public String type;

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        @SerializedName("u")
        public String url;

        public String getEmojiAsText() {
            return emojiAsText;
        }

        public void setEmojiAsText(String emojiAsText) {
            this.emojiAsText = emojiAsText;
        }

        @SerializedName("a")
        public String emojiAsText;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        @SerializedName("t")
        public String text;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Flair(String type, String url, String emojiAsText, String text) {
            this.type = type;
            this.text = text;
            this.emojiAsText = emojiAsText;
            this.url = url;
        }

    }
}