package me.programmerdmd.discordfeeds.bot;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.sharding.DefaultShardManagerBuilder;
import net.dv8tion.jda.api.sharding.ShardManager;
import net.dv8tion.jda.api.utils.SessionControllerAdapter;
import org.jetbrains.annotations.NotNull;

import java.util.logging.Level;
import java.util.logging.Logger;

public class Bot extends ListenerAdapter {

    private final ShardManager shardManager;

    public Bot(String token, int totalShards, int minimumShardId, int maximumShardId) throws InterruptedException {
        DefaultShardManagerBuilder builder = DefaultShardManagerBuilder.createLight(token);
        builder.addEventListeners(this);
        builder.setShardsTotal(totalShards);
        builder.setShards(minimumShardId, maximumShardId);

        builder.setSessionController(new SessionControllerAdapter() {
            @NotNull
            @Override
            public ShardedGateway getShardedGateway(@NotNull JDA api) {
                ShardedGateway gateway = super.getShardedGateway(api);
                Logger.getLogger("DiscordFeeds").log(Level.INFO, "The recommended amount of shards is " + gateway.getShardTotal());
                Logger.getLogger("DiscordFeeds").log(Level.INFO, "Max concurrency is " + gateway.getConcurrency());
                return super.getShardedGateway(api);
            }
        });

        builder.setActivityProvider(activityProvider -> {
            return Activity.playing("discordfeeds.com");
        });
        shardManager = builder.build();
    }

    public ShardManager getShardManager() {
        return shardManager;
    }

}
