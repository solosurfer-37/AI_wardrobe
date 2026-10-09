/* ═══════════════════════════════════════════════════════
   AI Wardrobe — Legacy Router Stub (Multi-Page Architecture)
   Note: The application has been refactored to use standard HTML pages:
   index.html, wardrobe.html, outfits.html, analytics.html, settings.html.
   Hash-based routing is deprecated and no longer required.
   ═══════════════════════════════════════════════════════ */

const Router = {
  navigate(page) {
    const pageMap = {
      dashboard: 'index.html',
      wardrobe: 'wardrobe.html',
      outfits: 'outfits.html',
      analytics: 'analytics.html',
      settings: 'settings.html',
    };
    const target = pageMap[page] || `${page}.html`;
    window.location.href = target;
  },
  getCurrentPage() {
    return App.getCurrentPageKey();
  },
  init() {
    // No-op in multi-page architecture
  },
};
