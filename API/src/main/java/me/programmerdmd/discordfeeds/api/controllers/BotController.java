package me.programmerdmd.discordfeeds.api.controllers;

import com.google.gson.reflect.TypeToken;
import io.sentry.Hint;
import io.sentry.Sentry;
import jakarta.validation.constraints.NotNull;
import me.programmerdmd.discordfeeds.api.Main;
import me.programmerdmd.discordfeeds.api.exceptions.InternalServerException;
import me.programmerdmd.discordfeeds.api.jobs.BotGuildsJob;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.quartz.JobBuilder.newJob;
import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;

@RestController
@RequestMapping("/bot")
public class BotController {

    @Autowired
    private Environment environment;

    @Autowired
    private Scheduler scheduler;

    @Cacheable(cacheNames = "guildsBotSize", key="size", sync = true)
    @GetMapping(path = "/guilds", produces = "application/json")
    public ResponseEntity<String> getGuilds() {
        int totalShards = Integer.parseInt(environment.getProperty("TOTAL_SHARDS"));
        int shardsPerPod = Integer.parseInt(environment.getProperty("SHARDS_PER_POD"));

        long totalGuilds = 0;
        for (int i = 0; i < totalShards / shardsPerPod; i++) {
            String baseUrl = "http://discordfeeds-bot-" + i + "-" + totalShards + "." + environment.getProperty("ENVIRONMENT") + ".svc.cluster.local:8080";
            try {
                Map<String, Integer> response = Main.gson.fromJson(Main.getJson(baseUrl + "/guilds", false), new TypeToken<HashMap<String, Integer>>(){}.getType());
                totalGuilds += response.getOrDefault("guilds", 0);
            } catch (Exception e) {
                e.printStackTrace();

                Sentry.withScope((scope) -> {
                    scope.setContexts("total_shards", totalShards);
                    scope.setContexts("shards_per_pod", shardsPerPod);
                    scope.setContexts("base_url", baseUrl);
                    Sentry.captureException(e);
                });

                throw new InternalServerException(e.getMessage());
            }
        }

        try {
            if (!scheduler.checkExists(JobKey.jobKey("size", "botguilds"))) {
                JobBuilder jobBuilder = newJob(BotGuildsJob.class);
                jobBuilder.withIdentity(JobKey.jobKey("size", "botguilds"));

                TriggerBuilder<SimpleTrigger> builder = newTrigger()
                        .withSchedule(simpleSchedule()
                                .withIntervalInMinutes(60)
                                .repeatForever());

                scheduler.scheduleJob(jobBuilder.build(), builder.build());
            }
        } catch (SchedulerException e) {
            e.printStackTrace();
            Sentry.captureException(e);
        }

        return ResponseEntity.ok("{ \"guilds\": " + totalGuilds + " }");
    }

    @GetMapping(path = "/{guildId}/channels", produces = "application/json")
    public ResponseEntity<String> getChannels(@PathVariable Long guildId) {
        Hint hint = new Hint();

        int totalShards = Integer.parseInt(environment.getProperty("TOTAL_SHARDS"));
        int shardsPerPod = Integer.parseInt(environment.getProperty("SHARDS_PER_POD"));
        long shardId = (guildId >> 22) % totalShards;

        String baseUrl = "http://discordfeeds-bot-" + ((int) (Math.ceil((shardId + 1) / Double.parseDouble(environment.getProperty("SHARDS_PER_POD"))) - 1)) + "-" + totalShards + "." + environment.getProperty("ENVIRONMENT") + ".svc.cluster.local:8080";

        try {
            return ResponseEntity.ok(Main.getJson(baseUrl + "/guilds/" + guildId + "/channels", false));
        } catch (Exception e) {
            e.printStackTrace();

            Sentry.withScope((scope) -> {
                scope.setContexts("total_shards", totalShards);
                scope.setContexts("shards_per_pod", shardsPerPod);
                scope.setContexts("base_url", baseUrl);
                Sentry.captureException(e);
            });

            throw new InternalServerException(e.getMessage());
        }
    }

    @PostMapping(path = "/sanitize", produces = "application/json")
    public ResponseEntity<List<String>> getAvailableGuilds(@NotNull @RequestBody List<String> userGuilds) {
        int totalShards = Integer.parseInt(environment.getProperty("TOTAL_SHARDS"));
        Map<Long, List<String>> guildsPerShard = new HashMap<>();
        for (String guild : userGuilds) {
            long shardId = (Long.parseLong(guild) >> 22) % totalShards;

            List<String> guilds = guildsPerShard.getOrDefault(shardId, new ArrayList<>());
            guilds.add(guild);

            guildsPerShard.put(shardId, guilds);
        }

        List<String> guilds = new ArrayList<>();
        for (Long shardId : guildsPerShard.keySet()) {
            String baseUrl = "http://discordfeeds-bot-" + ((int) (Math.ceil((shardId + 1) / Double.parseDouble(environment.getProperty("SHARDS_PER_POD"))) - 1)) + "-" + totalShards + "." + environment.getProperty("ENVIRONMENT") + ".svc.cluster.local:8080";

            try {
                List<String> sanitizedGuilds = Main.gson.fromJson(Main.postRequest(baseUrl + "/guilds/sanitize", Main.gson.toJson(userGuilds), false), new TypeToken<List<String>>(){}.getType());
                guilds.addAll(sanitizedGuilds);
            } catch (Exception e) {
                e.printStackTrace();

                Sentry.withScope((scope) -> {
                    scope.setContexts("total_shards", totalShards);
                    scope.setContexts("shards_per_pod", environment.getProperty("SHARDS_PER_POD"));
                    scope.setContexts("base_url", baseUrl);
                    Sentry.captureException(e);
                });

                throw new InternalServerException(e.getMessage());
            }
        }

        return ResponseEntity.ok(guilds);
    }

}
