/* ═══════════════════════════════════════════════════════
   AI Wardrobe — Configuration
   ═══════════════════════════════════════════════════════ */

const CONFIG = {
  // Backend API base URL — change to match your Spring Boot server
  API_BASE_URL: 'http://localhost:8080',

  // Clothing categories from the backend OutfitRecommendationService
  CATEGORIES: {
    tops: ['shirt', 't-shirt', 'blouse', 'top'],
    outerwear: ['jacket', 'sweater', 'hoodie'],
    bottoms: ['pants', 'jeans', 'shorts', 'skirt', 'trousers'],
    footwear: ['shoes', 'sneakers', 'boots', 'sandals', 'loafers'],
  },

  // All valid types (flattened)
  ALL_TYPES: [
    'shirt', 't-shirt', 'blouse', 'top',
    'jacket', 'sweater', 'hoodie',
    'pants', 'jeans', 'shorts', 'skirt', 'trousers',
    'shoes', 'sneakers', 'boots', 'sandals', 'loafers',
  ],

  // Colors supported (from backend data seeder and color compatibility graph)
  COLORS: [
    'white', 'black', 'blue', 'red', 'green', 'navy',
    'gray', 'brown', 'beige', 'pink', 'yellow', 'orange', 'purple',
  ],

  // CSS color map for rendering color dots
  COLOR_MAP: {
    white: '#FFFFFF', black: '#2C2C2C', blue: '#4A7BC7',
    red: '#C75050', green: '#5E8C61', navy: '#2C3E6B',
    gray: '#8A8A8A', brown: '#8B6F47', beige: '#D4C9B8',
    pink: '#D4839E', yellow: '#D4B83E', orange: '#D49A3E',
    purple: '#8B6BAE',
  },

  // Default location (New Delhi, as per backend defaults)
  DEFAULT_LATITUDE: 28.6139,
  DEFAULT_LONGITUDE: 77.2090,
};

// Freeze config to prevent accidental mutation
Object.freeze(CONFIG);
Object.freeze(CONFIG.CATEGORIES);
Object.freeze(CONFIG.ALL_TYPES);
Object.freeze(CONFIG.COLORS);
Object.freeze(CONFIG.COLOR_MAP);
