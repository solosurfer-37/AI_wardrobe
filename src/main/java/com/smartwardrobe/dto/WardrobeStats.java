package com.smartwardrobe.dto;

import com.smartwardrobe.entities.ClothingItem;

import java.util.List;

public class WardrobeStats {

    private long totalItems;
    private double utilizationRate; // Percentage 0.0 - 100.0
    private List<ClothingItem> mostWorn;
    private List<ClothingItem> leastWorn;
    private double averageCostPerWear; // Overall wardrobe CPW

    public WardrobeStats() {
    }

    public long getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(long totalItems) {
        this.totalItems = totalItems;
    }

    public double getUtilizationRate() {
        return utilizationRate;
    }

    public void setUtilizationRate(double utilizationRate) {
        this.utilizationRate = utilizationRate;
    }

    public List<ClothingItem> getMostWorn() {
        return mostWorn;
    }

    public void setMostWorn(List<ClothingItem> mostWorn) {
        this.mostWorn = mostWorn;
    }

    public List<ClothingItem> getLeastWorn() {
        return leastWorn;
    }

    public void setLeastWorn(List<ClothingItem> leastWorn) {
        this.leastWorn = leastWorn;
    }

    public double getAverageCostPerWear() {
        return averageCostPerWear;
    }

    public void setAverageCostPerWear(double averageCostPerWear) {
        this.averageCostPerWear = averageCostPerWear;
    }
}
