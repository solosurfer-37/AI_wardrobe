package com.smartwardrobe.services;

import com.smartwardrobe.entities.ClothingItem;
import com.smartwardrobe.repositories.ClothingItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClothingItemService {

    private final ClothingItemRepository clothingItemRepository;

    public ClothingItemService(ClothingItemRepository clothingItemRepository) {
        this.clothingItemRepository = clothingItemRepository;
    }

    /**
     * Persists a new clothing item.
     */
    public ClothingItem addClothingItem(ClothingItem clothingItem) {
        return clothingItemRepository.save(clothingItem);
    }

    /**
     * Returns every clothing item in the database.
     */
    public List<ClothingItem> getAllClothingItems() {
        return clothingItemRepository.findAll();
    }

    /**
     * Returns all items ordered by wearCount ascending — surfaces
     * the least-worn pieces so the user can rotate their wardrobe.
     */
    public List<ClothingItem> getLeastWornItems() {
        return clothingItemRepository.findAllByOrderByWearCountAsc();
    }
}
