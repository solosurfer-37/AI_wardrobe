package com.smartwardrobe.controllers;

import com.smartwardrobe.dto.OutfitRecommendation;
import com.smartwardrobe.services.OutfitRecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
     * GET /api/outfits/recommend
     * Returns up to 3 AI-recommended outfit combinations based on
     * recency filtering, color compatibility, and wear-count optimization.
     *
     * @return 200 OK with list of recommendations (may be empty)
     */
    @GetMapping("/recommend")
    public ResponseEntity<List<OutfitRecommendation>> getRecommendations() {
        List<OutfitRecommendation> recommendations = outfitRecommendationService.recommendOutfits();
        return ResponseEntity.ok(recommendations);
    }
}
