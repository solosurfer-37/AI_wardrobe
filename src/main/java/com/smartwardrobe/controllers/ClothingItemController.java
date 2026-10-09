package com.smartwardrobe.controllers;

import com.smartwardrobe.entities.ClothingItem;
import com.smartwardrobe.services.ClothingItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/clothes")
public class ClothingItemController {

    private final ClothingItemService clothingItemService;

    public ClothingItemController(ClothingItemService clothingItemService) {
        this.clothingItemService = clothingItemService;
    }

    /**
     * POST /api/clothes
     * Accepts a JSON payload and creates a new clothing item.
     *
     * @return 201 Created with the saved item
     */
    @PostMapping
    public ResponseEntity<ClothingItem> addClothingItem(@Valid @RequestBody ClothingItem clothingItem) {
        ClothingItem saved = clothingItemService.addClothingItem(clothingItem);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    /**
     * GET /api/clothes
     * Returns all clothing items.
     *
     * @return 200 OK with the list of items
     */
    @GetMapping
    public ResponseEntity<List<ClothingItem>> getAllClothingItems() {
        List<ClothingItem> items = clothingItemService.getAllClothingItems();
        return ResponseEntity.ok(items);
    }

    /**
     * GET /api/clothes/least-worn
     * Returns items sorted by wearCount ascending — surfaces underutilized wardrobe assets.
     *
     * @return 200 OK with sorted list
     */
    @GetMapping("/least-worn")
    public ResponseEntity<List<ClothingItem>> getLeastWornItems() {
        List<ClothingItem> items = clothingItemService.getLeastWornItems();
        return ResponseEntity.ok(items);
    }
}
