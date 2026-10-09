/* ═══════════════════════════════════════════════════════
   AI Wardrobe — API Service Layer
   Centralized HTTP client using fetch() for all backend calls
   ═══════════════════════════════════════════════════════ */

const API = {
  /**
   * Generic request wrapper with error handling.
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
      if (error.status) throw error; // Already formatted error
      // Network errors
      const netError = new Error('Unable to connect to the server. Is the backend running on ' + baseUrl + '?');
      netError.status = 0;
      netError.isNetworkError = true;
      throw netError;
    }
  },

  // ═══════ Clothing Items ═══════

  /**
   * GET /api/clothes — Retrieve all clothing items
   */
  getAllClothes() {
    return this.request('/api/clothes');
  },

  /**
   * POST /api/clothes — Create a new clothing item
   * @param {object} clothingItem - { type, color, pattern?, imageUrl?, price? }
   */
  addClothingItem(clothingItem) {
    return this.request('/api/clothes', {
      method: 'POST',
      body: JSON.stringify(clothingItem),
    });
  },

  /**
   * GET /api/clothes/least-worn — Retrieve items sorted by wearCount ascending
   */
  getLeastWornItems() {
    return this.request('/api/clothes/least-worn');
  },

  // ═══════ Outfit Recommendations ═══════

  /**
   * GET /api/outfits/recommend — Get AI outfit recommendations
   * @param {number} latitude
   * @param {number} longitude
   */
  getOutfitRecommendations(latitude, longitude) {
    const lat = latitude || CONFIG.DEFAULT_LATITUDE;
    const lon = longitude || CONFIG.DEFAULT_LONGITUDE;
    return this.request(`/api/outfits/recommend?latitude=${lat}&longitude=${lon}`);
  },

  // ═══════ Analytics ═══════

  /**
   * GET /api/analytics/wardrobe-stats — Get wardrobe statistics
   */
  getWardrobeStats() {
    return this.request('/api/analytics/wardrobe-stats');
  },

  // ═══════ Smart Integrations (Mock endpoints) ═══════

  /**
   * GET /api/calendar/today-events — Mock calendar integration
   */
  getCalendarEvents() {
    return this.request('/api/calendar/today-events');
  },
};
