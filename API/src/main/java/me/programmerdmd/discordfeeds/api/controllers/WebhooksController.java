package me.programmerdmd.discordfeeds.api.controllers;

import io.sentry.Sentry;
import jakarta.validation.Valid;
import me.programmerdmd.discordfeeds.api.exceptions.ConflictException;
import me.programmerdmd.discordfeeds.api.exceptions.JobDetailNotFoundException;
import me.programmerdmd.discordfeeds.api.objects.scheduler.WebhooksBody;
import me.programmerdmd.discordfeeds.api.utils.SchedulerUtils;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhooks")
public class WebhooksController {

    @Autowired
    private Scheduler scheduler;

    @Autowired
    private SchedulerUtils utils;

    @PostMapping(produces = "application/json")
    public ResponseEntity<String> schedule(@Valid @RequestBody WebhooksBody body) {
        try {
            JobDetail detail = utils.getJobDetail(body);
            if  (scheduler.checkExists(detail.getKey())) {
                throw new ConflictException("A similar job is already scheduled!");
            }

            utils.scheduleJob(body);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            Sentry.withScope((scope) -> {
                scope.setContexts("body", body);
                Sentry.captureException(e);
            });
            throw new ConflictException(e.getMessage());
        }
    }

    @PatchMapping(value = "/{group}/{id}", produces = "application/json")
    public ResponseEntity<String> update(@PathVariable String group, @PathVariable String id, @Valid @RequestBody WebhooksBody body) {
        try {
            JobDetail oldJob = scheduler.getJobDetail(JobKey.jobKey(id, group));
            if (oldJob == null) throw new JobDetailNotFoundException();

            scheduler.deleteJob(JobKey.jobKey(id, group));
            utils.scheduleJob(body);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            Sentry.withScope((scope) -> {
                scope.setContexts("body", body);
                Sentry.captureException(e);
            });
            throw new ConflictException(e.getMessage());
        }
    }

}
