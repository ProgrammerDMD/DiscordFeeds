package me.programmerdmd.discordfeeds.api.objects;

public class MessageBody {

    private long guild;
    private long channel;

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
