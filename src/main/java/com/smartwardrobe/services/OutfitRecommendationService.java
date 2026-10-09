package com.smartwardrobe.services;

import com.smartwardrobe.dto.OutfitRecommendation;
import com.smartwardrobe.engine.OutfitEngine;
import com.smartwardrobe.entities.ClothingItem;
import com.smartwardrobe.entities.User;
import com.smartwardrobe.repositories.ClothingItemRepository;
import com.smartwardrobe.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

/**
 * Orchestrates wardrobe loading, weather lookup and the single recommendation
 * engine.
 */
@Service
public class OutfitRecommendationService {
    private final ClothingItemRepository clothingItemRepository;
    private final UserRepository userRepository;
    private final WeatherService weatherService;
    private final OutfitEngine outfitEngine;

    public OutfitRecommendationService(ClothingItemRepository clothingItemRepository,
            UserRepository userRepository,
            WeatherService weatherService,
            OutfitEngine outfitEngine) {
        this.clothingItemRepository = clothingItemRepository;
        this.userRepository = userRepository;
        this.weatherService = weatherService;
        this.outfitEngine = outfitEngine;
    }

    /**
     * The project currently has no authentication/current-user component.
     * Until one exists, use the same deterministic first-user convention as the
     * demo wardrobe and never combine different users' clothing in one outfit.
     */
    @Transactional(readOnly = true)
    public List<OutfitRecommendation> recommendOutfits(double latitude, double longitude) {
        return recommendOutfits(latitude, longitude, null);
    }

    @Transactional(readOnly = true)
    public List<OutfitRecommendation> recommendOutfits(double latitude, double longitude, String event) {
        User wardrobeOwner = userRepository.findAll().stream()
                .min(Comparator.comparing(User::getId, Comparator.nullsLast(Comparator.naturalOrder())))
                .orElse(null);
        if (wardrobeOwner == null || wardrobeOwner.getId() == null) {
            return List.of();
        }

        List<ClothingItem> closet = clothingItemRepository.findByUserId(wardrobeOwner.getId());
        if (closet.isEmpty()) {
            return List.of();
        }

        OutfitEngine.WeatherContext weather = weatherService.getWeatherContext(latitude, longitude);
        return outfitEngine.recommend(closet, weather, OutfitEngine.Event.parse(event));
    }
}
