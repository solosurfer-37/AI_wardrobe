package com.smartwardrobe.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WeatherResponse {
    @JsonProperty("current")
    private CurrentWeather current;
    @JsonProperty("daily")
    private DailyWeather daily;
    @JsonProperty("hourly")
    private HourlyWeather hourly;

    public CurrentWeather getCurrent() { return current; }
    public void setCurrent(CurrentWeather current) { this.current = current; }
    public DailyWeather getDaily() { return daily; }
    public void setDaily(DailyWeather daily) { this.daily = daily; }
    public HourlyWeather getHourly() { return hourly; }
    public void setHourly(HourlyWeather hourly) { this.hourly = hourly; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DailyWeather {
        @JsonProperty("temperature_2m_min")
        private List<Double> minTemperatures;
        @JsonProperty("temperature_2m_max")
        private List<Double> maxTemperatures;
        public List<Double> getMinTemperatures() { return minTemperatures; }
        public void setMinTemperatures(List<Double> values) { this.minTemperatures = values; }
        public List<Double> getMaxTemperatures() { return maxTemperatures; }
        public void setMaxTemperatures(List<Double> values) { this.maxTemperatures = values; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class HourlyWeather {
        @JsonProperty("time")
        private List<String> times;
        @JsonProperty("precipitation_probability")
        private List<Integer> precipitationProbabilities;
        public List<String> getTimes() { return times; }
        public void setTimes(List<String> times) { this.times = times; }
        public List<Integer> getPrecipitationProbabilities() { return precipitationProbabilities; }
        public void setPrecipitationProbabilities(List<Integer> values) { this.precipitationProbabilities = values; }
    }
}
