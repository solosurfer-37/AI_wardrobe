Welcome to AI_Wardrobe — an intelligent backend designed to optimize personal
style, maximize wardrobe utilization, and compute cost-per-wear metrics. Built
as an API-first hackathon submission.

🛑 The Problem & 💡 The Solution The Problem: The average consumer wears only
20% of their wardrobe 80% of the time. This leads to "closet fatigue," wasted
money, and perfectly good clothing sitting unworn.

The Solution: AI_Wardrobe is an intelligent API that tracks clothing inventory
and dynamically remixes outfits. It ensures every item in a user's closet is
utilized by combining recency filtering, weather awareness, and color theory to
surface the perfect outfit for any given day.

🏗 System Architecture & Tech Stack Designed with enterprise-grade modularity in
mind, the system strictly adheres to the "Thin-Controller, Fat-Service" design
pattern. Controllers strictly handle HTTP routing and validation, while pure
business logic is encapsulated in the service layer.

Framework: Spring Boot 4.1.1 (Java 21) Data Layer: Spring Data JPA Database: H2
In-Memory Database (Ideal for rapid hackathon testing & MVP prototyping) Error
Handling: Global @RestControllerAdvice for consistent JSON error responses
External Integrations: Free public APIs (Open-Meteo) using RestTemplate 🧠 Core
Algorithms The brain of the application lives in the
OutfitRecommendationService, utilizing three primary decision drivers:

Usage-Decay Scoring

The system aggregates the wearCount of potential item combinations. Lowest score
wins: Combinations with the lowest cumulative wear count are recommended first,
ensuring neglected clothing is brought to the top of the pile. 3-Way Color
Compatibility Graph

A symmetric adjacency matrix prevents outfit clashing (e.g., no red with green).
It checks all relational edges simultaneously: Top ↔ Bottom, Top ↔ Footwear, and
Bottom ↔ Footwear. Weather-Aware Layering & Graceful Degradation

Integrates dynamically with the Open-Meteo API. If the temperature drops below
15°C, the algorithm dynamically shifts from 3-way combinations to 4-way layered
combinations, adding an Outerwear slot (e.g., a jacket or sweater) and expanding
the compatibility graph to 6 edges. Graceful Degradation: If the external
weather API fails, the system safely defaults to a 20°C warm-weather assumption,
ensuring outfit generation is never blocked. 🔌 API Endpoints 👕 Wardrobe
Inventory (/api/clothes) Method	Endpoint	Description POST	/api/clothes	Upload a
new clothing item GET	/api/clothes	Retrieve all items in the closet
GET	/api/clothes/least-worn	Retrieve items sorted by wearCount ascending ✨ AI
Recommendations (/api/outfits) Method	Endpoint	Description
GET	/api/outfits/recommend	Returns top 3 context-aware outfits. Accepts optional
latitude and longitude params. 📊 Analytics Dashboard (/api/analytics)
Method	Endpoint	Description GET	/api/analytics/wardrobe-stats	Returns total
items, 30-day utilization rate, top/bottom worn items, and average Cost-Per-Wear
(CPW). 🔮 Smart Integrations Mock (/api/..) These endpoints demonstrate the
system's extended architecture for judges.

Method	Endpoint	Description GET	/api/vision/analyze-image	Mocks Computer Vision
ML tagging & categorization GET	/api/ocr/parse-receipt	Mocks automated receipt
parsing via OCR GET	/api/calendar/today-events	Mocks Calendar integration for
event-driven dress codes 🚀 How to Run Local Since this project utilizes an H2
In-Memory database and includes a DataSeeder that automatically populates dummy
users and clothing, getting started is zero-configuration!

Clone the repository. Open your terminal in the project root. Run the following
command: ./mvnw spring-boot:run The server will boot up on
http://localhost:8080.

Pro Tip: Because the DataSeeder runs automatically, you can immediately hit the
GET /api/analytics/wardrobe-stats and GET /api/outfits/recommend endpoints to
see the algorithms in action!
