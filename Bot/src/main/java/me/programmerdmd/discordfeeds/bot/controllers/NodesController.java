package me.programmerdmd.discordfeeds.bot.controllers;

import jakarta.validation.Valid;
import me.programmerdmd.discordfeeds.bot.Bot;
import me.programmerdmd.discordfeeds.bot.exceptions.NotFoundException;
import me.programmerdmd.discordfeeds.bot.objects.Channel;
import me.programmerdmd.discordfeeds.bot.objects.MessageBody;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.utils.data.DataObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class NodesController {

    @Autowired
    private Bot bot;

    @GetMapping(path = "/guilds", produces = "application/json")
    public ResponseEntity<String> getGuilds() {
        return ResponseEntity.ok("{ \"guilds\": " + bot.getShardManager().getGuilds().size() + " }");
    }

    @PostMapping(path = "/embed", produces = "application/json")
    public ResponseEntity<String> sendEmbed(@Valid @RequestBody MessageBody body) {
        TextChannel channel = bot.getShardManager().getTextChannelById(body.getChannel());
        if (channel == null) {
            throw new NotFoundException("The specified channel wasn't found!");
        }

        channel.sendMessageEmbeds(EmbedBuilder.fromData(DataObject.fromJson(body.getJson())).build()).queue();

        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/guilds/{guildId}/channels", produces = "application/json")
    public ResponseEntity<List<Channel>> getChannels(@PathVariable String guildId) {
        Guild guild = bot.getShardManager().getGuildById(guildId);
        if (guild == null) throw new NotFoundException("The specified guild wasn't found!");

        List<Channel> channels = new ArrayList<>();
        for (TextChannel channel : guild.getTextChannels()) {
            channels.add(new Channel(channel.getId(), channel.getName()));
        }

        return ResponseEntity.ok(channels);
    }

    @PostMapping(path = "/guilds/sanitize", produces = "application/json")
    public ResponseEntity<List<String>> getAvailableGuilds(@RequestBody List<String> userGuilds) {
        List<String> guilds = new ArrayList<>();

        for (String s : userGuilds) {
            if (bot.getShardManager().getGuildById(s) != null) guilds.add(s);
        }

        return ResponseEntity.ok(guilds);
    }

}
