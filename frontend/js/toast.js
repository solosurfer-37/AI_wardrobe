/* ═══════════════════════════════════════════════════════
   AI Wardrobe — Toast Notification System
   ═══════════════════════════════════════════════════════ */

const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  /**
   * Display a toast notification.
   * @param {string} type - 'success' | 'error' | 'warning' | 'info'
   * @param {string} title - Heading text
   * @param {string} message - Detail message
   * @param {number} [duration=4000] - Duration in ms before auto-dismiss
   */
  show(type = 'info', title = '', message = '', duration = 4000) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconMap = {
      success: 'check-circle',
      error: 'alert-circle',
      warning: 'alert-triangle',
      info: 'info',
    };

    const iconName = iconMap[type] || 'info';

    toast.innerHTML = `
      <div class="toast-icon">
        <i data-lucide="${iconName}"></i>
      </div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${Utils.escapeHTML(title)}</div>` : ''}
        ${message ? `<div class="toast-message">${Utils.escapeHTML(message)}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Close notification">
        <i data-lucide="x"></i>
      </button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.style.animation = 'fadeOut 0.25s forwards';
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 250);
    };

    closeBtn.addEventListener('click', dismiss);

    this.container.appendChild(toast);
    if (window.lucide) {
      lucide.createIcons({ root: toast });
    }

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  },

  success(title, message, duration) {
    this.show('success', title, message, duration);
  },

  error(title, message, duration = 5000) {
    this.show('error', title, message, duration);
  },

  warning(title, message, duration) {
    this.show('warning', title, message, duration);
  },

  info(title, message, duration) {
    this.show('info', title, message, duration);
  },
};
