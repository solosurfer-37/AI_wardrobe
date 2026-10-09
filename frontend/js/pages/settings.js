/* ═══════════════════════════════════════════════════════
   AI Wardrobe — Settings Page
   ═══════════════════════════════════════════════════════ */

const SettingsPage = {
  init() {
    const container = document.getElementById('page-container');
    // If static HTML isn't already present in container, render it
    if (container && !document.getElementById('settings-api-url')) {
      this.render(container);
      return;
    }

    // Populate form with saved or default settings
    const savedApiUrl = localStorage.getItem('wardrobe_api_url') || CONFIG.API_BASE_URL;
    const savedLat = localStorage.getItem('wardrobe_lat') || CONFIG.DEFAULT_LATITUDE;
    const savedLon = localStorage.getItem('wardrobe_lon') || CONFIG.DEFAULT_LONGITUDE;

    const apiInput = document.getElementById('settings-api-url');
    const latInput = document.getElementById('settings-lat');
    const lonInput = document.getElementById('settings-lon');

    if (apiInput) apiInput.value = savedApiUrl;
    if (latInput) latInput.value = savedLat;
    if (lonInput) lonInput.value = savedLon;

    if (window.lucide) {
      lucide.createIcons();
    }

    this.bindEvents();
  },

  render(container) {
    const savedApiUrl = localStorage.getItem('wardrobe_api_url') || CONFIG.API_BASE_URL;
    const savedLat = localStorage.getItem('wardrobe_lat') || CONFIG.DEFAULT_LATITUDE;
    const savedLon = localStorage.getItem('wardrobe_lon') || CONFIG.DEFAULT_LONGITUDE;

    container.innerHTML = `
      <div class="settings-page animate-fade-in" style="max-width: 800px;">
        <div class="section-header" style="margin-bottom: var(--space-6);">
          <div>
            <h2 class="section-title">Application Settings</h2>
            <p class="section-subtitle">Configure backend endpoints, climate coordinates, and system preferences</p>
          </div>
        </div>

        <!-- Backend Configuration -->
        <div class="settings-section">
          <div class="card settings-card">
            <h3 style="font-size: var(--text-base); font-weight: var(--weight-bold); margin-bottom: var(--space-4);">Backend API Server</h3>
            
            <div class="form-group">
              <label for="settings-api-url">API Base URL</label>
              <div style="display: flex; gap: var(--space-2);">
                <input 
                  type="url" 
                  id="settings-api-url" 
                  value="${Utils.escapeHTML(savedApiUrl)}" 
                  placeholder="http://localhost:8080" 
                  style="flex: 1;"
                />
                <button type="button" class="btn btn-secondary" id="btn-test-connection">
                  <i data-lucide="activity"></i>
                  Test API
                </button>
              </div>
              <span style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; display: block;">
                The host where your Spring Boot application is running. Default is <code>http://localhost:8080</code>.
              </span>
            </div>

            <div id="connection-status-message" style="margin-top: var(--space-3);"></div>
          </div>
        </div>

        <!-- Location & Climate -->
        <div class="settings-section">
          <div class="card settings-card">
            <h3 style="font-size: var(--text-base); font-weight: var(--weight-bold); margin-bottom: var(--space-4);">Default Coordinates (Weather)</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
              <div class="form-group">
                <label for="settings-lat">Latitude</label>
                <input type="number" id="settings-lat" step="0.0001" value="${savedLat}" />
              </div>
              <div class="form-group">
                <label for="settings-lon">Longitude</label>
                <input type="number" id="settings-lon" step="0.0001" value="${savedLon}" />
              </div>
            </div>

            <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-2);">
              Used by the Outfit Recommendation Service to query the Open-Meteo forecast API. Temperature &lt; 15°C automatically mandates an outerwear layer (jacket/sweater/hoodie).
            </p>
          </div>
        </div>

        <!-- System Architecture & Intelligence -->
        <div class="settings-section">
          <div class="card settings-card">
            <h3 style="font-size: var(--text-base); font-weight: var(--weight-bold); margin-bottom: var(--space-4);">Styling Intelligence Principles</h3>

            <div class="settings-row">
              <div class="settings-row-info">
                <div class="settings-row-title">Color Compatibility Graph</div>
                <div class="settings-row-desc">Validates harmonious pairings (e.g. Navy pants with White/Gray tops; Neutral black/white pair with all colors).</div>
              </div>
              <span class="settings-tag">Active</span>
            </div>

            <div class="settings-row">
              <div class="settings-row-info">
                <div class="settings-row-title">Anti-Repetition Cooldown</div>
                <div class="settings-row-desc">Prevents pieces worn in the last 2 days from appearing in today's recommended outfit choices.</div>
              </div>
              <span class="settings-tag">2 Days</span>
            </div>

            <div class="settings-row">
              <div class="settings-row-info">
                <div class="settings-row-title">Rotation Wear Optimization</div>
                <div class="settings-row-desc">Ranks valid combinations by total wearCount ascending, encouraging equal wardrobe rotation.</div>
              </div>
              <span class="settings-tag">Ascending</span>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div style="display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6);">
          <button class="btn btn-primary" id="btn-save-settings">
            <i data-lucide="save"></i>
            Save Preferences
          </button>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
    this.bindEvents();
  },

  bindEvents() {
    const saveBtn = document.getElementById('btn-save-settings');
    if (saveBtn && !saveBtn._hasHandler) {
      saveBtn._hasHandler = true;
      saveBtn.addEventListener('click', () => {
        const apiUrl = document.getElementById('settings-api-url').value.trim();
        const lat = document.getElementById('settings-lat').value.trim();
        const lon = document.getElementById('settings-lon').value.trim();

        if (apiUrl) localStorage.setItem('wardrobe_api_url', apiUrl);
        if (lat) localStorage.setItem('wardrobe_lat', lat);
        if (lon) localStorage.setItem('wardrobe_lon', lon);

        Toast.success('Settings Saved', 'Your configuration has been updated.');
      });
    }

    const testBtn = document.getElementById('btn-test-connection');
    if (testBtn && !testBtn._hasHandler) {
      testBtn._hasHandler = true;
      testBtn.addEventListener('click', async () => {
        const statusEl = document.getElementById('connection-status-message');
        testBtn.disabled = true;
        testBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Testing...`;
        if (window.lucide) lucide.createIcons();

        try {
          const res = await API.getAllClothes();
          statusEl.innerHTML = `
            <div class="badge badge-olive" style="padding: var(--space-2) var(--space-3); width: fit-content;">
              <i data-lucide="check-circle" style="width: 14px; height: 14px; margin-right: 4px;"></i>
              Connection Successful: Found ${res ? res.length : 0} items in database.
            </div>
          `;
          Toast.success('Connected', 'Successfully communicated with Spring Boot API.');
        } catch (err) {
          const currentUrl = localStorage.getItem('wardrobe_api_url') || CONFIG.API_BASE_URL;
          statusEl.innerHTML = `
            <div class="badge badge-rose" style="padding: var(--space-2) var(--space-3); width: fit-content;">
              <i data-lucide="alert-circle" style="width: 14px; height: 14px; margin-right: 4px;"></i>
              Connection Failed: ${Utils.escapeHTML(err.message)}
            </div>
          `;
          Toast.error('Connection Failed', 'Could not reach backend at ' + currentUrl);
        } finally {
          testBtn.disabled = false;
          testBtn.innerHTML = `<i data-lucide="activity"></i> Test API`;
          if (window.lucide) lucide.createIcons();
        }
      });
    }
  },
};
