/* ═══════════════════════════════════════════════════════
   AI Wardrobe — Hash-based Client-side Router
   ═══════════════════════════════════════════════════════ */

const Router = {
  routes: {
    dashboard: {
      title: 'Dashboard',
      handler: DashboardPage,
    },
    wardrobe: {
      title: 'My Wardrobe',
      handler: WardrobePage,
    },
    outfits: {
      title: 'Outfit Generator',
      handler: OutfitsPage,
    },
    analytics: {
      title: 'Analytics & Insights',
      handler: AnalyticsPage,
    },
    settings: {
      title: 'Settings',
      handler: SettingsPage,
    },
  },

  currentPage: null,

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    // Initial route handling
    this.handleRoute();
  },

  navigate(page) {
    window.location.hash = page;
  },

  getCurrentPage() {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    return this.routes[hash] ? hash : 'dashboard';
  },

  async handleRoute() {
    const pageKey = this.getCurrentPage();
    const route = this.routes[pageKey];
    this.currentPage = pageKey;

    // Update active state in sidebar
    const navItems = document.querySelectorAll('#sidebar-nav .nav-item');
    navItems.forEach(item => {
      const target = item.getAttribute('data-page');
      if (target === pageKey) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update topbar title
    const topbarTitle = document.getElementById('topbar-title');
    if (topbarTitle && route) {
      topbarTitle.textContent = route.title;
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if (sidebar && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
    }
    if (overlay && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
    }

    // Render page into container
    const container = document.getElementById('page-container');
    if (container && route && route.handler) {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await route.handler.render(container);
    }
  },
};
