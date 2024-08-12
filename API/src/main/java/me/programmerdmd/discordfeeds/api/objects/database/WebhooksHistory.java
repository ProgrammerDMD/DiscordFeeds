package me.programmerdmd.discordfeeds.api.objects.database;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Date;

@Entity
public class WebhooksHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private long webhook;

    private String type;

    private String feedId;

    private Date timestamp;

    public WebhooksHistory() {
        super();
    }

    public WebhooksHistory(long webhook, String type, String feedId) {
        super();
        this.webhook = webhook;
        this.type = type;
        this.feedId = feedId;
        this.timestamp = new Date();
    }

    public String getId() {
        return id;
    }

    public long getWebhook() {
        return webhook;
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
