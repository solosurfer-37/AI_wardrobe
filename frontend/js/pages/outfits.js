/* ═══════════════════════════════════════════════════════
   AI Wardrobe — Outfit Recommendation Engine
   ═══════════════════════════════════════════════════════ */

const OutfitsPage = {
  latitude: CONFIG.DEFAULT_LATITUDE,
  longitude: CONFIG.DEFAULT_LONGITUDE,
  recommendations: null,
  isLoading: false,

  async render(container) {
    container.innerHTML = `
      <div class="outfits-page animate-fade-in">
        <!-- Hero Generator Banner -->
        <section class="outfit-hero">
          <div class="outfit-hero-content">
            <div class="outfit-hero-icon">
              <i data-lucide="sparkles"></i>
            </div>
            <h2>Smart Outfit Generator</h2>
            <p>
              Weather-aware, color-harmonized outfit combinations configured to rotate your least-worn clothes.
            </p>

            <!-- Coordinate Controls -->
            <div style="display: flex; gap: var(--space-3); justify-content: center; align-items: center; max-width: 520px; margin: 0 auto var(--space-6); flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: var(--space-2); background: var(--bg-card); padding: var(--space-2) var(--space-4); border-radius: var(--radius-lg); border: 1px solid var(--border-medium);">
                <i data-lucide="map-pin" style="width: 16px; height: 16px; color: var(--color-olive);"></i>
                <input 
                  type="number" 
                  id="outfit-lat" 
                  step="0.0001" 
                  placeholder="Lat" 
                  value="${this.latitude}" 
                  style="width: 80px; border: none; background: transparent; font-size: var(--text-sm); font-weight: var(--weight-medium);" 
                />
                <span style="color: var(--border-dark);">,</span>
                <input 
                  type="number" 
                  id="outfit-lon" 
                  step="0.0001" 
                  placeholder="Lon" 
                  value="${this.longitude}" 
                  style="width: 80px; border: none; background: transparent; font-size: var(--text-sm); font-weight: var(--weight-medium);" 
                />
              </div>

              <button class="btn btn-secondary btn-sm" id="btn-use-location" title="Detect GPS Location">
                <i data-lucide="crosshair"></i> Current GPS
              </button>
            </div>

            <button class="btn btn-generate" id="btn-generate-outfits">
              <i data-lucide="sparkles"></i>
              Generate Recommendations
            </button>
          </div>
        </section>

        <!-- Results Section -->
        <div class="outfit-results" id="outfit-results-container">
          <!-- Will be filled by generation results or default teaser -->
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();

    this.bindEvents();
    // Automatically trigger recommendations on first load
    this.generateRecommendations();
  },

  bindEvents() {
    const generateBtn = document.getElementById('btn-generate-outfits');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        const latInput = document.getElementById('outfit-lat');
        const lonInput = document.getElementById('outfit-lon');
        if (latInput) this.latitude = parseFloat(latInput.value) || CONFIG.DEFAULT_LATITUDE;
        if (lonInput) this.longitude = parseFloat(lonInput.value) || CONFIG.DEFAULT_LONGITUDE;
        this.generateRecommendations();
      });
    }

    const geoBtn = document.getElementById('btn-use-location');
    if (geoBtn) {
      geoBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
          Toast.warning('Geolocation Unavailable', 'Your browser does not support geolocation detection.');
          return;
        }

        geoBtn.disabled = true;
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.latitude = parseFloat(pos.coords.latitude.toFixed(4));
            this.longitude = parseFloat(pos.coords.longitude.toFixed(4));
            const latInput = document.getElementById('outfit-lat');
            const lonInput = document.getElementById('outfit-lon');
            if (latInput) latInput.value = this.latitude;
            if (lonInput) lonInput.value = this.longitude;
            geoBtn.disabled = false;
            Toast.success('Location Found', `Updated coordinates to ${this.latitude}, ${this.longitude}`);
            this.generateRecommendations();
          },
          (err) => {
            geoBtn.disabled = false;
            Toast.warning('Location Permission', 'Could not access GPS. Using default location.');
          }
        );
      });
    }
  },

  async generateRecommendations() {
    const container = document.getElementById('outfit-results-container');
    const generateBtn = document.getElementById('btn-generate-outfits');
    if (!container) return;

    // Show loading skeleton
    container.innerHTML = `
      <div class="outfit-results-header">
        <div>
          <h3>Consulting Style Engine...</h3>
          <p class="section-subtitle">Querying weather forecasts, checking wear history, & matching color charts</p>
        </div>
      </div>
      <div class="outfit-skeleton-grid">
        <div class="skeleton outfit-skeleton-card"></div>
        <div class="skeleton outfit-skeleton-card"></div>
        <div class="skeleton outfit-skeleton-card"></div>
      </div>
    `;

    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Generating Outfits...`;
      if (window.lucide) lucide.createIcons();
    }

    try {
      const data = await API.getOutfitRecommendations(this.latitude, this.longitude);
      this.recommendations = data || [];
      this.renderResults();
    } catch (err) {
      console.error('Failed to generate outfits:', err);
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="alert-circle" class="empty-icon" style="color: var(--color-error);"></i>
          <h4>Unable to Generate Outfits</h4>
          <p>${Utils.escapeHTML(err.message)}</p>
          <button class="btn btn-primary btn-sm" onclick="OutfitsPage.generateRecommendations()" style="margin-top: var(--space-4);">
            <i data-lucide="rotate-cw"></i> Try Again
          </button>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    } finally {
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `<i data-lucide="sparkles"></i> Generate Recommendations`;
        if (window.lucide) lucide.createIcons();
      }
    }
  },

  renderResults() {
    const container = document.getElementById('outfit-results-container');
    if (!container) return;

    if (!this.recommendations || this.recommendations.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="hanger" class="empty-icon"></i>
          <h4>Not Enough Items for Outfits</h4>
          <p>The AI needs at least one top, one bottom, and one footwear item to construct valid outfits.</p>
          <a href="#wardrobe" class="btn btn-primary btn-sm" style="margin-top: var(--space-4);">
            <i data-lucide="plus"></i> Add Items to Wardrobe
          </a>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    container.innerHTML = `
      <div class="outfit-results-header">
        <div>
          <h3>Curated Outfits for Today</h3>
          <p class="section-subtitle">Ranked by lowest combined wear count to rotate dormant wardrobe assets</p>
        </div>
        <span class="badge badge-olive">${this.recommendations.length} Combos Created</span>
      </div>

      <div class="outfit-list">
        ${this.recommendations.map((outfit, index) => this.renderOutfitCard(outfit, index)).join('')}
      </div>
    `;

    // Add click listeners to items
    this.recommendations.forEach((outfit, idx) => {
      const items = [outfit.top, outfit.bottom, outfit.footwear, outfit.outerwear].filter(Boolean);
      items.forEach(item => {
        const itemEls = container.querySelectorAll(`[data-outfit-item-id="${item.id}"]`);
        itemEls.forEach(el => {
          el.addEventListener('click', () => Utils.showClothingDetail(item));
        });
      });
    });

    if (window.lucide) lucide.createIcons();
  },

  renderOutfitCard(outfit, index) {
    const items = [
      { label: 'Top', item: outfit.top },
      { label: 'Bottom', item: outfit.bottom },
      { label: 'Footwear', item: outfit.footwear },
      ...(outfit.outerwear ? [{ label: 'Outerwear', item: outfit.outerwear }] : []),
    ];

    const totalCost = items.reduce((sum, i) => sum + (i.item.price || 0), 0);
    const hasOuterwear = !!outfit.outerwear;

    return `
      <div class="card outfit-card animate-fade-in-up" style="animation-delay: ${index * 100}ms">
        <div class="outfit-card-header">
          <span class="outfit-card-number">Look #${index + 1}</span>
          <span class="badge badge-neutral">
            <i data-lucide="rotate-ccw" style="width: 12px; height: 12px; margin-right: 4px;"></i>
            ${outfit.totalWearCount} total wears
          </span>
        </div>

        <div class="outfit-items-grid">
          ${items.map(({ label, item }) => this.renderOutfitItemSlot(label, item)).join('')}
        </div>

        <div class="outfit-card-footer">
          <span class="badge badge-olive">
            <i data-lucide="dollar-sign" style="width: 12px; height: 12px; margin-right: 2px;"></i>
            Total value: ${Utils.formatPrice(totalCost)}
          </span>
          <span class="badge ${hasOuterwear ? 'badge-sky' : 'badge-amber'}">
            <i data-lucide="${hasOuterwear ? 'cloud-snow' : 'sun'}" style="width: 12px; height: 12px; margin-right: 4px;"></i>
            ${hasOuterwear ? 'Layered (<15°C)' : 'Warm Climate'}
          </span>
          <span class="badge badge-neutral">
            <i data-lucide="check" style="width: 12px; height: 12px; margin-right: 4px;"></i>
            Color Balanced
          </span>
        </div>
      </div>
    `;
  },

  renderOutfitItemSlot(label, item) {
    const img = item.imageUrl && item.imageUrl.startsWith('http')
      ? `<img src="${Utils.escapeHTML(item.imageUrl)}" alt="${Utils.escapeHTML(item.type)}" />`
      : `<i data-lucide="shirt"></i>`;

    return `
      <div class="outfit-item card-clickable" data-outfit-item-id="${item.id}">
        <div class="outfit-item-image">
          ${img}
        </div>
        <div class="outfit-item-info">
          <div class="outfit-item-category">${label}</div>
          <div class="outfit-item-name">${Utils.escapeHTML(item.type)}</div>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
            <span class="color-dot" style="background:${Utils.getColorCSS(item.color)}"></span>
            <span style="font-size: 11px; color: var(--text-muted); text-transform: capitalize;">${Utils.escapeHTML(item.color)}</span>
          </div>
        </div>
      </div>
    `;
  },
};
