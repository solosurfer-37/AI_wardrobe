package com.smartwardrobe.engine;

import com.smartwardrobe.dto.OutfitRecommendation;
import com.smartwardrobe.entities.ClothingItem;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class OutfitEngineTest {
    private final OutfitEngine engine = new OutfitEngine();

    @Test
    void returnsRankedRecommendationsWithScoreAndExplanation() {
        List<ClothingItem> closet = List.of(
                item("t-shirt", "white", "cotton", 0),
                item("shirt", "beige", "linen", 2),
                item("jeans", "blue", "denim", 4),
                item("pants", "gray", "chino", 1),
                item("sneakers", "white", "leather", 3),
                item("loafers", "brown", "leather", 1)
        );

        List<OutfitRecommendation> recommendations = engine.recommend(
                closet, OutfitEngine.WeatherContext.fallback(), OutfitEngine.Event.COLLEGE);

        assertFalse(recommendations.isEmpty());
        assertTrue(recommendations.size() <= 3);
        for (OutfitRecommendation recommendation : recommendations) {
            assertNotNull(recommendation.getTop());
            assertNotNull(recommendation.getBottom());
            assertNotNull(recommendation.getFootwear());
            assertTrue(Double.isFinite(recommendation.getScore()));
            assertNotNull(recommendation.getReason());
            assertTrue(recommendation.getTotalWearCount() >= 0);
        }
    }

    @Test
    void returnsNoRecommendationsWhenRequiredSlotsAreMissing() {
        List<OutfitRecommendation> recommendations = engine.recommend(
                List.of(item("t-shirt", "white", "cotton", 0)),
                OutfitEngine.WeatherContext.fallback(), OutfitEngine.Event.CASUAL);

        assertTrue(recommendations.isEmpty());
    }

    private ClothingItem item(String type, String color, String pattern, int wears) {
        ClothingItem item = new ClothingItem();
        item.setType(type);
        item.setColor(color);
        item.setPattern(pattern);
        item.setWearCount(wears);
        return item;
    }
}
