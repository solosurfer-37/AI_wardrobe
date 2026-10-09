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
   * Ensure the active navigation item in the header is highlighted
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

    // Scroll state
    const onScroll = () => shell.classList.toggle('is-scrolled', window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toggle.addEventListener('click', () => setMenu(!shell.classList.contains('open')));
    if (close) close.addEventListener('click', () => setMenu(false));

    // Link click pe menu band
    document.querySelectorAll('#sidebar-nav .nav-item').forEach(link =>
      link.addEventListener('click', () => setMenu(false))
    );

    // Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && shell.classList.contains('open')) setMenu(false);
    });

    // Desktop pe resize ho to reset
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
    const fileInput = document.getElementById('clothing-image-file');
    const previewWrap = document.getElementById('clothing-image-preview-wrap');
    const preview = document.getElementById('clothing-image-preview');
    const removeImageBtn = document.getElementById('btn-remove-clothing-image');
    const uploadArea = document.getElementById('clothing-image-upload-area');
    const uploadError = document.getElementById('clothing-image-error');
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    /**
     * Shrinks a photo before upload (phone photos are several MB; cards only need ~1280px).
     * Keeps transparency for PNG/WebP, never returns something bigger, and falls back to the
     * original file if the browser cannot decode or re-encode it.
     */
    const compressImage = async (file, maxDim = 1280) => {
      try {
        const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
        const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
        if (scale === 1 && file.size <= 400 * 1024) { if (bitmap.close) bitmap.close(); return file; }
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        if (bitmap.close) bitmap.close();
        const keepsAlpha = file.type === 'image/png' || file.type === 'image/webp';
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, keepsAlpha ? 'image/webp' : 'image/jpeg', 0.85));
        if (!blob || blob.size >= file.size) return file;
        const ext = blob.type === 'image/webp' ? 'webp' : (blob.type === 'image/png' ? 'png' : 'jpg');
        return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.' + ext, { type: blob.type });
      } catch (err) {
        console.warn('Image compression skipped:', err);
        return file;
      }
    };
    let previewUrl = null;

    if (!form) return;

    const clearImage = () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = null;
      if (fileInput) fileInput.value = '';
      if (preview) preview.removeAttribute('src');
      if (previewWrap) previewWrap.hidden = true;
      if (uploadArea) uploadArea.hidden = false;
      if (uploadError) uploadError.textContent = '';
    };

    const resetImagePreview = () => {
      clearImage();
    };

    if (fileInput && !fileInput._hasHandler) {
      fileInput._hasHandler = true;
      fileInput.addEventListener('change', () => {
        if (uploadError) uploadError.textContent = '';
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        const extension = file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(file.type) && !['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
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

    // Reset preview whenever the form is reset, including opening a fresh Add Item modal.
    form.addEventListener('reset', () => setTimeout(resetImagePreview, 0));

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
      const selectedExtension = selectedFile ? selectedFile.name.split('.').pop().toLowerCase() : '';
      if (selectedFile && ((!allowedTypes.includes(selectedFile.type) && !['jpg', 'jpeg', 'png', 'webp'].includes(selectedExtension)) || selectedFile.size > MAX_IMAGE_SIZE)) {
        Toast.error('Invalid Image', 'Choose a JPG, PNG, or WEBP image no larger than 10 MB.');
        return;
      }

      const itemData = {
        type, color, pattern: pattern || 'solid', imageUrl: imageUrl || '',
        price: price >= 0 ? price : 0.0, wearCount: 0, lastWornDate: null,
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Saving...`;
        if (window.lucide) lucide.createIcons();
      }

      const setButtonLabel = (label) => {
        if (!submitBtn) return;
        submitBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> ${label}`;
        if (window.lucide) lucide.createIcons();
      };

      let createdItem = null;
      try {
        // Shrink the photo first (a few MB -> ~150 KB) so the upload is quick.
        const fileToUpload = selectedFile ? await compressImage(selectedFile) : null;
        createdItem = await API.addClothingItem(itemData);
        if (fileToUpload) {
          if (!createdItem || createdItem.id == null) {
            Toast.error('Item Not Added', 'The backend did not return the item ID, so the image could not be uploaded. Please try again.');
            await thisRefreshCurrentPage();
            return;
          }
          try {
            setButtonLabel('Uploading image...');
            await API.uploadClothingImage(createdItem.id, fileToUpload);
          } catch (uploadError) {
            console.error('Image upload failed; removing the new item:', uploadError);
            // The item only counts if its image made it: undo the create so no card is left behind.
            let removed = true;
            try {
              await API.deleteClothingItem(createdItem.id);
            } catch (deleteError) {
              removed = false;
              console.error('Could not remove the item after the failed upload:', deleteError);
            }
            Toast.error('Image Upload Failed', removed
              ? `The item was not added. ${uploadError.message}`
              : `${uploadError.message} The item may still appear in your wardrobe; delete it manually.`);
            await thisRefreshCurrentPage();
            return;   // the form stays open so you can retry
          }
        }

        Toast.success('Piece Added', `${Utils.capitalize(color)} ${Utils.capitalize(type)} successfully added to your wardrobe${selectedFile ? ' with its image' : ''}.`);
        form.reset();
        if (addModal) addModal.classList.remove('active');
        await thisRefreshCurrentPage();
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

    async function thisRefreshCurrentPage() {
      const currentPage = App.getCurrentPageKey();
      if (currentPage === 'wardrobe' && window.WardrobePage && typeof WardrobePage.fetchItems === 'function') {
        await WardrobePage.fetchItems();
      } else if (currentPage === 'dashboard' && window.DashboardPage && typeof DashboardPage.loadDashboardData === 'function') {
        await DashboardPage.loadDashboardData();
      } else if (currentPage === 'analytics' && window.AnalyticsPage && typeof AnalyticsPage.loadAnalyticsData === 'function') {
        await AnalyticsPage.loadAnalyticsData();
      }
    }
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