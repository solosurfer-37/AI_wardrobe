package com.smartwardrobe.controllers;

import com.smartwardrobe.dto.OutfitRecommendation;
import com.smartwardrobe.services.OutfitRecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/outfits")
public class OutfitController {

    private final OutfitRecommendationService outfitRecommendationService;

    public OutfitController(OutfitRecommendationService outfitRecommendationService) {
        this.outfitRecommendationService = outfitRecommendationService;
    }

    /**
     * GET /api/outfits/recommend?latitude={lat}&longitude={lon}
     * Returns up to 3 AI-recommended outfit combinations.
     * Integrates weather data to add outerwear if temperature < 15°C.
     */
    @GetMapping("/recommend")
    public ResponseEntity<List<OutfitRecommendation>> getRecommendations(
            @RequestParam(defaultValue = "28.6139") double latitude,
            @RequestParam(defaultValue = "77.2090") double longitude) {
        
        List<OutfitRecommendation> recommendations = outfitRecommendationService.recommendOutfits(latitude, longitude);
        return ResponseEntity.ok(recommendations);
    }
}
