package com.smartwardrobe.services;

import com.smartwardrobe.dto.WeatherResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Calls the Open-Meteo API to fetch current weather data.
 * No API key required — fully free and public.
 */
@Service
public class WeatherService {

    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    private static final String OPEN_METEO_URL =
            "https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true";

    private static final double DEFAULT_TEMPERATURE = 20.0;

    private final RestTemplate restTemplate;

    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetches the current temperature in °C for the given coordinates.
     * Returns a safe default of 20.0°C if the API call fails,
     * ensuring outfit recommendations are never blocked.
     */
    public double getTemperature(double latitude, double longitude) {
        try {
            WeatherResponse response = restTemplate.getForObject(
                    OPEN_METEO_URL,
                    WeatherResponse.class,
                    latitude,
                    longitude
            );

            if (response != null && response.getCurrentWeather() != null) {
                double temp = response.getCurrentWeather().getTemperature();
                log.info("Weather API: {}°C at ({}, {})", temp, latitude, longitude);
                return temp;
            }

            log.warn("Weather API returned null response. Using default: {}°C", DEFAULT_TEMPERATURE);
            return DEFAULT_TEMPERATURE;

        } catch (Exception e) {
            log.error("Weather API call failed: {}. Using default: {}°C", e.getMessage(), DEFAULT_TEMPERATURE);
            return DEFAULT_TEMPERATURE;
        }
    }
}
