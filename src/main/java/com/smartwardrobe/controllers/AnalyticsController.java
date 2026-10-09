package com.smartwardrobe.controllers;

import com.smartwardrobe.dto.WardrobeStats;
import com.smartwardrobe.services.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * GET /api/analytics/wardrobe-stats
     * Provides aggregated statistics for the user's wardrobe, 
     * including utilization rate and cost-per-wear metrics.
     *
     * @return 200 OK with WardrobeStats JSON payload
     */
    @GetMapping("/wardrobe-stats")
    public ResponseEntity<WardrobeStats> getWardrobeStats() {
        WardrobeStats stats = analyticsService.getWardrobeStats();
        return ResponseEntity.ok(stats);
    }
}
