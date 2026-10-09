package com.smartwardrobe.services;

import com.smartwardrobe.dto.OutfitRecommendation;
import com.smartwardrobe.entities.ClothingItem;
import com.smartwardrobe.repositories.ClothingItemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

/**
 * AI-driven outfit recommendation engine with weather awareness.
 */
@Service
public class OutfitRecommendationService {

    // ── Category definitions ──

    private static final Set<String> REGULAR_TOP_TYPES = Set.of(
        "shirt", "t-shirt", "blouse", "top"
    );

    private static final Set<String> OUTERWEAR_TYPES = Set.of(
        "jacket", "sweater", "hoodie"
    );

    private static final Set<String> BOTTOM_TYPES = Set.of(
        "pants", "jeans", "shorts", "skirt", "trousers"
    );

    private static final Set<String> FOOTWEAR_TYPES = Set.of(
        "shoes", "sneakers", "boots", "sandals", "loafers"
    );

    // ── Color Compatibility Graph (symmetric clash pairs) ──

    private static final Set<Set<String>> CLASHING_PAIRS = Set.of(
        Set.of("red", "green"),
        Set.of("red", "orange"),
        Set.of("red", "pink"),
        Set.of("orange", "pink"),
        Set.of("brown", "black"),
        Set.of("navy", "black"),
        Set.of("green", "orange"),
        Set.of("purple", "red"),
        Set.of("yellow", "green"),
        Set.of("brown", "gray")
    );

    private static final int RECENCY_DAYS = 2;
    private static final int MAX_RECOMMENDATIONS = 3;
    private static final double COLD_THRESHOLD_CELSIUS = 15.0;

    private final ClothingItemRepository clothingItemRepository;
    private final WeatherService weatherService;

    public OutfitRecommendationService(ClothingItemRepository clothingItemRepository, WeatherService weatherService) {
        this.clothingItemRepository = clothingItemRepository;
        this.weatherService = weatherService;
    }

    /**
     * Generates context-aware outfit recommendations based on weather and wear history.
     */
    public List<OutfitRecommendation> recommendOutfits(double latitude, double longitude) {
        List<ClothingItem> allItems = clothingItemRepository.findAll();
        LocalDate cutoffDate = LocalDate.now().minusDays(RECENCY_DAYS);

        // Filter and categorize base items
        List<ClothingItem> tops = filterAndCategorize(allItems, REGULAR_TOP_TYPES, cutoffDate);
        List<ClothingItem> bottoms = filterAndCategorize(allItems, BOTTOM_TYPES, cutoffDate);
        List<ClothingItem> footwear = filterAndCategorize(allItems, FOOTWEAR_TYPES, cutoffDate);

        if (tops.isEmpty() || bottoms.isEmpty() || footwear.isEmpty()) {
            return List.of(); // Cannot form a base outfit
        }

        // Fetch weather
        double currentTemp = weatherService.getTemperature(latitude, longitude);
        boolean isCold = currentTemp < COLD_THRESHOLD_CELSIUS;

        List<OutfitRecommendation> candidates = new ArrayList<>();

        if (isCold) {
            // Cold weather: Need Outerwear (4-way combinations)
            List<ClothingItem> outerwears = filterAndCategorize(allItems, OUTERWEAR_TYPES, cutoffDate);
            
            for (ClothingItem top : tops) {
                for (ClothingItem bottom : bottoms) {
                    for (ClothingItem shoe : footwear) {
                        for (ClothingItem outerwear : outerwears) {
                            if (isCompatibleCombo(top, bottom, shoe, outerwear)) {
                                int score = top.getWearCount() + bottom.getWearCount() + 
                                            shoe.getWearCount() + outerwear.getWearCount();
                                candidates.add(new OutfitRecommendation(top, bottom, shoe, outerwear, score));
                            }
                        }
                    }
                }
            }
        } else {
            // Warm weather: Base outfit only (3-way combinations)
            for (ClothingItem top : tops) {
                for (ClothingItem bottom : bottoms) {
                    for (ClothingItem shoe : footwear) {
                        if (isCompatibleCombo(top, bottom, shoe, null)) {
                            int score = top.getWearCount() + bottom.getWearCount() + shoe.getWearCount();
                            candidates.add(new OutfitRecommendation(top, bottom, shoe, null, score));
                        }
                    }
                }
            }
        }

        // Sort ascending by score (prioritize least worn items), return top 3
        candidates.sort(Comparator.comparingInt(OutfitRecommendation::getTotalWearCount));

        return candidates.stream()
                .limit(MAX_RECOMMENDATIONS)
                .toList();
    }

    // ───────────────────────── Private helpers ─────────────────────────

    private List<ClothingItem> filterAndCategorize(List<ClothingItem> items,
                                                   Set<String> acceptedTypes,
                                                   LocalDate cutoffDate) {
        return items.stream()
                .filter(item -> acceptedTypes.contains(item.getType().toLowerCase().trim()))
                .filter(item -> item.getLastWornDate() == null || item.getLastWornDate().isBefore(cutoffDate))
                .sorted(Comparator.comparingInt(ClothingItem::getWearCount))
                .toList();
    }

    /**
     * Validates color compatibility. If outerwear is provided, checks all 6 edges.
     * Otherwise, checks the 3 edges of the base outfit.
     */
    private boolean isCompatibleCombo(ClothingItem top, ClothingItem bottom, ClothingItem footwear, ClothingItem outerwear) {
        boolean baseCompatible = !areColorsClashing(top.getColor(), bottom.getColor())
                              && !areColorsClashing(top.getColor(), footwear.getColor())
                              && !areColorsClashing(bottom.getColor(), footwear.getColor());

        if (!baseCompatible || outerwear == null) {
            return baseCompatible;
        }

        // Additional checks if outerwear is present
        return !areColorsClashing(outerwear.getColor(), top.getColor())
            && !areColorsClashing(outerwear.getColor(), bottom.getColor())
            && !areColorsClashing(outerwear.getColor(), footwear.getColor());
    }

    private boolean areColorsClashing(String color1, String color2) {
        String c1 = color1.toLowerCase().trim();
        String c2 = color2.toLowerCase().trim();
        return CLASHING_PAIRS.contains(Set.of(c1, c2));
    }
}
