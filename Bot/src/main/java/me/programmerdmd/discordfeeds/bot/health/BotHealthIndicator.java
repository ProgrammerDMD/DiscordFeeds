package me.programmerdmd.discordfeeds.bot.health;

import me.programmerdmd.discordfeeds.bot.Bot;
import net.dv8tion.jda.api.JDA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class BotHealthIndicator implements HealthIndicator {

    @Autowired
    private Bot bot;

    private static final List<JDA.Status> failureStatuses = Arrays.asList(
            JDA.Status.FAILED_TO_LOGIN,
            JDA.Status.DISCONNECTED,
            JDA.Status.SHUTDOWN,
            JDA.Status.SHUTTING_DOWN
    );

    @Override
    public Health health() {
        Health.Builder healthIndicator = Health.up();
        Map<String, Object> details = new HashMap<>();

        for (JDA jda : bot.getShardManager().getShards()) {
            details.put("Shard " + jda.getShardInfo().getShardId(), jda.getStatus().toString());

            if (failureStatuses.contains(jda.getStatus())) {
                healthIndicator = Health.down();
            }
        }

        return healthIndicator.withDetails(details).build();
    }
}
