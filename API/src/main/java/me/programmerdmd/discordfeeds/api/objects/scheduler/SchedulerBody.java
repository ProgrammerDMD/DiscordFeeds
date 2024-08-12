package me.programmerdmd.discordfeeds.api.objects.scheduler;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.Map;

public abstract class SchedulerBody {

    @NotEmpty
    @Length(min = 3, max = 7)
    private final String jobType;

    @NotNull
    @Min(300)
    @Max(86400)
    private final Integer interval;

    @NotEmpty
    private final Map<String, Object> jobDetails;

    public SchedulerBody(String jobType, Integer interval, Map<String, Object> jobDetails) {
        this.jobType = jobType;
        this.interval = interval;
        this.jobDetails = jobDetails;
    }

    public String getJobType() {
        return jobType;
    }

    public Integer getInterval() {
        return interval;
    }

    public Map<String, Object> getJobDetails() {
        return jobDetails;
    }
}
