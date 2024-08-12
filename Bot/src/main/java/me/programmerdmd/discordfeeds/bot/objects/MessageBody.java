package me.programmerdmd.discordfeeds.bot.objects;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class MessageBody {

    @NotNull
    private long guild;

    @NotNull
    private long channel;

    @NotEmpty
    private String json;

    public MessageBody(long guild, long channel, String json) {
        this.guild = guild;
        this.channel = channel;
        this.json = json;
    }

    public long getGuild() {
        return guild;
    }

    public long getChannel() {
        return channel;
    }

    public String getJson() {
        return json;
    }

}
