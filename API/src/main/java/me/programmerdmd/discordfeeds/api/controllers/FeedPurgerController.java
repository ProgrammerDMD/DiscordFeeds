package me.programmerdmd.discordfeeds.api.controllers;

import io.sentry.Sentry;
import jakarta.validation.Valid;
import me.programmerdmd.discordfeeds.api.exceptions.InternalServerException;
import me.programmerdmd.discordfeeds.api.exceptions.NotFoundException;
import me.programmerdmd.discordfeeds.api.jobs.GuildWebhookPurgerJob;
import me.programmerdmd.discordfeeds.api.objects.scheduler.PurgerBody;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;

@RestController
@RequestMapping("/purger")
public class FeedPurgerController {

    @Autowired
    private Scheduler scheduler;

    @PostMapping("/guild")
    public void scheduleGuild(@Valid @RequestBody PurgerBody body) {
        try {
            SimpleTrigger trigger = newTrigger()
                    .withIdentity(body.getId(), "guildpurger")
                    .startAt(new Date(body.getPurgeAtMillis()))
                    .withSchedule(simpleSchedule()
                            .withMisfireHandlingInstructionFireNow()
                            .withIntervalInHours(1)
                            .withRepeatCount(2)
                            .withMisfireHandlingInstructionNextWithRemainingCount()).build();

            if (scheduler.checkExists(JobKey.jobKey(body.getId(), "guildpurger"))) {
                scheduler.rescheduleJob(TriggerKey.triggerKey(body.getId(), "guildpurger"), trigger);
                return;
            }

            JobDetail detail = JobBuilder.newJob(GuildWebhookPurgerJob.class)
                    .withIdentity(body.getId(), "guildpurger").build();

            detail.getJobDataMap().put("guild", body.getId());
            scheduler.scheduleJob(detail, trigger);
        } catch (Exception e) {
            e.printStackTrace();
            Sentry.withScope((scope) -> {
                scope.setContexts("body", body);
                Sentry.captureException(e);
            });
            throw new InternalServerException(e.getMessage());
        }
    }

    @DeleteMapping("/guild/{guild}")
    public void unscheduleGuild(@PathVariable String guild) {
        try {
            if (!scheduler.deleteJob(JobKey.jobKey(guild, "guildpurger"))) {
                throw new NotFoundException("There's not a guild with the specified ID!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            Sentry.withScope((scope) -> {
                scope.setContexts("guild", guild);
                Sentry.captureException(e);
            });
            throw new InternalServerException(e.getMessage());
        }
    }

    @PostMapping("/user")
    public void scheduleUser(@Valid @RequestBody PurgerBody body) {
        try {
            SimpleTrigger trigger = newTrigger()
                    .withIdentity(body.getId(), "userpurger")
                    .startAt(new Date(body.getPurgeAtMillis()))
                    .withSchedule(simpleSchedule()
                            .withMisfireHandlingInstructionFireNow()
                            .withIntervalInHours(1)
                            .withRepeatCount(2)
                            .withMisfireHandlingInstructionNextWithRemainingCount()).build();

            if (scheduler.checkExists(JobKey.jobKey(body.getId(), "userpurger"))) {
                scheduler.rescheduleJob(TriggerKey.triggerKey(body.getId(), "userpurger"), trigger);
                return;
            }

            JobDetail detail = JobBuilder.newJob(GuildWebhookPurgerJob.class)
                    .withIdentity(body.getId(), "userpurger").build();

            detail.getJobDataMap().put("user", body.getId());
            scheduler.scheduleJob(detail, trigger);
        } catch (Exception e) {
            e.printStackTrace();
            Sentry.withScope((scope) -> {
                scope.setContexts("body", body);
                Sentry.captureException(e);
            });
            throw new InternalServerException(e.getMessage());
        }
    }

    @DeleteMapping("/user/{user}")
    public void unscheduleUser(@PathVariable String user) {
        try {
            if (!scheduler.deleteJob(JobKey.jobKey(user, "userpurger"))) {
                throw new NotFoundException("There's not a user with the specified ID!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            Sentry.withScope((scope) -> {
                scope.setContexts("user", user);
                Sentry.captureException(e);
            });
            throw new InternalServerException(e.getMessage());
        }
    }

}
