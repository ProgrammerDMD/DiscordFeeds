package me.programmerdmd.discordfeeds.api.controllers;

import io.sentry.Sentry;
import me.programmerdmd.discordfeeds.api.exceptions.InternalServerException;
import me.programmerdmd.discordfeeds.api.exceptions.NotFoundException;
import me.programmerdmd.discordfeeds.api.objects.scheduler.Job;
import me.programmerdmd.discordfeeds.api.utils.SchedulerUtils;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SchedulerController {

    @Autowired
    private Scheduler scheduler;

    @Autowired
    private SchedulerUtils utils;

    @DeleteMapping(path = "/{group}/{id}", produces = "application/json")
    public ResponseEntity<String> deleteJob(@PathVariable String group, @PathVariable String id) {
        try {
            if (scheduler.deleteJob(JobKey.jobKey(id, group))) return ResponseEntity.ok().build();

            throw new NotFoundException("The requested job wasn't found!");
        } catch (SchedulerException e) {
            e.printStackTrace();
            Sentry.captureException(e);
            throw new InternalServerException(e.getMessage());
        }
    }

    @GetMapping(value = "/{group}", produces = "application/json")
    public ResponseEntity<List<Job>> listJobs(@PathVariable String group) {
        try {
            return ResponseEntity.ok(utils.getJobs(group));
        } catch (SchedulerException e) {
            e.printStackTrace();
            Sentry.captureException(e);
            throw new InternalServerException(e.getMessage());
        }
    }

}
