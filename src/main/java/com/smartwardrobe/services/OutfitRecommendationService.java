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
 * AI-driven outfit recommendation engine.
 *
 * Pipeline:
 *   1. Categorize items into tops / bottoms / footwear
 *   2. Filter out items worn within the last 2 days
 *   3. Validate color compatibility (clash matrix)
 *   4. Score combinations by cumulative wearCount (lower = better)
 *   5. Return the top 3 optimal outfits
 */
@Service
public class OutfitRecommendationService {

    // ── Category definitions ──

    private static final Set<String> TOP_TYPES = Set.of(
        "shirt", "t-shirt", "blouse", "sweater", "jacket", "hoodie", "top"
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

    private final ClothingItemRepository clothingItemRepository;

    public OutfitRecommendationService(ClothingItemRepository clothingItemRepository) {
        this.clothingItemRepository = clothingItemRepository;
    }

    /**
     * Generates up to 3 context-aware outfit recommendations.
     */
    public List<OutfitRecommendation> recommendOutfits() {

        List<ClothingItem> allItems = clothingItemRepository.findAll();
        LocalDate cutoffDate = LocalDate.now().minusDays(RECENCY_DAYS);

        // ── Step 1 & 2: Categorize + recency filter ──
        List<ClothingItem> tops     = filterAndCategorize(allItems, TOP_TYPES, cutoffDate);
        List<ClothingItem> bottoms  = filterAndCategorize(allItems, BOTTOM_TYPES, cutoffDate);
        List<ClothingItem> footwear = filterAndCategorize(allItems, FOOTWEAR_TYPES, cutoffDate);

        if (tops.isEmpty() || bottoms.isEmpty() || footwear.isEmpty()) {
            return List.of();
        }

        // ── Step 3 & 4: Generate compatible combos, score by wearCount ──
        List<OutfitRecommendation> candidates = new ArrayList<>();

        for (ClothingItem top : tops) {
            for (ClothingItem bottom : bottoms) {
                for (ClothingItem shoe : footwear) {
                    if (isCompatibleCombo(top, bottom, shoe)) {
                        int score = top.getWearCount() + bottom.getWearCount() + shoe.getWearCount();
                        candidates.add(new OutfitRecommendation(top, bottom, shoe, score));
                    }
                }
            }
        }

        // ── Step 5: Sort ascending by score, return top 3 ──
        candidates.sort(Comparator.comparingInt(OutfitRecommendation::getTotalWearCount));

        return candidates.stream()
                .limit(MAX_RECOMMENDATIONS)
                .toList();
    }

    // ───────────────────────── Private helpers ─────────────────────────

    /**
     * Filters items to a specific category and removes those worn within the cutoff window.
     * Results are pre-sorted by wearCount ascending.
     */
    private List<ClothingItem> filterAndCategorize(List<ClothingItem> items,
                                                    Set<String> acceptedTypes,
                                                    LocalDate cutoffDate) {
        return items.stream()
                .filter(item -> acceptedTypes.contains(item.getType().toLowerCase().trim()))
                .filter(item -> item.getLastWornDate() == null
                             || item.getLastWornDate().isBefore(cutoffDate))
                .sorted(Comparator.comparingInt(ClothingItem::getWearCount))
                .toList();
    }

    /**
     * Validates that no two items in the combination have clashing colors.
     * Checks all three edges: top↔bottom, top↔footwear, bottom↔footwear.
     */
    private boolean isCompatibleCombo(ClothingItem top, ClothingItem bottom, ClothingItem footwear) {
        return !areColorsClashing(top.getColor(), bottom.getColor())
            && !areColorsClashing(top.getColor(), footwear.getColor())
            && !areColorsClashing(bottom.getColor(), footwear.getColor());
    }

    /**
     * Checks if two colors form a known clashing pair.
     * Comparison is case-insensitive and trimmed.
     */
    private boolean areColorsClashing(String color1, String color2) {
        String c1 = color1.toLowerCase().trim();
        String c2 = color2.toLowerCase().trim();
        return CLASHING_PAIRS.contains(Set.of(c1, c2));
    }
}
