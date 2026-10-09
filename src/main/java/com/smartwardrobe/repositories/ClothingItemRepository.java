package com.smartwardrobe.repositories;

import com.smartwardrobe.entities.ClothingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClothingItemRepository extends JpaRepository<ClothingItem, Long> {

    List<ClothingItem> findByUserId(Long userId);

    java.util.Optional<ClothingItem> findByIdAndUserId(Long id, Long userId);

    void deleteByIdAndUserId(Long id, Long userId);

    List<ClothingItem> findByType(String type);

    List<ClothingItem> findByColor(String color);

    List<ClothingItem> findAllByOrderByWearCountAsc();
}
