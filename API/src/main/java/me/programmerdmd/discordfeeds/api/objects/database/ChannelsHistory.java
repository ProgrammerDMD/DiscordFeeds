package me.programmerdmd.discordfeeds.api.objects.database;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Date;

@Entity
public class ChannelsHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private long channel;

    private String type;

    private String feedId;

    private Date timestamp;

    public ChannelsHistory() {
        super();
    }

    public ChannelsHistory(long channel, String type, String feedId) {
        super();
        this.channel = channel;
        this.type = type;
        this.feedId = feedId;
        this.timestamp = new Date();
    }

    public String getId() {
        return id;
    }

    public long getChannel() {
        return channel;
    }

    public String getType() {
        return type;
    }

    public String getFeedId() {
        return feedId;
    }

    public Date getTimestamp() {
        return timestamp;
    }
}
