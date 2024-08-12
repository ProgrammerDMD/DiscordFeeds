package me.programmerdmd.discordfeeds.api.jobs;

import io.sentry.Sentry;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;

@Component
public class FailedJobsListener implements JobListener {

    private final String RETRY_NUMBER_KEY = "RETRY_NUMBER";
    private final String MAX_RETRIES_KEY = "MAX_RETRIES";
    private final int DEFAULT_MAX_RETRIES = 5;

    private final Logger logger = LoggerFactory.getLogger("DiscordFeedsAPI");

    @Override
    public String getName() {
        return "FailedJobListener";
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {
        context.getTrigger().getJobDataMap().merge(RETRY_NUMBER_KEY, 1,
                (oldValue, initValue) -> ((int) oldValue) + 1);
    }

    @Override
    public void jobExecutionVetoed(JobExecutionContext jobExecutionContext) {

    }

    @Override
    public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {
        if (jobException == null) {
            return;
        }
        int maxRetries = (int) context.getJobDetail().getJobDataMap().computeIfAbsent(MAX_RETRIES_KEY, key -> DEFAULT_MAX_RETRIES);
        int timesRetried = (int) context.getTrigger().getJobDataMap().get(RETRY_NUMBER_KEY);

        if (timesRetried > maxRetries) {
            logger.error("Job with ID and class: " + context.getJobDetail().getKey() + ", " + context.getJobDetail().getJobClass()
                    + " has run " + maxRetries + " times and has failed each time.", jobException);

            try {
                context.getScheduler().deleteJob(context.getTrigger().getJobKey());
            } catch (Exception e) {
                Sentry.captureException(e);
            }

            return;
        }

        TriggerKey triggerKey = context.getTrigger().getKey();
        long intervalLong = ((SimpleTrigger) context.getTrigger()).getRepeatInterval();
        int interval = (int) (intervalLong / 1000L);
        Date startDate = new Date(Instant.now().plusMillis(intervalLong).toEpochMilli());

        Trigger newTrigger = newTrigger()
                .withIdentity(UUID.randomUUID().toString(), triggerKey.getGroup())
                .withSchedule(simpleSchedule()
                        .withIntervalInSeconds(interval))
                .usingJobData(context.getTrigger().getJobDataMap())
                .startAt(startDate)
                .build();
        newTrigger.getJobDataMap().put(RETRY_NUMBER_KEY, timesRetried);

        try {
            context.getScheduler().rescheduleJob(triggerKey, newTrigger);
        } catch (Exception e) {
            Sentry.captureException(e);
        }
    }

}
