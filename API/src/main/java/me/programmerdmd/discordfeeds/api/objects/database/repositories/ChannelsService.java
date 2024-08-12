package me.programmerdmd.discordfeeds.api.objects.database.repositories;

import me.programmerdmd.discordfeeds.api.objects.database.ChannelsHistory;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ChannelsService extends CrudRepository<ChannelsHistory, String> {

    List<ChannelsHistory> findByChannelAndTypeAndFeedId(long channel, String type, String feedId);

}
