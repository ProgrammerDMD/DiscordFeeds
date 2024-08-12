package me.programmerdmd.discordfeeds.api.objects.scheduler;

import jakarta.validation.constraints.NotNull;

public class PurgerBody {

    @NotNull
    private String id;

    @NotNull
    private long purgeAtMillis;

    public PurgerBody(String id, long purgeAtMillis) {
        this.id = id;
        this.purgeAtMillis = purgeAtMillis;
    }

    public String getId() {
        return id;
    }

    public long getPurgeAtMillis() {
        return purgeAtMillis;
    }
}
