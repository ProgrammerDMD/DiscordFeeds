package me.programmerdmd.discordfeeds.api.controllers;

import com.google.gson.reflect.TypeToken;
import io.sentry.Hint;
import io.sentry.Sentry;
import jakarta.validation.constraints.NotNull;
import me.programmerdmd.discordfeeds.api.Main;
import me.programmerdmd.discordfeeds.api.exceptions.InternalServerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bot")
public class BotController {

    @Autowired
    private Environment environment;

    @GetMapping(path = "/guilds", produces = "application/json")
    public ResponseEntity<String> getGuilds() {
        int totalShards = Integer.parseInt(environment.getProperty("TOTAL_SHARDS"));
        int shardsPerPod = Integer.parseInt(environment.getProperty("SHARDS_PER_POD"));

        long totalGuilds = 0;
        Hint hint = new Hint();
        for (int i = 0; i < totalShards / shardsPerPod; i++) {
            String baseUrl = "http://discordfeeds-bot-" + i + "-" + totalShards + "." + environment.getProperty("ENVIRONMENT") + ".svc.cluster.local:8080";
            try {
                Map<String, Integer> response = Main.gson.fromJson(Main.getJson(baseUrl + "/guilds", false), new TypeToken<HashMap<String, Integer>>(){}.getType());
                totalGuilds += response.getOrDefault("guilds", 0);
            } catch (IOException e) {
                e.printStackTrace();

                hint.set("total_shards", totalShards);
                hint.set("shards_per_pod", shardsPerPod);
                hint.set("base_url", baseUrl);
                hint.set("total_guilds", totalGuilds);
                Sentry.captureException(e, hint);

                throw new InternalServerException(e.getMessage());
            }
        }

        return ResponseEntity.ok("{ \"guilds\": " + totalGuilds + " }");
    }

    @GetMapping(path = "/{guildId}/channels", produces = "application/json")
    public ResponseEntity<String> getChannels(@PathVariable Long guildId) {
        Hint hint = new Hint();
        try {
            int totalShards = Integer.parseInt(environment.getProperty("TOTAL_SHARDS"));
            int shardsPerPod = Integer.parseInt(environment.getProperty("SHARDS_PER_POD"));
            hint.set("shards_per_pod", shardsPerPod);
            hint.set("total_shards", totalShards);
            long shardId = (guildId >> 22) % totalShards;
            String baseUrl = "http://discordfeeds-bot-" + ((int) (Math.ceil((shardId + 1) / Double.parseDouble(environment.getProperty("SHARDS_PER_POD"))) - 1)) + "-" + totalShards + "." + environment.getProperty("ENVIRONMENT") + ".svc.cluster.local:8080";

            return ResponseEntity.ok(Main.getJson(baseUrl + "/guilds/" + guildId + "/channels", false));
        } catch (IOException e) {
            e.printStackTrace();
            Sentry.captureException(e, hint);
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
            } catch (IOException e) {
                e.printStackTrace();
                Sentry.captureException(e);
                throw new InternalServerException(e.getMessage());
            }
        }

        return ResponseEntity.ok(guilds);
    }

}
