package com.smartwardrobe.services;

import com.smartwardrobe.dto.CurrentWeather;
import com.smartwardrobe.dto.WeatherResponse;
import com.smartwardrobe.engine.OutfitEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/** Retrieves current and same-day forecast context from Open-Meteo. */
@Service
public class WeatherService {
    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);
    private static final String OPEN_METEO_URL =
            "https://api.open-meteo.com/v1/forecast"
            + "?latitude={lat}&longitude={lon}"
            + "&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code"
            + "&hourly=precipitation_probability"
            + "&daily=temperature_2m_min,temperature_2m_max"
            + "&forecast_days=1&timezone=auto";

    private final RestTemplate restTemplate;

    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Returns a safe, mild fallback context on an unavailable or malformed response.
     * It never fabricates measurements while claiming they came from the API.
     */
    public OutfitEngine.WeatherContext getWeatherContext(double latitude, double longitude) {
        try {
            WeatherResponse response = restTemplate.getForObject(
                    OPEN_METEO_URL, WeatherResponse.class, latitude, longitude);
            if (response == null || response.getCurrent() == null
                    || response.getCurrent().getTemperature() == null) {
                log.warn("Open-Meteo returned an incomplete response; using fallback weather context.");
                return OutfitEngine.WeatherContext.fallback();
            }

            CurrentWeather current = response.getCurrent();
            double feelsLike = valueOr(current.getApparentTemperature(), current.getTemperature());
            double min = feelsLike;
            double max = feelsLike;
            if (response.getDaily() != null) {
                min = firstOr(response.getDaily().getMinTemperatures(), feelsLike);
                max = firstOr(response.getDaily().getMaxTemperatures(), feelsLike);
            }

            int rainChance = maxProbabilityForCurrentDay(response);
            boolean raining = valueOr(current.getPrecipitation(), 0.0) > 0.0
                    || isRainWeatherCode(current.getWeatherCode());
            double wind = valueOr(current.getWindSpeed(), 5.0);
            log.info("Weather context loaded for ({}, {}): feels-like {}°C, range {}–{}°C, rain chance {}%, wind {} km/h",
                    latitude, longitude, feelsLike, min, max, rainChance, wind);
            return new OutfitEngine.WeatherContext(feelsLike, min, max, rainChance, raining, wind);
        } catch (Exception ex) {
            log.warn("Open-Meteo request failed; using fallback weather context. Cause: {}", ex.toString());
            return OutfitEngine.WeatherContext.fallback();
        }
    }

    /** Backwards-compatible helper retained for any existing callers. */
    public double getTemperature(double latitude, double longitude) {
        return getWeatherContext(latitude, longitude).feelsLike();
    }

    private int maxProbabilityForCurrentDay(WeatherResponse response) {
        if (response.getHourly() == null || response.getHourly().getTimes() == null
                || response.getHourly().getPrecipitationProbabilities() == null) return 0;
        List<Integer> probabilities = response.getHourly().getPrecipitationProbabilities();
        int max = 0;
        for (Integer probability : probabilities) {
            if (probability != null) max = Math.max(max, probability);
        }
        return max;
    }

    private boolean isRainWeatherCode(Integer code) {
        if (code == null) return false;
        return (code >= 51 && code <= 67) || (code >= 80 && code <= 82)
                || (code >= 95 && code <= 99);
    }

    private double firstOr(List<Double> values, double fallback) {
        return values != null && !values.isEmpty() && values.get(0) != null ? values.get(0) : fallback;
    }

    private double valueOr(Double value, double fallback) {
        return value == null || !Double.isFinite(value) ? fallback : value;
    }
}
