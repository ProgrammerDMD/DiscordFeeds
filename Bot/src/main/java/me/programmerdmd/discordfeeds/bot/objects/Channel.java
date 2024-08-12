package me.programmerdmd.discordfeeds.bot.objects;

public class Channel {

    private String id;
    private String name;

    public Channel(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}