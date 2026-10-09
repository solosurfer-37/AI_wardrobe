package com.smartwardrobe.dto;

import com.smartwardrobe.entities.ClothingItem;

/**
 * DTO representing a single recommended outfit combination.
 */
public class OutfitRecommendation {

    private ClothingItem top;
    private ClothingItem bottom;
    private ClothingItem footwear;
    private int totalWearCount;

    public OutfitRecommendation() {
    }

    public OutfitRecommendation(ClothingItem top, ClothingItem bottom, ClothingItem footwear, int totalWearCount) {
        this.top = top;
        this.bottom = bottom;
        this.footwear = footwear;
        this.totalWearCount = totalWearCount;
    }

    // ── Getters & Setters ──

    public ClothingItem getTop() {
        return top;
    }

    public void setTop(ClothingItem top) {
        this.top = top;
    }

    public ClothingItem getBottom() {
        return bottom;
    }

    public void setBottom(ClothingItem bottom) {
        this.bottom = bottom;
    }

    public ClothingItem getFootwear() {
        return footwear;
    }

    public void setFootwear(ClothingItem footwear) {
        this.footwear = footwear;
    }

    public int getTotalWearCount() {
        return totalWearCount;
    }

    public void setTotalWearCount(int totalWearCount) {
        this.totalWearCount = totalWearCount;
    }
}
