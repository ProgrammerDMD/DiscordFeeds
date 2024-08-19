package me.programmerdmd.discordfeeds.api.controllers;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.google.gson.reflect.TypeToken;
import io.sentry.Hint;
import io.sentry.Sentry;
import me.programmerdmd.discordfeeds.api.Main;
import me.programmerdmd.discordfeeds.api.exceptions.InternalServerException;
import me.programmerdmd.discordfeeds.api.exceptions.NotFoundException;
import me.programmerdmd.discordfeeds.api.objects.youtube.YouTubeResponse;
import me.programmerdmd.discordfeeds.api.objects.youtube.YouTubeVideo;
import me.programmerdmd.discordfeeds.api.objects.youtube.gson.YouTubeInitialData;
import me.programmerdmd.discordfeeds.api.objects.youtube.xml.YouTubeEntry;
import me.programmerdmd.discordfeeds.api.objects.youtube.xml.YouTubeXML;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
public class YouTubeController {

    private static XmlMapper mapper = new XmlMapper();
    private static Pattern pattern = Pattern.compile("(var[ \\t]+ytInitialData[ \\t]+=[ \\t](\\{.+}))");
    private static SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
    private static Pattern youtubeUrl = Pattern.compile("^https?:\\/\\/(www\\.)?youtube\\.com\\/(channel\\/UC[\\w-]{21}[AQgw]|(c\\/|user\\/)?[\\w@-]+)$");

    public static class YouTubeBody {
        public String url;
    }

    @Cacheable(cacheManager = "youTubeUrlCacheManager", cacheNames = "youtube", sync = true, key = "#body.url")
    @PostMapping(value = "/youtube/url", produces = "application/json")
    public ResponseEntity<String> getUrl(@RequestBody YouTubeBody body) {
        Hint hint = new Hint();
        hint.set("url", body.url);
        try {
            if (!youtubeUrl.matcher(body.url).matches()) {
                throw new NotFoundException("Couldn't find the channel at the specified URL!");
            }

            Document doc = Jsoup.connect(body.url).proxy(new Proxy(Proxy.Type.HTTP, new InetSocketAddress("us.smartproxy.com", 20000))).get();
            Elements newsHeadlines = doc.select("script");

            String thumbnail = null;
            String externalId = null;

            for (Element element : newsHeadlines) {
                if (element.data().contains("ytInitialData")) {
                    Matcher matcher = pattern.matcher(element.data());
                    if (matcher.find()) {
                        YouTubeInitialData data = Main.gson.fromJson(matcher.group(2), YouTubeInitialData.class);

                        if (data == null || data.metadata == null || data.metadata.renderer == null || data.metadata.renderer.avatar == null || data.metadata.renderer.avatar.thumbnails == null || data.metadata.renderer.avatar.thumbnails.isEmpty() || data.metadata.renderer.externalId == null) {
                            throw new NotFoundException("Couldn't find the channel at the specified URL!");
                        }

                        thumbnail = data.metadata.renderer.avatar.thumbnails.get(data.metadata.renderer.avatar.thumbnails.size() - 1).url;
                        externalId = data.metadata.renderer.externalId;
                    }
                    break;
                }
            }

            return ResponseEntity.ok("{ \"thumbnail\": \"" + thumbnail + "\", \"externalId\": \"" + externalId + "\"}");
        } catch (IOException e) {
            e.printStackTrace();
            Sentry.captureException(e, hint);
            throw new InternalServerException(e.getMessage());
        }
    }

    @Cacheable(cacheNames = "youtube", sync = true, key = "#body.url")
    @PostMapping(value = "/youtube", produces = "application/json")
    public YouTubeResponse handle(@RequestBody YouTubeBody body) {
        Hint hint = new Hint();
        hint.set("url", body.url);
        try {
            if (!youtubeUrl.matcher(body.url).matches()) {
                throw new NotFoundException("Couldn't find the channel at the specified URL!");
            }

            Map<String, String> response = Main.gson.fromJson(Main.postRequest("http://localhost:8080/youtube/url", Main.gson.toJson(body, YouTubeBody.class), false), new TypeToken<HashMap<String, String>>(){}.getType());

            YouTubeXML value = mapper.readValue(Main.getJson("https://www.youtube.com/feeds/videos.xml?channel_id=" + response.get("externalId"), true), YouTubeXML.class);
            List<YouTubeVideo> videos = new ArrayList<>();

            long date = Instant.now().toEpochMilli();
            for (YouTubeEntry entry : value.entry) {
                try {
                    date = format.parse(entry.published).getTime();
                } catch (ParseException | NumberFormatException e) {

                }

                YouTubeVideo video = new YouTubeVideo(
                        entry.videoId,
                        "https://www.youtube.com/watch?v=" + entry.videoId,
                        entry.title,
                        entry.group.description,
                        "https://i4.ytimg.com/vi/" + entry.videoId + "/maxresdefault.jpg",
                        entry.group.community.statistics.views,
                        entry.group.community.starRating.count,
                        date);

                videos.add(video);
            }

            return new YouTubeResponse(value.author.name, response.get("externalId"), value.author.uri, response.get("thumbnail"), videos);
        } catch (IOException e) {
            e.printStackTrace();
            Sentry.captureException(e, hint);
            throw new InternalServerException(e.getMessage());
        }
    }

}