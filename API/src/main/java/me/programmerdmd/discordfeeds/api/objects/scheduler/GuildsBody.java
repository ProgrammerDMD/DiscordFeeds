package me.programmerdmd.discordfeeds.api.objects.scheduler;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.Map;

public class GuildsBody extends SchedulerBody {

    @NotNull
    @Length(min = 17, max = 21)
    private final String guild;

    @NotNull
    @Length(min = 17, max = 21)
    private final String channel;

    public GuildsBody(String jobType, String guild, String channel, Integer interval, Map<String, Object> jobDetails) {
        super(jobType, interval, jobDetails);

        this.guild = guild;
        this.channel = channel;
    }

    public String getGuild() {
        return guild;
    }

    public String getChannel() {
        return channel;
    }

}
