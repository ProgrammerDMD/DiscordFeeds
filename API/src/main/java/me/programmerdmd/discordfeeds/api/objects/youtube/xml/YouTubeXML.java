package me.programmerdmd.discordfeeds.api.objects.youtube.xml;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonRootName("feed")
public class YouTubeXML {

    public String id;
    public String link;

    public YouTubeAuthor author;

    @JacksonXmlElementWrapper(useWrapping = false)
    public List<YouTubeEntry> entry;

}