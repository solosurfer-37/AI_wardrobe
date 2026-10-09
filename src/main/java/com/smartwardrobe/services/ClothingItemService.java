package com.smartwardrobe.services;

import com.smartwardrobe.entities.ClothingItem;
import com.smartwardrobe.entities.User;
import com.smartwardrobe.repositories.ClothingItemRepository;
import com.smartwardrobe.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class ClothingItemService {
    private final ClothingItemRepository clothingItemRepository;
    private final UserRepository userRepository;

    public ClothingItemService(ClothingItemRepository clothingItemRepository, UserRepository userRepository) {
        this.clothingItemRepository = clothingItemRepository;
        this.userRepository = userRepository;
    }

    /**
     * No authentication/current-user facility exists in this project yet.
     * For now, all wardrobe endpoints use the same deterministic demo owner.
     * A client-supplied user object is deliberately not trusted as ownership.
     */
    @Transactional
    public ClothingItem addClothingItem(ClothingItem clothingItem) {
        User owner = getDemoOwner();
        if (owner == null) {
            owner = userRepository.save(new User("default_user", "user@wardrobe.ai"));
        }
        clothingItem.setUser(owner);
        return clothingItemRepository.save(clothingItem);
    }

    @Transactional(readOnly = true)
    public List<ClothingItem> getAllClothingItems() {
        User owner = getDemoOwner();
        return owner == null ? List.of() : clothingItemRepository.findByUserId(owner.getId());
    }

    @Transactional(readOnly = true)
    public List<ClothingItem> getLeastWornItems() {
        return getAllClothingItems().stream()
                .sorted(Comparator.comparingInt(ClothingItem::getWearCount))
                .toList();
    }

    private User getDemoOwner() {
        return userRepository.findAll().stream()
                .min(Comparator.comparing(User::getId, Comparator.nullsLast(Comparator.naturalOrder())))
                .orElse(null);
    }
}
