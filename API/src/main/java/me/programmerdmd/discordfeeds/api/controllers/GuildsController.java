package me.programmerdmd.discordfeeds.api.controllers;

import io.sentry.Hint;
import io.sentry.Sentry;
import jakarta.validation.Valid;
import me.programmerdmd.discordfeeds.api.exceptions.ConflictException;
import me.programmerdmd.discordfeeds.api.exceptions.JobDetailNotFoundException;
import me.programmerdmd.discordfeeds.api.objects.scheduler.GuildsBody;
import me.programmerdmd.discordfeeds.api.utils.SchedulerUtils;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/guilds")
public class GuildsController {

    @Autowired
    private Scheduler scheduler;

    @Autowired
    private SchedulerUtils utils;

    @PostMapping(produces = "application/json")
    public ResponseEntity<String> schedule(@Valid @RequestBody GuildsBody body) {
        Hint hint = new Hint();
        hint.set("body", body);
        try {
            JobDetail detail = utils.getJobDetail(body);
            if (scheduler.checkExists(detail.getKey())) {
                throw new ConflictException("A similar job is already scheduled!");
            }

            utils.scheduleJob(body);
            return ResponseEntity.ok().build();
        } catch (SchedulerException e) {
            e.printStackTrace();
            Sentry.captureException(e, hint);
            throw new ConflictException(e.getMessage());
        }
    }

    @PatchMapping(value = "/{group}/{id}", produces = "application/json")
    public ResponseEntity<String> update(@PathVariable String group, @PathVariable String id, @Valid @RequestBody GuildsBody body) {
        Hint hint = new Hint();
        hint.set("body", body);
        try {
            JobDetail oldJob = scheduler.getJobDetail(JobKey.jobKey(id, group));
            if (oldJob == null) throw new JobDetailNotFoundException();

            scheduler.deleteJob(JobKey.jobKey(id, group));
            utils.scheduleJob(body);

            return ResponseEntity.ok().build();
        } catch (SchedulerException e) {
            e.printStackTrace();
            Sentry.captureException(e, hint);
            throw new ConflictException(e.getMessage());
        }
    }
}