/* ═══════════════════════════════════════════════════════
   AI Wardrobe — Comprehensive Dummy Dataset
   Curated according to system architecture and requirements:
   - Tops, Outerwear, Bottoms, Footwear
   - High-quality fashion photography URLs
   - Realistic wear distribution (underutilized, active, staple)
   - Harmonious color combinations
   ═══════════════════════════════════════════════════════ */

const DUMMY_DATA = {
  clothes: [
    // ── TOPS ──
    {
      id: 1,
      type: "t-shirt",
      color: "white",
      pattern: "solid",
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
      price: 28.0,
      wearCount: 18,
      lastWornDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 2,
      type: "shirt",
      color: "navy",
      pattern: "solid",
      imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80",
      price: 65.0,
      wearCount: 7,
      lastWornDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 3,
      type: "top",
      color: "beige",
      pattern: "solid",
      imageUrl: "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=500&auto=format&fit=crop&q=80",
      price: 55.0,
      wearCount: 1,
      lastWornDate: new Date(Date.now() - 45 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 4,
      type: "blouse",
      color: "pink",
      pattern: "floral",
      imageUrl: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&auto=format&fit=crop&q=80",
      price: 48.0,
      wearCount: 3,
      lastWornDate: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 5,
      type: "t-shirt",
      color: "black",
      pattern: "graphic",
      imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=80",
      price: 32.0,
      wearCount: 24,
      lastWornDate: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 6,
      type: "shirt",
      color: "blue",
      pattern: "chambray",
      imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80",
      price: 58.0,
      wearCount: 9,
      lastWornDate: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 7,
      type: "shirt",
      color: "yellow",
      pattern: "solid",
      imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=80",
      price: 45.0,
      wearCount: 0,
      lastWornDate: null
    },

    // ── OUTERWEAR ──
    {
      id: 8,
      type: "jacket",
      color: "black",
      pattern: "leather",
      imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80",
      price: 220.0,
      wearCount: 4,
      lastWornDate: new Date(Date.now() - 16 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 9,
      type: "sweater",
      color: "beige",
      pattern: "knit",
      imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=80",
      price: 140.0,
      wearCount: 6,
      lastWornDate: new Date(Date.now() - 11 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 10,
      type: "hoodie",
      color: "gray",
      pattern: "fleece",
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80",
      price: 68.0,
      wearCount: 28,
      lastWornDate: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 11,
      type: "jacket",
      color: "navy",
      pattern: "wool",
      imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=80",
      price: 195.0,
      wearCount: 2,
      lastWornDate: new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 12,
      type: "jacket",
      color: "green",
      pattern: "quilted",
      imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&auto=format&fit=crop&q=80",
      price: 110.0,
      wearCount: 1,
      lastWornDate: new Date(Date.now() - 50 * 86400000).toISOString().split('T')[0]
    },

    // ── BOTTOMS ──
    {
      id: 13,
      type: "jeans",
      color: "blue",
      pattern: "denim",
      imageUrl: "https://images.unsplash.com/photo-1542272604-780c96856592?w=500&auto=format&fit=crop&q=80",
      price: 85.0,
      wearCount: 22,
      lastWornDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 14,
      type: "trousers",
      color: "black",
      pattern: "pleated",
      imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop&q=80",
      price: 95.0,
      wearCount: 12,
      lastWornDate: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 15,
      type: "pants",
      color: "beige",
      pattern: "chino",
      imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=80",
      price: 72.0,
      wearCount: 5,
      lastWornDate: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 16,
      type: "skirt",
      color: "white",
      pattern: "solid",
      imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&auto=format&fit=crop&q=80",
      price: 60.0,
      wearCount: 2,
      lastWornDate: new Date(Date.now() - 70 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 17,
      type: "trousers",
      color: "navy",
      pattern: "tailored",
      imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&auto=format&fit=crop&q=80",
      price: 88.0,
      wearCount: 8,
      lastWornDate: new Date(Date.now() - 21 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 18,
      type: "shorts",
      color: "green",
      pattern: "canvas",
      imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format&fit=crop&q=80",
      price: 42.0,
      wearCount: 14,
      lastWornDate: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 19,
      type: "pants",
      color: "brown",
      pattern: "corduroy",
      imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&auto=format&fit=crop&q=80",
      price: 78.0,
      wearCount: 0,
      lastWornDate: null
    },

    // ── FOOTWEAR ──
    {
      id: 20,
      type: "sneakers",
      color: "white",
      pattern: "leather",
      imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80",
      price: 110.0,
      wearCount: 35,
      lastWornDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 21,
      type: "loafers",
      color: "brown",
      pattern: "leather",
      imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&auto=format&fit=crop&q=80",
      price: 165.0,
      wearCount: 9,
      lastWornDate: new Date(Date.now() - 13 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 22,
      type: "boots",
      color: "black",
      pattern: "leather",
      imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&auto=format&fit=crop&q=80",
      price: 175.0,
      wearCount: 15,
      lastWornDate: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 23,
      type: "sandals",
      color: "beige",
      pattern: "leather",
      imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=80",
      price: 85.0,
      wearCount: 3,
      lastWornDate: new Date(Date.now() - 40 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 24,
      type: "shoes",
      color: "blue",
      pattern: "suede",
      imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=80",
      price: 95.0,
      wearCount: 1,
      lastWornDate: new Date(Date.now() - 80 * 86400000).toISOString().split('T')[0]
    }
  ],

  calendar: {
    title: "Client Design Review",
    category: "Professional / Smart Casual",
    dressCode: "Smart Casual",
    time: "2:00 PM – 3:30 PM"
  }
};

// Freeze dummy template
Object.freeze(DUMMY_DATA);
