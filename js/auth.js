/**
 * Authentication & Session Management Module
 * Handles Login, Session Checks, Inactivity Timeout, and Protected Views (SRS FR-4.1 - 4.3)
 */

const Auth = {
  currentUser: null,
  inactivityTimer: null,
  TIMEOUT_MINUTES: (window.APP_CONFIG && window.APP_CONFIG.DEFAULT_SESSION_TIMEOUT_MINS) || 30,

  async init() {
    this.bindEvents();
    this.setupInactivityTracker();
    await this.checkSession();
  },

  bindEvents() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Sign out buttons
    const btnSignOut = document.getElementById('btnSignOut');
    if (btnSignOut) {
      btnSignOut.addEventListener('click', () => this.handleSignOut());
    }

    // Supabase Auth State Change listener
    SupabaseService.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        this.currentUser = session.user;
        this.renderAuthenticatedState();
      } else {
        this.currentUser = null;
        this.renderUnauthenticatedState();
      }
    });
  },

  async checkSession() {
    try {
      const session = await SupabaseService.getSession();
      if (session && session.user) {
        this.currentUser = session.user;
        this.renderAuthenticatedState();
      } else {
        this.currentUser = null;
        this.renderUnauthenticatedState();
      }
    } catch (err) {
      console.warn('Session check warning:', err);
      this.currentUser = null;
      this.renderUnauthenticatedState();
    }
  },

  async handleLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const submitBtn = document.getElementById('btnLoginSubmit');
    const errorAlert = document.getElementById('loginErrorAlert');

    if (errorAlert) errorAlert.classList.add('hidden');

    const email = (emailInput ? emailInput.value : '').trim();
    const password = (passwordInput ? passwordInput.value : '').trim();

    if (!email || !password) {
      this.showLoginError('Please enter both email and password.');
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-sm"></span> Signing In...';
      }

      const { user } = await SupabaseService.signIn(email, password);
      this.currentUser = user;
      UI.showToast(`Welcome back, ${user.email}!`, 'success');
      this.renderAuthenticatedState();

      if (loginForm) loginForm.reset();
    } catch (err) {
      console.error('Sign-in failed:', err);
      this.showLoginError(err.message || 'Invalid credentials or connection error.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign In to Workspace ➔';
      }
    }
  },

  async handleSignOut() {
    try {
      await SupabaseService.signOut();
      this.currentUser = null;
      UI.showToast('You have been signed out successfully.', 'info');
      this.renderUnauthenticatedState();
    } catch (err) {
      console.error('Sign out error:', err);
      UI.showToast('Sign out encountered an error', 'error');
    }
  },

  showLoginError(msg) {
    const errorAlert = document.getElementById('loginErrorAlert');
    if (errorAlert) {
      errorAlert.textContent = msg;
      errorAlert.classList.remove('hidden');
      errorAlert.classList.add('animate-shake');
      setTimeout(() => errorAlert.classList.remove('animate-shake'), 400);
    } else {
      UI.showToast(msg, 'error');
    }
  },

  renderAuthenticatedState() {
    const loginSection = document.getElementById('loginSection');
    const adminSection = document.getElementById('adminSection');
    const userBadge = document.getElementById('userEmailBadge');
    const userBadgeContainer = document.getElementById('userBadgeContainer');

    if (loginSection) loginSection.classList.add('hidden');
    if (adminSection) {
      adminSection.classList.remove('hidden');
      adminSection.classList.add('animate-fade-in');
    }

    if (userBadge && this.currentUser) {
      userBadge.textContent = this.currentUser.email || 'Admin';
    }
    if (userBadgeContainer) {
      userBadgeContainer.classList.remove('hidden');
    }

    // Refresh Dashboard if visible
    if (window.Dashboard) {
      window.Dashboard.loadDocuments();
    }
  },

  renderUnauthenticatedState() {
    const loginSection = document.getElementById('loginSection');
    const adminSection = document.getElementById('adminSection');
    const userBadgeContainer = document.getElementById('userBadgeContainer');

    if (loginSection) {
      loginSection.classList.remove('hidden');
      loginSection.classList.add('animate-fade-in');
    }
    if (adminSection) adminSection.classList.add('hidden');
    if (userBadgeContainer) userBadgeContainer.classList.add('hidden');
  },

  // Inactivity auto-logout handler (SRS FR-4.3)
  setupInactivityTracker() {
    const resetTimer = () => {
      if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
      if (!this.currentUser) return;

      const timeoutMs = this.TIMEOUT_MINUTES * 60 * 1000;
      this.inactivityTimer = setTimeout(() => {
        if (this.currentUser) {
          UI.showToast('Session expired due to inactivity. Please sign in again.', 'warning');
          this.handleSignOut();
        }
      }, timeoutMs);
    };

    ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer();
  }
};

window.Auth = Auth;
