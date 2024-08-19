package me.programmerdmd.discordfeeds.api.jobs;

import club.minnced.discord.webhook.WebhookClient;
import club.minnced.discord.webhook.send.WebhookEmbed;
import club.minnced.discord.webhook.send.WebhookEmbedBuilder;
import com.google.gson.reflect.TypeToken;
import io.sentry.Hint;
import io.sentry.Sentry;
import me.programmerdmd.discordfeeds.api.Main;
import me.programmerdmd.discordfeeds.api.objects.MessageBody;
import me.programmerdmd.discordfeeds.api.objects.database.ChannelsHistory;
import me.programmerdmd.discordfeeds.api.objects.database.WebhooksHistory;
import me.programmerdmd.discordfeeds.api.objects.database.repositories.ChannelsService;
import me.programmerdmd.discordfeeds.api.objects.database.repositories.WebhooksService;
import me.programmerdmd.discordfeeds.api.objects.reddit.RedditPost;
import me.programmerdmd.discordfeeds.api.objects.reddit.RedditResponse;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class RedditJob implements Job {

    @Autowired
    private ChannelsService channels;

    @Autowired
    private WebhooksService webhooks;

    @Autowired
    private Environment environment;

    private static final String LINK = "http://localhost:8080/reddit/";

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        JobDataMap dataMap = jobExecutionContext.getJobDetail().getJobDataMap();

        String json = null;
        String type = dataMap.getString("type");
        String subreddit = dataMap.getString("subreddit");

        Hint hint = new Hint();
        hint.set("job_data", dataMap);

        try {
            json = Main.getJson(LINK + subreddit + "/" + type, false);
            Map<String, String> iconResponse = Main.gson.fromJson(Main.getJson(LINK + subreddit + "/icon", false), new TypeToken<HashMap<String, String>>(){}.getType());

            RedditResponse response = Main.gson.fromJson(json, RedditResponse.class);
            RedditPost post = response.getPosts().get(0);

            WebhookEmbedBuilder builder = new WebhookEmbedBuilder()
                    .setAuthor(new WebhookEmbed.EmbedAuthor(post.getTitle(), null, post.getUrl()))
                    .setFooter(new WebhookEmbed.EmbedFooter("r/" + response.getSubReddit(), iconResponse.get("icon")))
                    .setTimestamp(new Date(post.getDate()).toInstant());

            String text = post.getText();

            if (text != null) {
                builder.setDescription(text.length() > 2000 ? text.substring(0, 1996) + "..." : text);
            }

            if (post.getFlairColor() != null) {
                builder.setColor(Color.decode(post.getFlairColor()).getRGB());
            } else {
                builder.setColor(Color.DARK_GRAY.getRGB());
            }

            String imageUrl = !post.getImages().isEmpty() ? post.getImages().get(0) : null;
            if (imageUrl != null) {
                builder.setImageUrl(imageUrl);
            }

            if (!dataMap.containsKey("webhook")) {
                long guild = dataMap.getLong("discord_guild");
                long discordChannel = dataMap.getLong("discord_channel");

                int totalShards = Integer.parseInt(environment.getProperty("TOTAL_SHARDS"));
                long shardId = (guild >> 22) % totalShards;

                if (!channels.findByChannelAndTypeAndFeedId(discordChannel, "reddit", post.getId()).isEmpty()) return;

                channels.save(new ChannelsHistory(discordChannel, "reddit", post.getId()));

                String baseUrl = "http://discordfeeds-bot-" + ((int) (Math.ceil((shardId + 1) / Double.parseDouble(environment.getProperty("SHARDS_PER_POD"))) - 1)) + "-" + totalShards + "." + environment.getProperty("ENVIRONMENT") + ".svc.cluster.local:8080/";
                hint.set("base_url", baseUrl);

                try {
                    Main.postRequest(baseUrl + "embed", Main.gson.toJson(new MessageBody(guild, discordChannel, builder.build().toJSONString())), false);
                } catch (Exception e) {
                    e.printStackTrace();
                    Sentry.captureException(e, hint);
                }

                return;
            }

            WebhookClient client = WebhookClient.withUrl(dataMap.getString("webhook"));
            if (!webhooks.findByWebhookAndTypeAndFeedId(client.getId(), "reddit", post.getId()).isEmpty()) return;

            webhooks.save(new WebhooksHistory(client.getId(), "reddit", post.getId()));

            client.send(builder.build()).thenAccept(message -> {
                client.close();
            });

        } catch (Exception e) {
            e.printStackTrace();
            Sentry.captureException(e, hint);
        }
    }

}
