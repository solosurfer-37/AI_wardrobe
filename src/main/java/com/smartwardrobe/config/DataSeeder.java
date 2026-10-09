package com.smartwardrobe.config;

import com.smartwardrobe.entities.ClothingItem;
import com.smartwardrobe.entities.User;
import com.smartwardrobe.repositories.ClothingItemRepository;
import com.smartwardrobe.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final ClothingItemRepository clothingItemRepository;

    public DataSeeder(UserRepository userRepository, ClothingItemRepository clothingItemRepository) {
        this.userRepository = userRepository;
        this.clothingItemRepository = clothingItemRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("Database is empty. Populating with dummy data...");

            // Create 2 Users
            User user1 = new User("alice_fashion", "alice@example.com");
            User user2 = new User("bob_style", "bob@example.com");
            userRepository.saveAll(List.of(user1, user2));

            // Create 10 Clothing Items mixing types, colors, prices, wearCounts, and lastWornDates
            
            // Alice's Wardrobe
            ClothingItem item1 = new ClothingItem("t-shirt", "white", "solid", "url1", user1);
            item1.setWearCount(5);
            item1.setPrice(25.0);
            item1.setLastWornDate(LocalDate.now().minusDays(5));

            ClothingItem item2 = new ClothingItem("jeans", "blue", "denim", "url2", user1);
            item2.setWearCount(12);
            item2.setPrice(65.0);
            item2.setLastWornDate(LocalDate.now().minusDays(12));

            ClothingItem item3 = new ClothingItem("sneakers", "white", "solid", "url3", user1);
            item3.setWearCount(20);
            item3.setPrice(120.0);
            item3.setLastWornDate(LocalDate.now().minusDays(2));

            ClothingItem item4 = new ClothingItem("jacket", "black", "leather", "url4", user1);
            item4.setWearCount(2);
            item4.setPrice(200.0);
            item4.setLastWornDate(LocalDate.now().minusDays(45)); // Unworn in >30 days

            ClothingItem item5 = new ClothingItem("shirt", "red", "plaid", "url5", user1);
            item5.setWearCount(0);
            item5.setPrice(40.0);
            item5.setLastWornDate(null); // Never worn

            // Bob's Wardrobe
            ClothingItem item6 = new ClothingItem("shorts", "green", "solid", "url6", user2);
            item6.setWearCount(8);
            item6.setPrice(30.0);
            item6.setLastWornDate(LocalDate.now().minusDays(15));

            ClothingItem item7 = new ClothingItem("t-shirt", "black", "graphic", "url7", user2);
            item7.setWearCount(15);
            item7.setPrice(25.0);
            item7.setLastWornDate(LocalDate.now().minusDays(1)); // Recently worn (would be filtered by 2-day rule)

            ClothingItem item8 = new ClothingItem("hoodie", "gray", "solid", "url8", user2);
            item8.setWearCount(30);
            item8.setPrice(55.0);
            item8.setLastWornDate(LocalDate.now().minusDays(4));

            ClothingItem item9 = new ClothingItem("pants", "navy", "solid", "url9", user2);
            item9.setWearCount(4);
            item9.setPrice(70.0);
            item9.setLastWornDate(LocalDate.now().minusDays(60)); // Unworn in >30 days

            ClothingItem item10 = new ClothingItem("boots", "brown", "leather", "url10", user2);
            item10.setWearCount(1);
            item10.setPrice(180.0);
            item10.setLastWornDate(LocalDate.now().minusDays(100)); // Barely worn

            clothingItemRepository.saveAll(List.of(
                    item1, item2, item3, item4, item5,
                    item6, item7, item8, item9, item10
            ));

            log.info("Successfully seeded 2 users and 10 clothing items!");
        } else {
            log.info("Database already contains data. Skipping DataSeeder.");
        }
    }
}
