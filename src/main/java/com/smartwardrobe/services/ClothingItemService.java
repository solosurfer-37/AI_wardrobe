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
    public ClothingItem getClothingItemById(Long id) {
        User owner = getDemoOwner();
        if (owner == null) return null;
        return clothingItemRepository.findByIdAndUserId(id, owner.getId()).orElse(null);
    }

    /**
     * Returns the database user ID for a given clothing item.
     * Called inside a transaction so the lazy User association is safe to access.
     */
    @Transactional(readOnly = true)
    public Long getOwnerIdForItem(Long itemId) {
        User owner = getDemoOwner();
        if (owner == null) return null;
        boolean exists = clothingItemRepository.findByIdAndUserId(itemId, owner.getId()).isPresent();
        return exists ? owner.getId() : null;
    }

    @Transactional
    public ClothingItem updateClothingItem(Long id, ClothingItem updatedItem) {
        User owner = getDemoOwner();
        if (owner == null) return null;

        ClothingItem existing = clothingItemRepository.findByIdAndUserId(id, owner.getId()).orElse(null);
        if (existing == null) return null;

        if (updatedItem.getType() != null) existing.setType(updatedItem.getType());
        if (updatedItem.getColor() != null) existing.setColor(updatedItem.getColor());
        if (updatedItem.getPattern() != null) existing.setPattern(updatedItem.getPattern());
        if (updatedItem.getImageUrl() != null) existing.setImageUrl(updatedItem.getImageUrl());
        if (updatedItem.getLastWornDate() != null) existing.setLastWornDate(updatedItem.getLastWornDate());
        if (updatedItem.getPrice() != null) existing.setPrice(updatedItem.getPrice());
        if (updatedItem.getName() != null) existing.setName(updatedItem.getName());
        if (updatedItem.getCategory() != null) existing.setCategory(updatedItem.getCategory());
        if (updatedItem.getBrand() != null) existing.setBrand(updatedItem.getBrand());
        if (updatedItem.getSeason() != null) existing.setSeason(updatedItem.getSeason());
        if (updatedItem.getOccasion() != null) existing.setOccasion(updatedItem.getOccasion());
        if (updatedItem.getRating() != null) existing.setRating(updatedItem.getRating());
        if (updatedItem.getImagePath() != null) existing.setImagePath(updatedItem.getImagePath());
        if (updatedItem.getOriginalImagePath() != null) existing.setOriginalImagePath(updatedItem.getOriginalImagePath());
        if (updatedItem.getExtractedImagePath() != null) existing.setExtractedImagePath(updatedItem.getExtractedImagePath());
        existing.setWearCount(updatedItem.getWearCount());

        return clothingItemRepository.save(existing);
    }

    @Transactional
    public boolean deleteClothingItem(Long id) {
        User owner = getDemoOwner();
        if (owner == null) return false;

        if (clothingItemRepository.findByIdAndUserId(id, owner.getId()).isPresent()) {
            clothingItemRepository.deleteByIdAndUserId(id, owner.getId());
            return true;
        }
        return false;
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
