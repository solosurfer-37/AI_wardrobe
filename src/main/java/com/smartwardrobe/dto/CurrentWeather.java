package com.smartwardrobe.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CurrentWeather {
    @JsonProperty("temperature_2m")
    private Double temperature;
    @JsonProperty("apparent_temperature")
    private Double apparentTemperature;
    @JsonProperty("precipitation")
    private Double precipitation;
    @JsonProperty("wind_speed_10m")
    private Double windSpeed;
    @JsonProperty("weather_code")
    private Integer weatherCode;

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
    public Double getApparentTemperature() { return apparentTemperature; }
    public void setApparentTemperature(Double apparentTemperature) { this.apparentTemperature = apparentTemperature; }
    public Double getPrecipitation() { return precipitation; }
    public void setPrecipitation(Double precipitation) { this.precipitation = precipitation; }
    public Double getWindSpeed() { return windSpeed; }
    public void setWindSpeed(Double windSpeed) { this.windSpeed = windSpeed; }
    public Integer getWeatherCode() { return weatherCode; }
    public void setWeatherCode(Integer weatherCode) { this.weatherCode = weatherCode; }
}
