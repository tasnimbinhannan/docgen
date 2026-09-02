/**
 * UI Utilities: Toasts, Modals, Tabs, Theme, Clipboard
 */

const UI = {
  // Toast Notifications
  showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ'}</span>
      <div class="toast-message">${this.escapeHtml(message)}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  },

  // Modal Management
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  },

  // Tab Navigation
  initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        if (!targetId) return;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.add('hidden');
        });

        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.remove('hidden');
          targetPane.classList.add('animate-fade-in');
        }

        // Trigger tab specific refresh
        if (targetId === 'tabDashboard' && window.Dashboard) {
          window.Dashboard.loadDocuments();
        }
      });
    });
  },

  // Theme Management (Light / Dark)
  initTheme() {
    const savedTheme = localStorage.getItem('DOCUGEN_THEME') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeToggleIcon(savedTheme);

    const toggleBtn = document.getElementById('btnThemeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('DOCUGEN_THEME', nextTheme);
        this.updateThemeToggleIcon(nextTheme);
      });
    }
  },

  updateThemeToggleIcon(theme) {
    const icon = document.getElementById('themeToggleIcon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  },

  // Clipboard Copy with feedback
  async copyToClipboard(text, successMsg = 'Copied to clipboard!') {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-https/older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      this.showToast(successMsg, 'success');
      return true;
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      this.showToast('Failed to copy to clipboard', 'error');
      return false;
    }
  },

  // Supabase Connection Status UI Indicator
  updateConnectionStatus() {
    const statusPill = document.getElementById('connectionStatusPill');
    const statusDot = document.getElementById('connectionStatusDot');
    const statusText = document.getElementById('connectionStatusText');

    if (!statusPill) return;

    if (window.hasSupabaseCredentials && window.hasSupabaseCredentials()) {
      if (statusDot) statusDot.className = 'status-dot connected';
      if (statusText) statusText.textContent = 'Supabase: Connected';
      statusPill.title = 'Connected to remote Supabase database. Click to view configuration.';
    } else {
      if (statusDot) statusDot.className = 'status-dot demo';
      if (statusText) statusText.textContent = 'Supabase: Demo / Local Mode';
      statusPill.title = 'Running in Demo Mode (Local Storage). Click to connect your Supabase database.';
    }
  },

  // Helper: Sanitize / Escape HTML
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Format Dates nicely
  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }
};

window.UI = UI;
