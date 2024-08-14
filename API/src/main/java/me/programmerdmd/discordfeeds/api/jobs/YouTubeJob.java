package me.programmerdmd.discordfeeds.api.jobs;

import club.minnced.discord.webhook.WebhookClient;
import club.minnced.discord.webhook.send.WebhookEmbed;
import club.minnced.discord.webhook.send.WebhookEmbedBuilder;
import io.sentry.Sentry;
import me.programmerdmd.discordfeeds.api.Main;
import me.programmerdmd.discordfeeds.api.objects.MessageBody;
import me.programmerdmd.discordfeeds.api.objects.database.ChannelsHistory;
import me.programmerdmd.discordfeeds.api.objects.database.WebhooksHistory;
import me.programmerdmd.discordfeeds.api.objects.database.repositories.ChannelsService;
import me.programmerdmd.discordfeeds.api.objects.database.repositories.WebhooksService;
import me.programmerdmd.discordfeeds.api.objects.youtube.YouTubeBody;
import me.programmerdmd.discordfeeds.api.objects.youtube.YouTubeResponse;
import me.programmerdmd.discordfeeds.api.objects.youtube.YouTubeVideo;
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
import java.util.logging.Level;
import java.util.logging.Logger;

@Component
public class YouTubeJob implements Job {

    public static String LINK = "http://localhost:8080/youtube";

    @Autowired
    private ChannelsService channels;

    @Autowired
    private WebhooksService webhooks;

    @Autowired
    private Environment environment;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        JobDataMap dataMap = jobExecutionContext.getJobDetail().getJobDataMap();

        String json = null;
        String channel = dataMap.getString("channel");

        try {
            json = Main.postRequest(YouTubeJob.LINK, Main.gson.toJson(new YouTubeBody("https://www.youtube.com/channel/" + channel)), false);

            YouTubeResponse response = Main.gson.fromJson(json, YouTubeResponse.class);
            YouTubeVideo video = response.getVideos().get(0);

            WebhookEmbedBuilder builder = new WebhookEmbedBuilder()
                    .setAuthor(new WebhookEmbed.EmbedAuthor(video.getTitle(), null, video.getUrl()))
                    .setFooter(new WebhookEmbed.EmbedFooter(response.getName(), response.getIcon()))
                    .setTimestamp(new Date(video.getDate()).toInstant());

            String text = video.getDescription();

            if (text != null) {
                builder.setDescription(text.length() > 2000 ? text.substring(0, 1996) + "..." : text);
            }

            boolean color = true;
            if (color) {
                builder.setColor(Color.RED.getRGB());
            } else {
                builder.setColor(Color.DARK_GRAY.getRGB());
            }

            builder.setImageUrl(video.getThumbnail());

            if (!dataMap.containsKey("webhook")) {
                long guild = dataMap.getLong("discord_guild");
                long discordChannel = dataMap.getLong("discord_channel");

                int totalShards = Integer.parseInt(environment.getProperty("TOTAL_SHARDS"));
                long shardId = (guild >> 22) % totalShards;

                if (!channels.findByChannelAndTypeAndFeedId(discordChannel, "youtube", video.getId()).isEmpty()) return;

                channels.save(new ChannelsHistory(discordChannel, "youtube", video.getId()));

                String baseUrl = "http://discordfeeds-bot-" + (int) (Math.ceil((shardId + 1) / Double.parseDouble(environment.getProperty("SHARDS_PER_POD"))) - 1) + "-" + totalShards + "." + environment.getProperty("ENVIRONMENT") + ".svc.cluster.local:8080/";
                Logger.getLogger("DiscordFeeds").log(Level.INFO, baseUrl);

                try {
                    Main.postRequest(baseUrl + "embed", Main.gson.toJson(new MessageBody(guild, discordChannel, builder.build().toJSONString())), false);
                } catch (Exception e) {
                    e.printStackTrace();
                    Sentry.captureException(e);
                }

                return;
            }

            WebhookClient client = WebhookClient.withUrl(dataMap.getString("webhook"));

            if (!webhooks.findByWebhookAndTypeAndFeedId(client.getId(), "youtube", video.getId()).isEmpty()) return;

            webhooks.save(new WebhooksHistory(client.getId(), "youtube", video.getId()));

            client.send(builder.build()).thenAccept(message -> {
                client.close();
            });

        } catch (Exception e) {
            e.printStackTrace();
            Sentry.captureException(e);
        }
    }

}
