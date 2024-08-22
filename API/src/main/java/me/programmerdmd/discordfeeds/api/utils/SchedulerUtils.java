package me.programmerdmd.discordfeeds.api.utils;

import club.minnced.discord.webhook.WebhookClientBuilder;
import me.programmerdmd.discordfeeds.api.exceptions.BadRequestException;
import me.programmerdmd.discordfeeds.api.jobs.RedditJob;
import me.programmerdmd.discordfeeds.api.jobs.YouTubeJob;
import me.programmerdmd.discordfeeds.api.objects.scheduler.GuildsBody;
import me.programmerdmd.discordfeeds.api.objects.scheduler.Job;
import me.programmerdmd.discordfeeds.api.objects.scheduler.SchedulerBody;
import me.programmerdmd.discordfeeds.api.objects.scheduler.WebhooksBody;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;

import static org.quartz.JobBuilder.newJob;
import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;

@Component
public class SchedulerUtils {

    @Autowired
    private Scheduler scheduler;

    public JobDetail getYouTubeJobDetail(SchedulerBody body) {
        Object channel = body.getJobDetails().get("channel");
        if (channel == null) throw new BadRequestException("The JobDetails doesn't have specified the following properties: channel");

        JobBuilder builder = newJob(YouTubeJob.class);
        if (body instanceof GuildsBody guildsBody) {
            builder.withIdentity(guildsBody.getChannel() + "-youtube-" + channel, "guild-" + guildsBody.getGuild());
        } else if (body instanceof WebhooksBody webhooksBody) {
            Matcher matcher = WebhookClientBuilder.WEBHOOK_PATTERN.matcher(webhooksBody.getWebhook());
            matcher.matches();

            builder.withIdentity(matcher.group(1) + "-youtube-" + channel, "user-" + webhooksBody.getUserId());
        } else throw new BadRequestException("The requested body contains invalid information!");

        JobDetail jobDetail = builder.build();

        for (String key : body.getJobDetails().keySet()) {
            jobDetail.getJobDataMap().put(key, body.getJobDetails().get(key));
        }

        return jobDetail;
    }

    public JobDetail getRedditJobDetail(SchedulerBody body) {
        Object subreddit = body.getJobDetails().get("subreddit");
        Object type = body.getJobDetails().get("type");

        if (subreddit == null && type == null) {
            throw new BadRequestException("The JobDetails doesn't have specified the following properties: subreddit, type");
        } else if (subreddit == null) {
            throw new BadRequestException("The JobDetails doesn't have specified the following properties: subreddit");
        } else if (type == null) {
            throw new BadRequestException("The JobDetails doesn't have specified the following properties: type");
        }

        JobBuilder builder = newJob(RedditJob.class);
        if (body instanceof GuildsBody guildsBody) {
            builder.withIdentity(guildsBody.getChannel() + "-reddit-" + subreddit, "guild-" + guildsBody.getGuild());
        } else if (body instanceof WebhooksBody webhooksBody) {
            Matcher matcher = WebhookClientBuilder.WEBHOOK_PATTERN.matcher(webhooksBody.getWebhook());
            matcher.matches();

            builder.withIdentity(matcher.group(1) + "-reddit-" + subreddit, "user-" + webhooksBody.getUserId());
        } else throw new BadRequestException("The requested body contains invalid information!");

        JobDetail jobDetail = builder.build();

        for (String key : body.getJobDetails().keySet()) {
            jobDetail.getJobDataMap().put(key, body.getJobDetails().get(key));
        }

        return jobDetail;
    }

    public JobDetail getJobDetail(SchedulerBody body) throws BadRequestException {
        JobDetail jobDetail = null;
        if (body.getJobDetails().get("name") == null) throw new BadRequestException("The JobDetails doesn't have specified the following properties: name");

        if (body.getJobType().equalsIgnoreCase("reddit")) {
            jobDetail = getRedditJobDetail(body);
        } else if (body.getJobType().equalsIgnoreCase("youtube")) {
            jobDetail = getYouTubeJobDetail(body);
        }

        if (jobDetail == null) throw new BadRequestException("The JobDetails doesn't have specified the following properties: jobType");

        return jobDetail;
    }

    public void scheduleJob(SchedulerBody body) throws SchedulerException {
        JobDetail jobDetail = getJobDetail(body);

        TriggerBuilder<SimpleTrigger> builder = newTrigger()
                .withSchedule(simpleSchedule()
                .withIntervalInSeconds(body.getInterval())
                        .withMisfireHandlingInstructionNextWithRemainingCount()
                .repeatForever());

        jobDetail.getJobDataMap().put("job_type", body.getJobType());

        if (body instanceof GuildsBody guildsBody) {
            builder.withIdentity(UUID.randomUUID().toString(), "guild-" + guildsBody.getGuild());
            jobDetail.getJobDataMap().put("discord_guild", guildsBody.getGuild());
            jobDetail.getJobDataMap().put("discord_channel", guildsBody.getChannel());
        } else if (body instanceof WebhooksBody webhooksBody) {
            builder.withIdentity(UUID.randomUUID().toString(), "user-" + ((WebhooksBody) body).getUserId());
            jobDetail.getJobDataMap().put("webhook", webhooksBody.getWebhook());
        } else throw new BadRequestException("The requested body contains invalid information!");

        scheduler.scheduleJob(jobDetail, builder.build());
    }

    public List<Job> getJobs(String group) throws SchedulerException {
        List<Job> jobs = new ArrayList<>();

        for (JobKey jobKey : scheduler.getJobKeys(GroupMatcher.jobGroupEquals(group))) {
            JobDetail details = scheduler.getJobDetail(jobKey);

            Map<String, Object> jobDetails = new HashMap<>();
            for (String key : details.getJobDataMap().getKeys()) {
                jobDetails.put(key, details.getJobDataMap().get(key));
            }

            Trigger trigger = scheduler.getTriggersOfJob(jobKey).get(0);
            if (trigger != null) {
                jobs.add(new Job(jobKey.getName(), jobKey.getGroup(),
                        (int) (((SimpleTrigger) trigger).getRepeatInterval() / 1000L),
                        jobDetails));
            } else {
                jobs.add(new Job(jobKey.getName(), jobKey.getGroup(), -1, jobDetails));
            }

        }

        return jobs;
    }

}
