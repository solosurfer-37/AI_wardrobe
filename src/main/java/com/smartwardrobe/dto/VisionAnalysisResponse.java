package com.smartwardrobe.dto;

import java.util.List;

public class VisionAnalysisResponse {
    private List<String> tags;
    private String primaryColor;
    private String detectedCategory;
    private double confidenceScore;

    public VisionAnalysisResponse() {
    }

    public VisionAnalysisResponse(List<String> tags, String primaryColor, String detectedCategory, double confidenceScore) {
        this.tags = tags;
        this.primaryColor = primaryColor;
        this.detectedCategory = detectedCategory;
        this.confidenceScore = confidenceScore;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getPrimaryColor() {
        return primaryColor;
    }

    public void setPrimaryColor(String primaryColor) {
        this.primaryColor = primaryColor;
    }

    public String getDetectedCategory() {
        return detectedCategory;
    }

    public void setDetectedCategory(String detectedCategory) {
        this.detectedCategory = detectedCategory;
    }

    public double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
}
