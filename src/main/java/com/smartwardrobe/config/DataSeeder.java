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
            log.info("Database is empty. Populating with realistic dummy wardrobe data...");

            // Create 2 Users
            User user1 = new User("alice_fashion", "alice@example.com");
            User user2 = new User("bob_style", "bob@example.com");
            userRepository.saveAll(List.of(user1, user2));

            // Curated, realistic wardrobe items across Tops, Outerwear, Bottoms, and Footwear
            // All with high quality fashion photography URLs and balanced wear statistics

            // ── TOPS ──
            ClothingItem top1 = new ClothingItem("t-shirt", "white", "solid",
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80", user1);
            top1.setPrice(28.0);
            top1.setWearCount(18);
            top1.setLastWornDate(LocalDate.now().minusDays(5));

            ClothingItem top2 = new ClothingItem("shirt", "navy", "solid",
                    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80", user1);
            top2.setPrice(65.0);
            top2.setWearCount(7);
            top2.setLastWornDate(LocalDate.now().minusDays(14));

            ClothingItem top3 = new ClothingItem("top", "beige", "solid",
                    "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=500&auto=format&fit=crop&q=80", user1);
            top3.setPrice(55.0);
            top3.setWearCount(1);
            top3.setLastWornDate(LocalDate.now().minusDays(45));

            ClothingItem top4 = new ClothingItem("blouse", "pink", "floral",
                    "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&auto=format&fit=crop&q=80", user1);
            top4.setPrice(48.0);
            top4.setWearCount(3);
            top4.setLastWornDate(LocalDate.now().minusDays(20));

            ClothingItem top5 = new ClothingItem("t-shirt", "black", "graphic",
                    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=80", user2);
            top5.setPrice(32.0);
            top5.setWearCount(24);
            top5.setLastWornDate(LocalDate.now().minusDays(4));

            ClothingItem top6 = new ClothingItem("shirt", "blue", "chambray",
                    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80", user2);
            top6.setPrice(58.0);
            top6.setWearCount(9);
            top6.setLastWornDate(LocalDate.now().minusDays(18));

            ClothingItem top7 = new ClothingItem("shirt", "yellow", "solid",
                    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=80", user2);
            top7.setPrice(45.0);
            top7.setWearCount(0);
            top7.setLastWornDate(null); // Never worn

            // ── OUTERWEAR ──
            ClothingItem out1 = new ClothingItem("jacket", "black", "leather",
                    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80", user1);
            out1.setPrice(220.0);
            out1.setWearCount(4);
            out1.setLastWornDate(LocalDate.now().minusDays(16));

            ClothingItem out2 = new ClothingItem("sweater", "beige", "knit",
                    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=80", user1);
            out2.setPrice(140.0);
            out2.setWearCount(6);
            out2.setLastWornDate(LocalDate.now().minusDays(11));

            ClothingItem out3 = new ClothingItem("hoodie", "gray", "fleece",
                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80", user2);
            out3.setPrice(68.0);
            out3.setWearCount(28);
            out3.setLastWornDate(LocalDate.now().minusDays(6));

            ClothingItem out4 = new ClothingItem("jacket", "navy", "wool",
                    "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=80", user2);
            out4.setPrice(195.0);
            out4.setWearCount(2);
            out4.setLastWornDate(LocalDate.now().minusDays(60));

            ClothingItem out5 = new ClothingItem("jacket", "green", "quilted",
                    "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&auto=format&fit=crop&q=80", user1);
            out5.setPrice(110.0);
            out5.setWearCount(1);
            out5.setLastWornDate(LocalDate.now().minusDays(50));

            // ── BOTTOMS ──
            ClothingItem bot1 = new ClothingItem("jeans", "blue", "denim",
                    "https://images.unsplash.com/photo-1542272604-780c96856592?w=500&auto=format&fit=crop&q=80", user1);
            bot1.setPrice(85.0);
            bot1.setWearCount(22);
            bot1.setLastWornDate(LocalDate.now().minusDays(7));

            ClothingItem bot2 = new ClothingItem("trousers", "black", "pleated",
                    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop&q=80", user1);
            bot2.setPrice(95.0);
            bot2.setWearCount(12);
            bot2.setLastWornDate(LocalDate.now().minusDays(10));

            ClothingItem bot3 = new ClothingItem("pants", "beige", "chino",
                    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=80", user1);
            bot3.setPrice(72.0);
            bot3.setWearCount(5);
            bot3.setLastWornDate(LocalDate.now().minusDays(15));

            ClothingItem bot4 = new ClothingItem("skirt", "white", "solid",
                    "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&auto=format&fit=crop&q=80", user1);
            bot4.setPrice(60.0);
            bot4.setWearCount(2);
            bot4.setLastWornDate(LocalDate.now().minusDays(70));

            ClothingItem bot5 = new ClothingItem("trousers", "navy", "tailored",
                    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&auto=format&fit=crop&q=80", user2);
            bot5.setPrice(88.0);
            bot5.setWearCount(8);
            bot5.setLastWornDate(LocalDate.now().minusDays(21));

            ClothingItem bot6 = new ClothingItem("shorts", "green", "canvas",
                    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format&fit=crop&q=80", user2);
            bot6.setPrice(42.0);
            bot6.setWearCount(14);
            bot6.setLastWornDate(LocalDate.now().minusDays(12));

            ClothingItem bot7 = new ClothingItem("pants", "brown", "corduroy",
                    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&auto=format&fit=crop&q=80", user2);
            bot7.setPrice(78.0);
            bot7.setWearCount(0);
            bot7.setLastWornDate(null); // Never worn

            // ── FOOTWEAR ──
            ClothingItem shoe1 = new ClothingItem("sneakers", "white", "leather",
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80", user1);
            shoe1.setPrice(110.0);
            shoe1.setWearCount(35);
            shoe1.setLastWornDate(LocalDate.now().minusDays(3));

            ClothingItem shoe2 = new ClothingItem("loafers", "brown", "leather",
                    "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&auto=format&fit=crop&q=80", user1);
            shoe2.setPrice(165.0);
            shoe2.setWearCount(9);
            shoe2.setLastWornDate(LocalDate.now().minusDays(13));

            ClothingItem shoe3 = new ClothingItem("boots", "black", "leather",
                    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&auto=format&fit=crop&q=80", user1);
            shoe3.setPrice(175.0);
            shoe3.setWearCount(15);
            shoe3.setLastWornDate(LocalDate.now().minusDays(8));

            ClothingItem shoe4 = new ClothingItem("sandals", "beige", "leather",
                    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=80", user2);
            shoe4.setPrice(85.0);
            shoe4.setWearCount(3);
            shoe4.setLastWornDate(LocalDate.now().minusDays(40));

            ClothingItem shoe5 = new ClothingItem("shoes", "blue", "suede",
                    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=80", user2);
            shoe5.setPrice(95.0);
            shoe5.setWearCount(1);
            shoe5.setLastWornDate(LocalDate.now().minusDays(80));

            clothingItemRepository.saveAll(List.of(
                    top1, top2, top3, top4, top5, top6, top7,
                    out1, out2, out3, out4, out5,
                    bot1, bot2, bot3, bot4, bot5, bot6, bot7,
                    shoe1, shoe2, shoe3, shoe4, shoe5
            ));

            log.info("Successfully seeded 2 users and 24 rich clothing items with realistic wardrobe metrics!");
        } else {
            log.info("Database already contains data. Skipping DataSeeder.");
        }
    }
}
