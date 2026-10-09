/* ═══════════════════════════════════════════════════════
   AI Wardrobe — Main Application Bootstrap (Multi-Page Architecture)
   ═══════════════════════════════════════════════════════ */

const App = {
  init() {
    // Initialize Toast System
    Toast.init();

    // Initialize Shared UI Controls
    this.initSidebar();
    this.initModals();
    this.initAddClothingForm();
    this.highlightActiveNav();

    // Initialize Page-Specific Logic
    this.initCurrentPage();

    // Render Lucide Icons
    if (window.lucide) {
      lucide.createIcons();
    }
  },

  /**
   * Determine current page key from body data attribute or location pathname
   */
  getCurrentPageKey() {
    if (document.body && document.body.dataset && document.body.dataset.page) {
      return document.body.dataset.page;
    }
    const path = window.location.pathname.toLowerCase();
    if (path.endsWith('wardrobe.html')) return 'wardrobe';
    if (path.endsWith('outfits.html')) return 'outfits';
    if (path.endsWith('analytics.html')) return 'analytics';
    if (path.endsWith('settings.html')) return 'settings';
    return 'dashboard';
  },

  /**
   * Ensure the active navigation item in the sidebar is highlighted
   */
  highlightActiveNav() {
    const currentPage = this.getCurrentPageKey();
    const navItems = document.querySelectorAll('#sidebar-nav .nav-item');
    navItems.forEach(item => {
      const page = item.getAttribute('data-page');
      if (page === currentPage) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  },

  /**
   * Mobile Sidebar navigation controls
   */
  initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const mobileOverlay = document.getElementById('mobile-overlay');

    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        sidebar.classList.add('open');
        if (mobileOverlay) mobileOverlay.classList.add('active');
      });
    }

    const closeSidebar = () => {
      if (sidebar) {
        sidebar.classList.remove('active');
        sidebar.classList.remove('open');
      }
      if (mobileOverlay) mobileOverlay.classList.remove('active');
    };

    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeSidebar);

    // Close mobile sidebar when clicking any navigation link
    const navLinks = document.querySelectorAll('#sidebar-nav .nav-item');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeSidebar();
        }
      });
    });
  },

  /**
   * Global Modals (backdrop clicks and ESC key)
   */
  initModals() {
    const addModal = document.getElementById('add-clothing-modal');
    const detailModal = document.getElementById('clothing-detail-modal');
    const topbarAddBtn = document.getElementById('btn-add-clothing-topbar');
    const closeAddBtn = document.getElementById('modal-close-add');
    const cancelAddBtn = document.getElementById('btn-cancel-add');
    const closeDetailBtn = document.getElementById('modal-close-detail');

    // Open add modal from topbar
    if (topbarAddBtn && addModal) {
      topbarAddBtn.addEventListener('click', () => {
        addModal.classList.add('active');
        const form = document.getElementById('add-clothing-form');
        if (form) form.reset();
      });
    }

    // Close add modal buttons
    const closeAdd = () => {
      if (addModal) addModal.classList.remove('active');
    };
    if (closeAddBtn) closeAddBtn.addEventListener('click', closeAdd);
    if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeAdd);

    // Close detail modal
    const closeDetail = () => {
      if (detailModal) detailModal.classList.remove('active');
    };
    if (closeDetailBtn) closeDetailBtn.addEventListener('click', closeDetail);

    // Click outside modal container to close
    [addModal, detailModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('active');
          }
        });
      }
    });

    // ESC key dismisses active modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (addModal) addModal.classList.remove('active');
        if (detailModal) detailModal.classList.remove('active');
      }
    });
  },

  /**
   * Add Clothing Form handler with validation & API submission
   */
  initAddClothingForm() {
    const form = document.getElementById('add-clothing-form');
    const submitBtn = document.getElementById('btn-submit-add');
    const addModal = document.getElementById('add-clothing-modal');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const typeEl = document.getElementById('clothing-type');
      const colorEl = document.getElementById('clothing-color');
      const patternEl = document.getElementById('clothing-pattern');
      const imageEl = document.getElementById('clothing-image');
      const priceEl = document.getElementById('clothing-price');

      const type = typeEl ? typeEl.value.trim() : '';
      const color = colorEl ? colorEl.value.trim() : '';
      const pattern = patternEl ? patternEl.value.trim() : '';
      const imageUrl = imageEl ? imageEl.value.trim() : '';
      const price = priceEl && priceEl.value ? parseFloat(priceEl.value) : 0.0;

      if (!type) {
        Toast.error('Validation Error', 'Please select a clothing type.');
        return;
      }
      if (!color) {
        Toast.error('Validation Error', 'Please select a color.');
        return;
      }

      const itemData = {
        type,
        color,
        pattern: pattern || 'solid',
        imageUrl: imageUrl || '',
        price: price >= 0 ? price : 0.0,
        wearCount: 0,
        lastWornDate: null,
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Saving...`;
        if (window.lucide) lucide.createIcons();
      }

      try {
        await API.addClothingItem(itemData);
        Toast.success('Piece Added', `${Utils.capitalize(color)} ${Utils.capitalize(type)} successfully added to your wardrobe.`);

        form.reset();
        if (addModal) addModal.classList.remove('active');

        // Refresh data on current active page
        const currentPage = App.getCurrentPageKey();
        if (currentPage === 'wardrobe' && window.WardrobePage && typeof WardrobePage.fetchItems === 'function') {
          WardrobePage.fetchItems();
        } else if (currentPage === 'dashboard' && window.DashboardPage && typeof DashboardPage.loadDashboardData === 'function') {
          DashboardPage.loadDashboardData();
        } else if (currentPage === 'analytics' && window.AnalyticsPage && typeof AnalyticsPage.loadAnalyticsData === 'function') {
          AnalyticsPage.loadAnalyticsData();
        }
      } catch (err) {
        console.error('Failed to add clothing item:', err);
        Toast.error('Save Failed', err.message || 'Could not save clothing item.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i data-lucide="plus"></i> Add to Wardrobe`;
          if (window.lucide) lucide.createIcons();
        }
      }
    });
  },

  /**
   * Initializes the page-specific component based on current page
   */
  initCurrentPage() {
    const pageKey = this.getCurrentPageKey();

    switch (pageKey) {
      case 'dashboard':
        if (window.DashboardPage && typeof DashboardPage.init === 'function') {
          DashboardPage.init();
        }
        break;
      case 'wardrobe':
        if (window.WardrobePage && typeof WardrobePage.init === 'function') {
          WardrobePage.init();
        }
        break;
      case 'outfits':
        if (window.OutfitsPage && typeof OutfitsPage.init === 'function') {
          OutfitsPage.init();
        }
        break;
      case 'analytics':
        if (window.AnalyticsPage && typeof AnalyticsPage.init === 'function') {
          AnalyticsPage.init();
        }
        break;
      case 'settings':
        if (window.SettingsPage && typeof SettingsPage.init === 'function') {
          SettingsPage.init();
        }
        break;
      default:
        break;
    }
  },
};

// Bootstrap when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
