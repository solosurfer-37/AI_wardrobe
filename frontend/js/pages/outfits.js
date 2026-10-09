/* ═══════════════════════════════════════════════════════
   AI Wardrobe — Outfit Recommendation Engine
   ═══════════════════════════════════════════════════════ */

const OutfitsPage = {
  latitude: CONFIG.DEFAULT_LATITUDE,
  longitude: CONFIG.DEFAULT_LONGITUDE,
  recommendations: null,

  init() {
    const savedLat = parseFloat(localStorage.getItem('wardrobe_lat'));
    const savedLon = parseFloat(localStorage.getItem('wardrobe_lon'));
    if (!isNaN(savedLat)) this.latitude = savedLat;
    if (!isNaN(savedLon)) this.longitude = savedLon;

    if (window.lucide) lucide.createIcons();

    // Dynamic render if page-container is empty
    const container = document.getElementById('page-container');
    if (container && !document.getElementById('outfit-results-container')) {
      container.innerHTML = `
        <div class="outfits-page animate-fade-in">
          <div class="outfit-results" id="outfit-results-container"></div>
          <div id="outfit-weather-bar" class="outfit-weather-bar" style="display:none;"></div>
        </div>`;
    }

    this.generateRecommendations();
  },

  // ₹ with Indian digit grouping (1,25,000)
  formatINR(n) {
    return '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');
  },

  async generateRecommendations() {
    const container = document.getElementById('outfit-results-container');
    if (!container) return;

    container.innerHTML = `
      <div class="outfit-results-header">
        <div>
          <h3>Consulting Style Engine...</h3>
          <p class="section-subtitle">Querying weather forecasts, checking wear history, &amp; matching color charts</p>
        </div>
      </div>
      <div class="outfit-skeleton-grid">
        <div class="skeleton outfit-skeleton-card"></div>
        <div class="skeleton outfit-skeleton-card"></div>
        <div class="skeleton outfit-skeleton-card"></div>
      </div>`;

    try {
      const data = await API.getOutfitRecommendations(this.latitude, this.longitude);
      this.recommendations = data || [];
      this.renderResults();
      this.renderWeatherBar();
    } catch (err) {
      console.error('Failed to generate outfits:', err);
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="alert-circle" class="empty-icon" style="color:var(--color-error);"></i>
          <h4>Unable to Generate Outfits</h4>
          <p>${Utils.escapeHTML(err.message)}</p>
          <button class="btn btn-primary btn-sm" id="btn-retry-outfits" style="margin-top:var(--space-4);">
            <i data-lucide="rotate-cw"></i> Try Again
          </button>
        </div>`;
      document.getElementById('btn-retry-outfits')?.addEventListener('click', () => OutfitsPage.generateRecommendations());
      if (window.lucide) lucide.createIcons();
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
          <a href="wardrobe.html" class="btn btn-primary btn-sm" style="margin-top:var(--space-4);">
            <i data-lucide="plus"></i> Add Items to Wardrobe
          </a>
        </div>`;
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
        ${this.recommendations.map((outfit, i) => this.renderOutfitCard(outfit, i)).join('')}
      </div>`;

    this.recommendations.forEach(outfit => {
      [outfit.top, outfit.bottom, outfit.footwear, outfit.outerwear].filter(Boolean).forEach(item => {
        container.querySelectorAll(`[data-outfit-item-id="${item.id}"]`).forEach(el => {
          el.addEventListener('click', () => Utils.showClothingDetail(item));
        });
      });
    });

    if (window.lucide) lucide.createIcons();
  },

  async renderWeatherBar() {
    const bar = document.getElementById('outfit-weather-bar');
    if (!bar) return;

    // Date & time
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // Fetch weather from Open-Meteo (free, no key needed)
    let weatherHTML = '';
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh`;
      const res = await fetch(url);
      const wx = await res.json();
      const c = wx.current;
      const temp = Math.round(c.temperature_2m);
      const hum  = c.relative_humidity_2m;
      const wind = Math.round(c.wind_speed_10m);
      const code = c.weather_code;

      const desc = this._wxDesc(code);
      const icon = this._wxIcon(code);

      weatherHTML = `
        <div class="wx-bar-item"><i data-lucide="${icon}" style="width:18px;height:18px;color:var(--color-olive);"></i> <strong>${temp}°C</strong> <span>${desc}</span></div>
        <div class="wx-bar-sep"></div>
        <div class="wx-bar-item"><i data-lucide="droplets" style="width:16px;height:16px;color:var(--color-sky);"></i> ${hum}% Humidity</div>
        <div class="wx-bar-sep"></div>
        <div class="wx-bar-item"><i data-lucide="wind" style="width:16px;height:16px;color:var(--color-slate);"></i> ${wind} km/h</div>`;
    } catch {
      weatherHTML = `<div class="wx-bar-item"><i data-lucide="cloud-off" style="width:16px;height:16px;"></i> Weather unavailable</div>`;
    }

    bar.style.display = '';
    bar.innerHTML = `
      <div class="wx-bar-left">
        <i data-lucide="calendar" style="width:16px;height:16px;color:var(--color-olive);"></i>
        <span><strong>${dateStr}</strong></span>
        <div class="wx-bar-sep"></div>
        <i data-lucide="clock" style="width:16px;height:16px;color:var(--color-slate);"></i>
        <span>${timeStr}</span>
      </div>
      <div class="wx-bar-right">${weatherHTML}</div>`;

    if (window.lucide) lucide.createIcons();
  },

  _wxDesc(code) {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Showers';
    return 'Thunderstorm';
  },

  _wxIcon(code) {
    if (code === 0) return 'sun';
    if (code <= 3) return 'cloud-sun';
    if (code <= 48) return 'cloud-fog';
    if (code <= 67) return 'cloud-rain';
    if (code <= 77) return 'cloud-snow';
    if (code <= 82) return 'cloud-drizzle';
    return 'cloud-lightning';
  },

  renderOutfitCard(outfit, index) {
    const items = [
      { label: 'Top',       item: outfit.top },
      { label: 'Bottom',    item: outfit.bottom },
      { label: 'Footwear',  item: outfit.footwear },
      ...(outfit.outerwear ? [{ label: 'Outerwear', item: outfit.outerwear }] : []),
    ];
    const totalCost   = items.reduce((s, i) => s + (i.item.price || 0), 0);
    const hasOuterwear = !!outfit.outerwear;

    return `
      <div class="card outfit-card animate-fade-in-up" style="animation-delay:${index * 100}ms">
        <div class="outfit-card-header">
          <span class="outfit-card-number">Look #${index + 1}</span>
          <span class="badge badge-neutral">
            <i data-lucide="rotate-ccw" style="width:12px;height:12px;margin-right:4px;"></i>
            ${Number.isFinite(Number(outfit.totalWearCount)) ? Number(outfit.totalWearCount) : 0} total wears
          </span>
          ${Number.isFinite(Number(outfit.score)) && outfit.score !== null
            ? `<span class="badge badge-neutral">${Number(outfit.score).toFixed(1)} match score</span>`
            : ''}
        </div>
        <div class="outfit-items-grid">
          ${items.map(({ label, item }) => this.renderOutfitItemSlot(label, item)).join('')}
        </div>
        <div class="outfit-card-footer">
          <span class="badge badge-olive">
            <i data-lucide="indian-rupee" style="width:12px;height:12px;margin-right:2px;"></i>
            Total value: ${this.formatINR(totalCost)}
          </span>
          <span class="badge ${hasOuterwear ? 'badge-sky' : 'badge-amber'}">
            <i data-lucide="${hasOuterwear ? 'cloud-snow' : 'sun'}" style="width:12px;height:12px;margin-right:4px;"></i>
            ${hasOuterwear ? 'Layered (<15°C)' : 'Warm Climate'}
          </span>
          <span class="badge badge-neutral">
            <i data-lucide="check" style="width:12px;height:12px;margin-right:4px;"></i>
            Color Balanced
          </span>
        </div>
        ${outfit.reason ? `<p class="section-subtitle" style="margin-top:var(--space-3);">${Utils.escapeHTML(outfit.reason)}</p>` : ''}
      </div>`;
  },

  renderOutfitItemSlot(label, item) {
    const img = item.imageUrl && item.imageUrl.startsWith('http')
      ? `<img src="${Utils.escapeHTML(item.imageUrl)}" alt="${Utils.escapeHTML(item.type)}" />`
      : `<i data-lucide="shirt"></i>`;
    return `
      <div class="outfit-item card-clickable" data-outfit-item-id="${item.id}">
        <div class="outfit-item-image">${img}</div>
        <div class="outfit-item-info">
          <div class="outfit-item-category">${label}</div>
          <div class="outfit-item-name">${Utils.escapeHTML(item.type)}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:2px;">
            <span class="color-dot" style="background:${Utils.getColorCSS(item.color)}"></span>
            <span style="font-size:11px;color:var(--text-muted);text-transform:capitalize;">${Utils.escapeHTML(item.color)}</span>
          </div>
        </div>
      </div>`;
  },
};

window.OutfitsPage = OutfitsPage;