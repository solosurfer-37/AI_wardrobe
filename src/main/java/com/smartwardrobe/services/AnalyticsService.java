package com.smartwardrobe.services;

import com.smartwardrobe.dto.WardrobeStats;
import com.smartwardrobe.entities.ClothingItem;
import com.smartwardrobe.repositories.ClothingItemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final ClothingItemRepository clothingItemRepository;

    public AnalyticsService(ClothingItemRepository clothingItemRepository) {
        this.clothingItemRepository = clothingItemRepository;
    }

    /**
     * Calculates and returns various wardrobe analytics.
     */
    public WardrobeStats getWardrobeStats() {
        List<ClothingItem> items = clothingItemRepository.findAll();

        WardrobeStats stats = new WardrobeStats();
        stats.setTotalItems(items.size());

        if (items.isEmpty()) {
            stats.setUtilizationRate(0.0);
            stats.setMostWorn(List.of());
            stats.setLeastWorn(List.of());
            stats.setAverageCostPerWear(0.0);
            return stats;
        }

        // ── 1. Utilization Rate (Worn within last 30 days) ──
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        long activeItems = items.stream()
                .filter(item -> item.getLastWornDate() != null && !item.getLastWornDate().isBefore(thirtyDaysAgo))
                .count();
        double utilizationRate = ((double) activeItems / items.size()) * 100.0;
        stats.setUtilizationRate(utilizationRate);

        // ── 2. Most Worn Items (Top 3) ──
        List<ClothingItem> mostWorn = items.stream()
                .sorted(Comparator.comparingInt(ClothingItem::getWearCount).reversed())
                .limit(3)
                .collect(Collectors.toList());
        stats.setMostWorn(mostWorn);

        // ── 3. Least Worn Items (Top 3) ──
        List<ClothingItem> leastWorn = items.stream()
                .sorted(Comparator.comparingInt(ClothingItem::getWearCount))
                .limit(3)
                .collect(Collectors.toList());
        stats.setLeastWorn(leastWorn);

        // ── 4. Average Cost-Per-Wear (CPW) ──
        double totalCost = items.stream()
                .mapToDouble(item -> item.getPrice() != null ? item.getPrice() : 0.0)
                .sum();
        long totalWears = items.stream()
                .mapToLong(ClothingItem::getWearCount)
                .sum();

        if (totalWears > 0) {
            stats.setAverageCostPerWear(totalCost / totalWears);
        } else {
            // If the wardrobe has never been worn, the cost-per-wear is the full cost of the wardrobe.
            stats.setAverageCostPerWear(totalCost);
        }

        return stats;
    }
}
