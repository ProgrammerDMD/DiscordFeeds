package me.programmerdmd.discordfeeds.api.objects.scheduler;

import java.util.Map;

public class Job {

    private String id;
    private String group;
    private int interval;
    private Map<String, Object> jobDetails;

    public Job(String id, String group, int interval, Map<String, Object> jobDetails) {
        this.id = id;
        this.group = group;
        this.interval = interval;
        this.jobDetails = jobDetails;
    }

    public String getId() {
        return id;
    }

    public String getGroup() {
        return group;
    }

    public int getInterval() {
        return interval;
    }

    public Map<String, Object> getJobDetails() {
        return jobDetails;
    }
}
