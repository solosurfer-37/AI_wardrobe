/* ═══════════════════════════════════════════════════════
   AI Wardrobe — API Service Layer
   Centralized client connecting to Spring Boot backend (/api/...)
   with automatic local storage fallback containing full dummy dataset
   ═══════════════════════════════════════════════════════ */

const LocalStore = {
  STORAGE_KEY: 'ai_wardrobe_items',

  getItems() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      const initial = (typeof DUMMY_DATA !== 'undefined' && DUMMY_DATA.clothes) ? [...DUMMY_DATA.clothes] : [];
      this.saveItems(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return (typeof DUMMY_DATA !== 'undefined' && DUMMY_DATA.clothes) ? [...DUMMY_DATA.clothes] : [];
    }
  },

  saveItems(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  },

  addItem(item) {
    const items = this.getItems();
    const newItem = {
      ...item,
      id: Date.now(),
      wearCount: item.wearCount || 0,
      lastWornDate: item.lastWornDate || null,
      price: item.price != null ? Number(item.price) : 0,
    };
    items.unshift(newItem);
    this.saveItems(items);
    return newItem;
  },

  getStats() {
    const items = this.getItems();
    if (!items.length) {
      return { totalItems: 0, utilizationRate: 0, averageCostPerWear: 0, mostWorn: [], leastWorn: [] };
    }
    const thirtyDaysAgo = Date.now() - 30 * 86400000;
    const activeItems = items.filter(i => i.lastWornDate && new Date(i.lastWornDate).getTime() >= thirtyDaysAgo);
    const utilizationRate = (activeItems.length / items.length) * 100;
    const totalCost = items.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
    const totalWears = items.reduce((sum, i) => sum + (Number(i.wearCount) || 0), 0);
    const avgCpw = totalWears > 0 ? totalCost / totalWears : totalCost;

    const sortedMost = [...items].sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0));
    const sortedLeast = [...items].sort((a, b) => (a.wearCount || 0) - (b.wearCount || 0));

    return {
      totalItems: items.length,
      utilizationRate,
      averageCostPerWear: avgCpw,
      mostWorn: sortedMost.slice(0, 3),
      leastWorn: sortedLeast.slice(0, 3),
    };
  },

  getRecommendations() {
    const items = this.getItems();
    const topsGroup = ['shirt', 't-shirt', 'blouse', 'top'];
    const bottomsGroup = ['pants', 'jeans', 'shorts', 'skirt', 'trousers'];
    const footwearGroup = ['shoes', 'sneakers', 'boots', 'sandals', 'loafers'];
    const outerwearGroup = ['jacket', 'sweater', 'hoodie'];

    const clashingPairs = [
      ['red', 'green'], ['red', 'orange'], ['red', 'pink'],
      ['orange', 'pink'], ['brown', 'black'], ['navy', 'black'],
      ['green', 'orange'], ['purple', 'red'], ['yellow', 'green'],
      ['brown', 'gray']
    ];

    const isClashing = (c1, c2) => {
      const a = (c1 || '').toLowerCase().trim();
      const b = (c2 || '').toLowerCase().trim();
      return clashingPairs.some(([p1, p2]) => (a === p1 && b === p2) || (a === p2 && b === p1));
    };

    const twoDaysAgo = Date.now() - 2 * 86400000;
    const isEligible = (item) => !item.lastWornDate || new Date(item.lastWornDate).getTime() < twoDaysAgo;

    const tops = items.filter(i => topsGroup.includes((i.type || '').toLowerCase()) && isEligible(i));
    const bottoms = items.filter(i => bottomsGroup.includes((i.type || '').toLowerCase()) && isEligible(i));
    const shoes = items.filter(i => footwearGroup.includes((i.type || '').toLowerCase()) && isEligible(i));
    const outers = items.filter(i => outerwearGroup.includes((i.type || '').toLowerCase()) && isEligible(i));

    const combos = [];
    for (const t of tops) {
      for (const b of bottoms) {
        for (const s of shoes) {
          if (!isClashing(t.color, b.color) && !isClashing(t.color, s.color) && !isClashing(b.color, s.color)) {
            // Find optional outerwear
            const out = outers.find(o => !isClashing(o.color, t.color) && !isClashing(o.color, b.color) && !isClashing(o.color, s.color));
            const totalWear = (t.wearCount || 0) + (b.wearCount || 0) + (s.wearCount || 0) + (out ? (out.wearCount || 0) : 0);
            combos.push({
              top: t,
              bottom: b,
              footwear: s,
              outerwear: out || null,
              totalWearCount: totalWear,
            });
          }
        }
      }
    }

    combos.sort((a, b) => a.totalWearCount - b.totalWearCount);
    return combos.slice(0, 3);
  }
};

