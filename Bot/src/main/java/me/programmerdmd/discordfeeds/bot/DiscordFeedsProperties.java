package me.programmerdmd.discordfeeds.bot;

import io.sentry.Sentry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties
public class DiscordFeedsProperties {

    @Value("${discordfeeds.token}")
    private String token;

    @Value("${discordfeeds.sharding.total}")
    private int totalShards;

    @Value("${discordfeeds.sharding.minimum}")
    private int minimumShardId;

    @Value("${discordfeeds.sharding.maximum}")
    private int maximumShardId;

    @Bean
    public Bot bot() {
        try {
            return new Bot(token, totalShards, minimumShardId, maximumShardId);
        } catch (InterruptedException e) {
            Sentry.captureException(e);
        }
        return null;
    }
}
