package me.programmerdmd.discordfeeds.api.controllers;

import io.sentry.Hint;
import io.sentry.Sentry;
import me.programmerdmd.discordfeeds.api.Main;
import me.programmerdmd.discordfeeds.api.exceptions.BadRequestException;
import me.programmerdmd.discordfeeds.api.exceptions.InternalServerException;
import me.programmerdmd.discordfeeds.api.objects.reddit.RedditPost;
import me.programmerdmd.discordfeeds.api.objects.reddit.RedditResponse;
import me.programmerdmd.discordfeeds.api.objects.reddit.gson.RedditAbout;
import me.programmerdmd.discordfeeds.api.objects.reddit.gson.RedditData;
import me.programmerdmd.discordfeeds.api.objects.reddit.gson.RedditJson;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/reddit")
public class RedditController {

    private static final String REDDIT_URL = "https://www.reddit.com/";

    @Cacheable(cacheManager = "redditIconsCacheManager", cacheNames = "reddit", key="#id", sync = true)
    @GetMapping(value = "/{id}/icon", produces = "application/json")
    public ResponseEntity<String> getIcon(@PathVariable String id) {
        Hint hint = new Hint();
        hint.set("subreddit", id);
        try {
            String json = Main.getJson(REDDIT_URL + "r/" + id + "/about/.json", true);
            RedditAbout about = Main.gson.fromJson(json, RedditAbout.class);

            return ResponseEntity.ok("{ \"icon\": \"" + about.getCommunityIcon() + "\"}");
        } catch (IOException e) {
            e.printStackTrace();
            Sentry.captureException(e, hint);
            throw new InternalServerException(e.getMessage());
        }
    }

    @Cacheable(cacheNames = "reddit", key="#id + #type", sync = true)
    @GetMapping(value = "/{id}/{type}", produces = "application/json")
    public RedditResponse getPosts(@PathVariable String id, @PathVariable String type) {
        if (!(type.equalsIgnoreCase("hot") || type.equalsIgnoreCase("new"))) throw new BadRequestException("The type is not one of the following: hot, new");

        Hint hint = new Hint();
        hint.set("subreddit", id);
        hint.set("type", type);

        try {
            String json = Main.getJson(REDDIT_URL + "r/" + id + "/" + type + "/.json?limit=4", true);

            RedditJson reddit = Main.gson.fromJson(json, RedditJson.class);
            List<RedditPost> posts = new ArrayList<>();

            for (RedditData.Post post : reddit.getPosts()) {
                if (post.isStickied()) continue;
                List<String> images = new ArrayList<>();
                if (post.getGallery() != null && post.getMedia() != null) {
                    for (RedditData.Gallery.GalleryData gallery : post.getGallery()) {
                        RedditData.Media media = post.getMedia().get(gallery.media_id);
                        if (!media.mime.contains("image")) continue;

                        RedditData.Media.Image source = media.source;
                        if (source.url != null && source.gif == null) {
                            images.add(HtmlUtils.htmlUnescape(post.getMedia().get(gallery.media_id).source.url));
                        } else if (source.url == null && source.gif != null) {
                            images.add(HtmlUtils.htmlUnescape(post.getMedia().get(gallery.media_id).source.gif));
                        }
                    }
                }

                if (post.data.preview != null && post.data.preview.images != null && !post.data.preview.images.isEmpty()) {
                    for (RedditData.Preview.Image image : post.data.preview.images) {
                        images.add(HtmlUtils.htmlUnescape(image.source.url));
                    }
                }

                post.getFlairs().forEach(flair -> {
                    flair.setType(HtmlUtils.htmlUnescape(flair.getType()));

                    if (flair.getText() != null) {
                        flair.setText(HtmlUtils.htmlUnescape(flair.getText()));
                    }

                    if (flair.getUrl() != null) {
                        flair.setUrl(HtmlUtils.htmlUnescape(flair.getUrl()));
                    }

                    if (flair.getEmojiAsText() != null) {
                        flair.setEmojiAsText(HtmlUtils.htmlUnescape(flair.getEmojiAsText()));
                    }
                });

                posts.add(new RedditPost(
                        post.getId(),
                        post.getTitle(),
                        post.getText(),
                        post.getAuthor(),
                        post.getUrl(),
                        (post.getColor() == null || post.getColor().isBlank() || post.getColor().isEmpty() ? null : post.getColor()),
                        post.getFlairs(),
                        images,
                        post.getUpVotes(),
                        post.getDownVotes(),
                        post.data.over_18,
                        post.data.created * 1000L));
            }

            return new RedditResponse(true, id, posts);
        } catch (IOException e) {
            e.printStackTrace();
            Sentry.captureException(e, hint);
            throw new InternalServerException(e.getMessage());
        }
    }

}
