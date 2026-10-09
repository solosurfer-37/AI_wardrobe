package com.smartwardrobe.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Nested DTO representing the current_weather block from Open-Meteo.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class CurrentWeather {

    private double temperature;
    private double windspeed;
    private int weathercode;

    public CurrentWeather() {
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public double getWindspeed() {
        return windspeed;
    }

    public void setWindspeed(double windspeed) {
        this.windspeed = windspeed;
    }

    public int getWeathercode() {
        return weathercode;
    }

    public void setWeathercode(int weathercode) {
        this.weathercode = weathercode;
    }
}
