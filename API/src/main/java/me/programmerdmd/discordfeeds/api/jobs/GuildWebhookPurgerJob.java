package me.programmerdmd.discordfeeds.api.jobs;

import io.sentry.Sentry;
import me.programmerdmd.discordfeeds.api.utils.SchedulerUtils;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class GuildWebhookPurgerJob implements Job {

    @Autowired
    private Scheduler scheduler;

    @Autowired
    private SchedulerUtils utils;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        JobDataMap dataMap = jobExecutionContext.getJobDetail().getJobDataMap();

        if (dataMap.containsKey("guild")) {
            List<me.programmerdmd.discordfeeds.api.objects.scheduler.Job> jobs = null;
            try {
                jobs = utils.getJobs("guild-" + dataMap.getString("guild"));
                List<JobKey> jobsForDeletion = new ArrayList<>();

                for (int i = 5; i < jobs.size(); i++) {
                    me.programmerdmd.discordfeeds.api.objects.scheduler.Job job = jobs.get(i);
                    jobsForDeletion.add(JobKey.jobKey(job.getId(), job.getGroup()));
                }

                jobsForDeletion.add(jobExecutionContext.getJobDetail().getKey());
                scheduler.deleteJobs(jobsForDeletion);
            } catch (Exception e) {
                throw new JobExecutionException();
            }
        } else if (dataMap.containsKey("user")) {
            try {
                List<me.programmerdmd.discordfeeds.api.objects.scheduler.Job> jobs = utils.getJobs("user-" + dataMap.getString("user"));
                List<JobKey> jobsForDeletion = new ArrayList<>();

                for (int i = 0; i < jobs.size(); i++) {
                    me.programmerdmd.discordfeeds.api.objects.scheduler.Job job = jobs.get(i);
                    jobsForDeletion.add(JobKey.jobKey(job.getId(), job.getGroup()));
                }

                jobsForDeletion.add(jobExecutionContext.getJobDetail().getKey());
                scheduler.deleteJobs(jobsForDeletion);
            } catch (Exception e) {
               throw new JobExecutionException();
            }
        }
    }

}
