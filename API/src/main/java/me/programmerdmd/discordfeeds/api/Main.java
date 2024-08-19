package me.programmerdmd.discordfeeds.api;

import com.google.gson.Gson;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
public class Main {

	public static void main(String[] args) throws IOException {
		Authenticator authenticator = new Authenticator() {
			public PasswordAuthentication getPasswordAuthentication() {
				return (new PasswordAuthentication(System.getenv("PROXY_USER"), System.getenv("PROXY_PASSWORD").toCharArray())); //enter credentials
			}
		};
		Authenticator.setDefault(authenticator);

		System.setProperty("http.proxyUser", System.getenv("PROXY_USER"));
		System.setProperty("http.proxyPassword", System.getenv("PROXY_PASSWORD"));
		System.setProperty("jdk.http.auth.tunneling.disabledSchemes", "");

		SpringApplication.run(Main.class, args);
	}

	public static Gson gson = new Gson();

	public static String getJson(String url, boolean useProxy) throws IOException {
		URL urlConn = new URL(url);

		HttpURLConnection httpConn = (HttpURLConnection) (useProxy ? urlConn.openConnection(new Proxy(Proxy.Type.HTTP, new InetSocketAddress("us.smartproxy.com", 20000))) : urlConn.openConnection());

		try (InputStream input = httpConn.getInputStream()) {
			InputStreamReader isr = new InputStreamReader(input);
			BufferedReader reader = new BufferedReader(isr);
			StringBuilder json = new StringBuilder();
			int c;
			while ((c = reader.read()) != -1) {
				json.append((char) c);
			}

			return json.toString();
		} finally {
			httpConn.disconnect();
		}
	}

	public static String postRequest(String url, String body, boolean useProxy) throws IOException {
		URL urlConn = new URL(url);
		HttpURLConnection httpConn = (HttpURLConnection) (useProxy ? urlConn.openConnection(new Proxy(Proxy.Type.HTTP, new InetSocketAddress("us.smartproxy.com", 20000))) : urlConn.openConnection());
		httpConn.addRequestProperty("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246");
		httpConn.setRequestMethod("POST");
		httpConn.setRequestProperty("Accept", "application/json");
		httpConn.setRequestProperty("Content-Type", "application/json");
		httpConn.setDoOutput(true);

		try (OutputStream os = httpConn.getOutputStream()) {
			byte[] input = body.getBytes(StandardCharsets.UTF_8);
			os.write(input, 0, input.length);
		}

		try (InputStream input = httpConn.getInputStream()) {
			InputStreamReader isr = new InputStreamReader(input);
			BufferedReader reader = new BufferedReader(isr);
			StringBuilder json = new StringBuilder();
			int c;
			while ((c = reader.read()) != -1) {
				json.append((char) c);
			}

			return json.toString();
		} finally {
			httpConn.disconnect();
		}

	}

}
