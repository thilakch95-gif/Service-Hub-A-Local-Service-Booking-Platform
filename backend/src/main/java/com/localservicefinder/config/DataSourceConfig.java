package com.localservicefinder.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Configuration
public class DataSourceConfig {

    private final Environment environment;

    public DataSourceConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        DatabaseSettings settings = resolveDatabaseSettings();

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(settings.jdbcUrl());
        dataSource.setUsername(settings.username());
        dataSource.setPassword(settings.password());
        dataSource.setDriverClassName(settings.driverClassName());

        return dataSource;
    }

    private DatabaseSettings resolveDatabaseSettings() {
        String jdbcDatabaseUrl = trim(environment.getProperty("JDBC_DATABASE_URL"));
        if (StringUtils.hasText(jdbcDatabaseUrl)) {
            return fromJdbcUrl(jdbcDatabaseUrl);
        }

        String databaseUrl = trim(environment.getProperty("DATABASE_URL"));
        if (StringUtils.hasText(databaseUrl)) {
            return fromDatabaseUrl(databaseUrl);
        }

        String host = requireProperty("DB_HOST");
        String port = trim(environment.getProperty("DB_PORT", "5432"));
        String name = trim(environment.getProperty("DB_NAME", "local_service_finder"));
        String username = trim(environment.getProperty("DB_USERNAME", "postgres"));
        String password = trim(environment.getProperty("DB_PASSWORD", "postgres"));
        String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + name;

        return new DatabaseSettings(jdbcUrl, username, password, "org.postgresql.Driver");
    }

    private DatabaseSettings fromJdbcUrl(String jdbcUrl) {
        String username = trim(environment.getProperty("DB_USERNAME", environment.getProperty("DATABASE_USERNAME", "")));
        String password = trim(environment.getProperty("DB_PASSWORD", environment.getProperty("DATABASE_PASSWORD", "")));
        return new DatabaseSettings(jdbcUrl, username, password, "org.postgresql.Driver");
    }

    private DatabaseSettings fromDatabaseUrl(String databaseUrl) {
        URI uri = URI.create(trim(databaseUrl));
        String scheme = trim(uri.getScheme()).toLowerCase();
        if (!"postgres".equals(scheme) && !"postgresql".equals(scheme)) {
            throw new IllegalStateException("Unsupported DATABASE_URL scheme: " + scheme);
        }

        String[] credentials = parseCredentials(uri.getUserInfo());
        String username = firstNonBlank(trim(environment.getProperty("DB_USERNAME")), credentials[0]);
        String password = firstNonBlank(trim(environment.getProperty("DB_PASSWORD")), credentials[1]);
        int port = uri.getPort() > 0 ? uri.getPort() : 5432;
        String database = trim(uri.getPath()).replaceFirst("^/", "");
        String query = StringUtils.hasText(uri.getRawQuery()) ? "?" + uri.getRawQuery() : "";

        String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + "/" + database + query;

        return new DatabaseSettings(jdbcUrl, username, password, "org.postgresql.Driver");
    }

    private String[] parseCredentials(String userInfo) {
        if (!StringUtils.hasText(userInfo)) {
            return new String[]{"", ""};
        }

        String[] parts = userInfo.split(":", 2);
        String username = decode(parts[0]);
        String password = parts.length > 1 ? decode(parts[1]) : "";

        return new String[]{username, password};
    }

    private String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private String firstNonBlank(String first, String second) {
        return StringUtils.hasText(first) ? first : second;
    }

    private String requireProperty(String key) {
        String value = trim(environment.getProperty(key));
        if (StringUtils.hasText(value)) {
            return value;
        }

        throw new IllegalStateException("Missing required database setting: " + key);
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private record DatabaseSettings(String jdbcUrl, String username, String password, String driverClassName) {
    }
}
