package me.programmerdmd.discordfeeds.api.objects.database.repositories;

import me.programmerdmd.discordfeeds.api.objects.database.WebhooksHistory;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface WebhooksService extends CrudRepository<WebhooksHistory, String> {

    List<WebhooksHistory> findByWebhookAndTypeAndFeedId(long webhook, String type, String feedId);

}