const API = {
  /**
   * Generic request wrapper with error handling and fallback to LocalStore.
   * @param {string} endpoint  - relative path (e.g. '/api/clothes')
   * @param {object} options   - fetch options
   * @returns {Promise<any>}
   */
  async request(endpoint, options = {}) {
    const baseUrl = localStorage.getItem('wardrobe_api_url') || CONFIG.API_BASE_URL;
    const url = `${baseUrl}${endpoint}`;
    const defaultHeaders = { 'Content-Type': 'application/json' };

    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...defaultHeaders, ...options.headers },
      });

      if (!response.ok) {
        let errorBody;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = { message: response.statusText };
        }
        const error = new Error(errorBody.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.body = errorBody;
        throw error;
      }

      // Handle empty responses (204 No Content)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return null;
    } catch (error) {
      // Re-throw explicit HTTP error responses from server
      if (error.status && error.status !== 0) throw error;

      // For network errors (backend not running), flag fallback
      const netError = new Error('Backend not reachable at ' + baseUrl);
      netError.isNetworkError = true;
      throw netError;
    }
  },

  // ═══════ Clothing Items ═══════

  /**
   * GET /api/clothes — Retrieve all clothing items
   */
  async getAllClothes() {
    try {
      return await this.request('/api/clothes');
    } catch (err) {
      if (err.isNetworkError) {
        return LocalStore.getItems();
      }
      throw err;
    }
  },

  /**
   * POST /api/clothes — Create a new clothing item
   * @param {object} clothingItem - { type, color, pattern?, imageUrl?, price? }
   */
  async addClothingItem(clothingItem) {
    try {
      return await this.request('/api/clothes', {
        method: 'POST',
        body: JSON.stringify(clothingItem),
      });
    } catch (err) {
      if (err.isNetworkError) {
        return LocalStore.addItem(clothingItem);
      }
      throw err;
    }
  },

  /**
   * GET /api/clothes/least-worn — Retrieve items sorted by wearCount ascending
   */
  async getLeastWornItems() {
    try {
      return await this.request('/api/clothes/least-worn');
    } catch (err) {
      if (err.isNetworkError) {
        const items = LocalStore.getItems();
        return [...items].sort((a, b) => (a.wearCount || 0) - (b.wearCount || 0));
      }
      throw err;
    }
  },

  // ═══════ Outfit Recommendations ═══════

  /**
   * GET /api/outfits/recommend — Get AI outfit recommendations
   * @param {number} latitude
   * @param {number} longitude
   */
  async getOutfitRecommendations(latitude, longitude) {
    const lat = Number.isFinite(Number(latitude)) ? Number(latitude) : CONFIG.DEFAULT_LATITUDE;
    const lon = Number.isFinite(Number(longitude)) ? Number(longitude) : CONFIG.DEFAULT_LONGITUDE;
    const params = new URLSearchParams({ latitude: String(lat), longitude: String(lon) });
    try {
      return await this.request(`/api/outfits/recommend?${params.toString()}`);
    } catch (err) {
      if (err.isNetworkError) {
        return LocalStore.getRecommendations();
      }
      throw err;
    }
  },

  // ═══════ Analytics ═══════

  /**
   * GET /api/analytics/wardrobe-stats — Get wardrobe statistics
   */
  async getWardrobeStats() {
    try {
      return await this.request('/api/analytics/wardrobe-stats');
    } catch (err) {
      if (err.isNetworkError) {
        return LocalStore.getStats();
      }
      throw err;
    }
  },

  // ═══════ Smart Integrations (Mock endpoints) ═══════

  /**
   * GET /api/calendar/today-events — Mock calendar integration
   */
  async getCalendarEvents() {
    try {
      return await this.request('/api/calendar/today-events');
    } catch (err) {
      if (err.isNetworkError) {
        return (typeof DUMMY_DATA !== 'undefined' && DUMMY_DATA.calendar) ? DUMMY_DATA.calendar : null;
      }
      throw err;
    }
  },
};
