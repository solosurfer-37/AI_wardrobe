package com.smartwardrobe.dto;

public class CalendarEventResponse {
    private String eventName;
    private String eventType;
    private String dressCode;
    private String time;

    public CalendarEventResponse() {
    }

    public CalendarEventResponse(String eventName, String eventType, String dressCode, String time) {
        this.eventName = eventName;
        this.eventType = eventType;
        this.dressCode = dressCode;
        this.time = time;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getDressCode() {
        return dressCode;
    }

    public void setDressCode(String dressCode) {
        this.dressCode = dressCode;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
