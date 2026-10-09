package com.smartwardrobe;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartWardrobeApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

		configureDatasource(dotenv);

		SpringApplication.run(SmartWardrobeApplication.class, args);
	}

	/**
	 * Makes SUPABASE_DB_* the single source of truth for the datasource.
	 *
	 * Java system properties outrank OS environment variables and application.properties,
	 * so a stale SPRING_DATASOURCE_URL / SPRING_DATASOURCE_USERNAME / SPRING_DATASOURCE_PASSWORD
	 * left over in the shell (or in Windows user variables) can no longer override the values
	 * from .env. A URL pasted without the "jdbc:" prefix is repaired. Passwords are never printed.
	 */
	private static void configureDatasource(Dotenv dotenv) {
		String rawUrl = dotenv.get("SUPABASE_DB_URL");
		if (rawUrl == null || rawUrl.isBlank()) {
			System.out.println("[config] SUPABASE_DB_URL is not set; the datasource comes from application.properties");
			return;
		}

		String url = normalizeJdbcUrl(rawUrl);
		System.setProperty("spring.datasource.url", url);

		String user = dotenv.get("SUPABASE_DB_USER");
		if (user != null && !user.isBlank()) {
			System.setProperty("spring.datasource.username", user.trim());
		}
		String password = dotenv.get("SUPABASE_DB_PASSWORD");
		if (password != null && !password.isBlank()) {
			System.setProperty("spring.datasource.password", password);
		}

		String source = System.getenv("SUPABASE_DB_URL") != null ? "OS environment variable" : ".env file";
		System.out.println("[config] spring.datasource.url = " + describeJdbcUrl(url) + " (from " + source + ")");
		if (!url.equals(rawUrl.trim())) {
			System.out.println("[config] SUPABASE_DB_URL was missing the 'jdbc:' prefix; it has been added.");
		}
		for (String name : new String[] {"SPRING_DATASOURCE_URL", "SPRING_DATASOURCE_USERNAME", "SPRING_DATASOURCE_PASSWORD"}) {
			if (System.getenv(name) != null) {
				System.out.println("[config] Note: OS variable " + name + " is set; it is ignored in favour of SUPABASE_DB_*.");
			}
		}
	}

	/** Adds the required "jdbc:" prefix (and turns postgres:// into postgresql://) when it is missing. */
	static String normalizeJdbcUrl(String raw) {
		String url = raw.trim();
		if (url.length() >= 2
				&& ((url.startsWith("\"") && url.endsWith("\"")) || (url.startsWith("'") && url.endsWith("'")))) {
			url = url.substring(1, url.length() - 1).trim();
		}
		if (url.regionMatches(true, 0, "jdbc:", 0, 5)) {
			return url;
		}
		if (url.startsWith("postgres://")) {
			url = "postgresql://" + url.substring("postgres://".length());
		}
		if (url.startsWith("postgresql://")) {
			return "jdbc:" + url;
		}
		return url;   // anything else is left untouched so the driver reports it
	}

	/** Safe-to-log form of a JDBC URL: no credentials, no query string. */
	static String describeJdbcUrl(String url) {
		String shown = url.replaceFirst("(?i)//[^/?#]*@", "//");
		int query = shown.indexOf('?');
		return query >= 0 ? shown.substring(0, query) : shown;
	}

}
