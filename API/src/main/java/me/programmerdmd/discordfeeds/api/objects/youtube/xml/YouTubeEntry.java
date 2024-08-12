package me.programmerdmd.discordfeeds.api.objects.youtube.xml;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class YouTubeEntry {

    public String videoId;
    public String title;
    public String published;

    @JacksonXmlProperty(namespace = "media", localName = "group")
    public MediaGroup group;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MediaGroup {

        @JacksonXmlProperty(namespace = "media", localName = "description")
        public String description;

        @JacksonXmlProperty(namespace = "media", localName = "community")
        public MediaCommunity community;

    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MediaCommunity {

        @JacksonXmlProperty(namespace = "media", localName = "starRating")
        public MediaStarRating starRating;

        @JacksonXmlProperty(namespace = "media", localName = "statistics")
        public MediaStatistics statistics;

    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MediaStarRating {

        @JacksonXmlProperty(isAttribute = true)
        public int count;

    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MediaStatistics {

        @JacksonXmlProperty(isAttribute = true)
        public int views;

    }

}
