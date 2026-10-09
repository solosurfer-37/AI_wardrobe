package com.smartwardrobe.dto;

import com.smartwardrobe.entities.ClothingItem;

/** DTO representing a single recommended outfit combination. */
public class OutfitRecommendation {
    private ClothingItem top;
    private ClothingItem bottom;
    private ClothingItem footwear;
    private ClothingItem outerwear;
    private int totalWearCount;
    private double score;
    private String reason;

    public OutfitRecommendation() {
    }

    public OutfitRecommendation(ClothingItem top, ClothingItem bottom, ClothingItem footwear,
                                ClothingItem outerwear, int totalWearCount) {
        this.top = top;
        this.bottom = bottom;
        this.footwear = footwear;
        this.outerwear = outerwear;
        this.totalWearCount = totalWearCount;
    }

    public ClothingItem getTop() { return top; }
    public void setTop(ClothingItem top) { this.top = top; }
    public ClothingItem getBottom() { return bottom; }
    public void setBottom(ClothingItem bottom) { this.bottom = bottom; }
    public ClothingItem getFootwear() { return footwear; }
    public void setFootwear(ClothingItem footwear) { this.footwear = footwear; }
    public ClothingItem getOuterwear() { return outerwear; }
    public void setOuterwear(ClothingItem outerwear) { this.outerwear = outerwear; }
    public int getTotalWearCount() { return totalWearCount; }
    public void setTotalWearCount(int totalWearCount) { this.totalWearCount = totalWearCount; }
    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
