/* ═══════════════════════════════════════════════════════
   AI Wardrobe — Main Application Bootstrap (Multi-Page Architecture)
   ═══════════════════════════════════════════════════════ */

const App = {
  init() {
    Toast.init();

    this.initSidebar();
    this.initModals();
    this.initAddClothingForm();
    this.highlightActiveNav();

    this.initCurrentPage();

    if (window.lucide) {
      lucide.createIcons();
    }
  },

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
   * Glass header: scroll state + mobile full-screen menu
   */
  initSidebar() {
    const shell  = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    const close  = document.getElementById('sidebar-close');
    if (!shell || !toggle) return;

    const mq = window.matchMedia('(max-width: 980px)');

    const setMenu = (open) => {
      shell.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

    const onScroll = () => shell.classList.toggle('is-scrolled', window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toggle.addEventListener('click', () => setMenu(!shell.classList.contains('open')));
    if (close) close.addEventListener('click', () => setMenu(false));

    document.querySelectorAll('#sidebar-nav .nav-item').forEach(link =>
      link.addEventListener('click', () => setMenu(false))
    );

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && shell.classList.contains('open')) setMenu(false);
    });

    mq.addEventListener('change', (e) => { if (!e.matches) setMenu(false); });
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

    if (topbarAddBtn && addModal) {
      topbarAddBtn.addEventListener('click', () => {
        addModal.classList.add('active');
        const form = document.getElementById('add-clothing-form');
        if (form) form.reset();
      });
    }

    const closeAdd = () => {
      if (addModal) addModal.classList.remove('active');
    };
    if (closeAddBtn) closeAddBtn.addEventListener('click', closeAdd);
    if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeAdd);

    const closeDetail = () => {
      if (detailModal) detailModal.classList.remove('active');
    };
    if (closeDetailBtn) closeDetailBtn.addEventListener('click', closeDetail);

    [addModal, detailModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('active');
          }
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (addModal) addModal.classList.remove('active');
        if (detailModal) detailModal.classList.remove('active');
      }
    });
  },

  /**
   * Add Clothing Form: validation + image upload + save
   * Flow: image upload pehle -> item insert. Upload fail = item save nahi hoga.
   */
  initAddClothingForm() {
    const form = document.getElementById('add-clothing-form');
    const submitBtn = document.getElementById('btn-submit-add');
    const addModal = document.getElementById('add-clothing-modal');
    const fileInput = document.getElementById('clothing-image-file');
    const previewWrap = document.getElementById('clothing-image-preview-wrap');
    const preview = document.getElementById('clothing-image-preview');
    const removeImageBtn = document.getElementById('btn-remove-clothing-image');
    const uploadArea = document.getElementById('clothing-image-upload-area');
    const uploadError = document.getElementById('clothing-image-error');
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    let previewUrl = null;

    if (!form) return;

    const isValidImage = (file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      return allowedTypes.includes(file.type) || allowedExts.includes(ext);
    };

    const clearImage = () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = null;
      if (fileInput) fileInput.value = '';
      if (preview) preview.removeAttribute('src');
      if (previewWrap) previewWrap.hidden = true;
      if (uploadArea) uploadArea.hidden = false;
      if (uploadError) uploadError.textContent = '';
    };

    if (fileInput && !fileInput._hasHandler) {
      fileInput._hasHandler = true;
      fileInput.addEventListener('change', () => {
        if (uploadError) uploadError.textContent = '';
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        if (!isValidImage(file)) {
          clearImage();
          if (uploadError) uploadError.textContent = 'Choose a JPG, JPEG, PNG, or WEBP image.';
          return;
        }
        if (file.size > MAX_IMAGE_SIZE) {
          clearImage();
          if (uploadError) uploadError.textContent = 'Image must be 10 MB or smaller.';
          return;
        }
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = URL.createObjectURL(file);
        if (preview) preview.src = previewUrl;
        if (previewWrap) previewWrap.hidden = false;
        if (uploadArea) uploadArea.hidden = true;
      });
    }

    if (removeImageBtn && !removeImageBtn._hasHandler) {
      removeImageBtn._hasHandler = true;
      removeImageBtn.addEventListener('click', clearImage);
    }

    if (uploadArea && fileInput && !uploadArea._hasHandler) {
      uploadArea._hasHandler = true;
      uploadArea.addEventListener('click', () => fileInput.click());
      uploadArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          fileInput.click();
        }
      });
    }

    // Form reset hone pe preview bhi clear
    form.addEventListener('reset', () => setTimeout(clearImage, 0));

    const refreshCurrentPage = async () => {
      const currentPage = App.getCurrentPageKey();
      if (currentPage === 'wardrobe' && window.WardrobePage && typeof WardrobePage.fetchItems === 'function') {
        await WardrobePage.fetchItems();
      } else if (currentPage === 'dashboard' && window.DashboardPage && typeof DashboardPage.loadDashboardData === 'function') {
        await DashboardPage.loadDashboardData();
      } else if (currentPage === 'analytics' && window.AnalyticsPage && typeof AnalyticsPage.loadAnalyticsData === 'function') {
        await AnalyticsPage.loadAnalyticsData();
      }
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (submitBtn && submitBtn.disabled) return;

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
      const selectedFile = fileInput && fileInput.files ? fileInput.files[0] : null;

      if (!type) { Toast.error('Validation Error', 'Please select a clothing type.'); return; }
      if (!color) { Toast.error('Validation Error', 'Please select a color.'); return; }
      if (selectedFile && (!isValidImage(selectedFile) || selectedFile.size > MAX_IMAGE_SIZE)) {
        Toast.error('Invalid Image', 'Choose a JPG, PNG, or WEBP image no larger than 10 MB.');
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
        // Image pehle upload hoti hai; fail hui to item DB me save hi nahi hoga
        await API.addClothingItem(itemData, selectedFile);

        Toast.success('Piece Added', `${Utils.capitalize(color)} ${Utils.capitalize(type)} successfully added to your wardrobe${selectedFile ? ' with its image' : ''}.`);
        form.reset();
        if (addModal) addModal.classList.remove('active');
        await refreshCurrentPage();
      } catch (err) {
        // Modal khula rehta hai taaki user dobara try kar sake
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

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});