package me.programmerdmd.discordfeeds.api.jobs;

import com.google.gson.reflect.TypeToken;
import io.sentry.Sentry;
import me.programmerdmd.discordfeeds.api.Main;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class BotGuildsJob implements Job {

    @Autowired
    private Environment environment;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        try {
            Map<String, Object> response = Main.gson.fromJson(Main.getJson("http://localhost:8080/bot/guilds", false), new TypeToken<HashMap<String, Objects>>(){}.getType());

            URL urlConn = new URL("https://top.gg/api/bots/" + environment.getProperty("BOT_ID") + "/stats");
            HttpURLConnection httpConn = (HttpURLConnection) urlConn.openConnection();
            httpConn.addRequestProperty("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246");
            httpConn.setRequestMethod("POST");
            httpConn.setRequestProperty("Authorization", environment.getProperty("TOPGG_AUTHORIZATION"));
            httpConn.setRequestProperty("Accept", "application/json");
            httpConn.setRequestProperty("Content-Type", "application/json");
            httpConn.setDoOutput(true);

            try (OutputStream os = httpConn.getOutputStream()) {
                byte[] input = ("{ \"server_count\": " + response.get("guilds") + "}").getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            try (InputStream input = httpConn.getInputStream()) {

            } finally {
                httpConn.disconnect();
            }
        } catch (Exception e) {
            e.printStackTrace();
            Sentry.captureException(e);
        }
    }

}
