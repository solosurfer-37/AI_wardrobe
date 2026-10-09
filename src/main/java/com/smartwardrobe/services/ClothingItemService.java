package com.smartwardrobe.services;

import com.smartwardrobe.entities.ClothingItem;
import com.smartwardrobe.repositories.ClothingItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClothingItemService {

    private final ClothingItemRepository clothingItemRepository;
    private final com.smartwardrobe.repositories.UserRepository userRepository;

    public ClothingItemService(ClothingItemRepository clothingItemRepository, com.smartwardrobe.repositories.UserRepository userRepository) {
        this.clothingItemRepository = clothingItemRepository;
        this.userRepository = userRepository;
    }

    /**
     * Persists a new clothing item.
     */
    public ClothingItem addClothingItem(ClothingItem clothingItem) {
        if (clothingItem.getUser() == null) {
            com.smartwardrobe.entities.User defaultUser = userRepository.findAll().stream().findFirst()
                    .orElseGet(() -> userRepository.save(new com.smartwardrobe.entities.User("default_user", "user@wardrobe.ai")));
            clothingItem.setUser(defaultUser);
        }
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
