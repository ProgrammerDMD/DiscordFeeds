package me.programmerdmd.discordfeeds.api.objects.scheduler;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

import java.util.Map;

public class WebhooksBody extends SchedulerBody {

    @NotEmpty
    @Pattern(regexp = "(?:https?://)?(?:\\w+\\.)?discord(?:app)?\\.com/api(?:/v\\d+)?/webhooks/(\\d+)/([\\w-]+)(?:/(?:\\w+)?)?")
    private final String webhook;

    @NotNull
    @Length(min = 17, max = 21)
    private final String userId;

    public WebhooksBody(String jobType, String webhook, String userId, int interval, Map<String, Object> jobDetails) {
        super(jobType, interval, jobDetails);

        this.webhook = webhook;
        this.userId = userId;
    }

    public String getWebhook() {
        return webhook;
    }

    public String getUserId() {
        return userId;
    }

}
