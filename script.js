/**
 * Kape Point Cafe - Frontend Architecture & Interactive Module
 * Plain Vanilla ES6+, Modular Event-Driven Architecture, Zero External Dependencies
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Theme Manager (Light / Dark Mode with Persistence)
     ========================================================================== */
  const ThemeManager = {
    STORAGE_KEY: 'kape_point_theme',
    toggleBtn: null,

    init() {
      this.toggleBtn = document.getElementById('theme-toggle');
      if (!this.toggleBtn) return;

      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

      this.applyTheme(initialTheme);

      this.toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
      });

      // Listen for OS system theme changes if user hasn't explicitly set a preference
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    },

    applyTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (this.toggleBtn) {
          this.toggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
          this.toggleBtn.setAttribute('title', 'Switch to Light Mode');
        }
      } else {
        document.documentElement.removeAttribute('data-theme');
        if (this.toggleBtn) {
          this.toggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
          this.toggleBtn.setAttribute('title', 'Switch to Dark Mode');
        }
      }
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
  };

  /* ==========================================================================
     2. Navigation Manager (Mobile Drawer & Accessible Keyboard Navigation)
     ========================================================================== */
  const NavigationManager = {
    hamburgerBtn: null,
    navDrawer: null,
    navLinks: [],

    init() {
      this.hamburgerBtn = document.getElementById('mobile-menu-btn');
      this.navDrawer = document.getElementById('main-nav');
      this.navLinks = document.querySelectorAll('.nav-link');

      if (!this.hamburgerBtn || !this.navDrawer) return;

      this.hamburgerBtn.addEventListener('click', () => this.toggleNav());

      // Auto-close menu when a nav link is clicked (crucial for mobile single-page anchor scroll)
      this.navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          if (this.navDrawer.classList.contains('open')) {
            this.closeNav();
          }
        });
      });

      // Close menu when clicking outside or pressing Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.navDrawer.classList.contains('open')) {
          this.closeNav();
          this.hamburgerBtn.focus();
        }
      });
    },

    toggleNav() {
      const isOpen = this.navDrawer.classList.contains('open');
      if (isOpen) {
        this.closeNav();
      } else {
        this.openNav();
      }
    },

    openNav() {
      this.navDrawer.classList.add('open');
      this.hamburgerBtn.classList.add('active');
      this.hamburgerBtn.setAttribute('aria-expanded', 'true');
    },

    closeNav() {
      this.navDrawer.classList.remove('open');
      this.hamburgerBtn.classList.remove('active');
      this.hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  };

  /* ==========================================================================
     3. Store Status Manager (Live Operating Hours Indicator)
     ========================================================================== */
  const StoreStatusManager = {
    statusDot: null,
    statusText: null,

    init() {
      this.statusDot = document.getElementById('status-dot');
      this.statusText = document.getElementById('status-text');
      if (!this.statusDot || !this.statusText) return;

      this.updateStatus();
      // Re-evaluate every 60 seconds
      setInterval(() => this.updateStatus(), 60000);
    },

    updateStatus() {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday, 1 is Monday, ... 6 is Saturday
      const hour = now.getHours();
      const minute = now.getMinutes();
      const currentTimeInMinutes = hour * 60 + minute;

      let isOpen = false;
      let closingTime = '';

      if (day >= 1 && day <= 4) {
        // Monday - Thursday: 7:00 AM (420m) to 9:00 PM (1260m)
        isOpen = currentTimeInMinutes >= 420 && currentTimeInMinutes < 1260;
        closingTime = '9:00 PM';
      } else if (day === 5 || day === 6) {
        // Friday - Saturday: 7:00 AM (420m) to 10:30 PM (1350m)
        isOpen = currentTimeInMinutes >= 420 && currentTimeInMinutes < 1350;
        closingTime = '10:30 PM';
      } else {
        // Sunday: 8:00 AM (480m) to 8:00 PM (1200m)
        isOpen = currentTimeInMinutes >= 480 && currentTimeInMinutes < 1200;
        closingTime = '8:00 PM';
      }

      if (isOpen) {
        this.statusDot.classList.remove('closed');
        this.statusText.textContent = `Open Now • Closes at ${closingTime}`;
      } else {
        this.statusDot.classList.add('closed');
        this.statusText.textContent = 'Closed Now • Opens at 7:00 AM';
      }
    }
  };

  /* ==========================================================================
     4. Menu Filter Manager (Tab Switching & Category Filtering)
     ========================================================================== */
  const MenuFilterManager = {
    filterButtons: [],
    menuCards: [],

    init() {
      this.filterButtons = document.querySelectorAll('.filter-btn');
      this.menuCards = document.querySelectorAll('.menu-card');

      if (!this.filterButtons.length) return;

      this.filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const category = btn.getAttribute('data-category');
          this.setActiveCategory(btn, category);
        });
      });
    },

    setActiveCategory(activeBtn, category) {
      // Update Tab state
      this.filterButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-selected', 'true');

      // Filter cards
      this.menuCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    }
  };

  /* ==========================================================================
     5. Modal Manager (Accessible Table Reservation Dialog)
     ========================================================================== */
  const ModalManager = {
    modal: null,
    closeBtn: null,
    cancelBtn: null,
    openButtons: [],
    form: null,
    feedback: null,
    notesInput: null,
    lastFocusedElement: null,

    init() {
      this.modal = document.getElementById('reservation-modal');
      this.closeBtn = document.getElementById('close-modal-btn');
      this.cancelBtn = document.getElementById('cancel-modal-btn');
      this.form = document.getElementById('reservation-form');
      this.feedback = document.getElementById('modal-feedback');
      this.notesInput = document.getElementById('res-notes');

      if (!this.modal) return;

      // Trigger buttons
      const headerBtn = document.getElementById('open-reserve-btn-header');
      const heroBtn = document.getElementById('open-reserve-btn-hero');
      const orderButtons = document.querySelectorAll('.order-item-btn');

      if (headerBtn) headerBtn.addEventListener('click', () => this.openModal());
      if (heroBtn) heroBtn.addEventListener('click', () => this.openModal());

      // Pre-fill notes when clicking "Reserve Order" on menu items
      orderButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const itemName = btn.getAttribute('data-name') || '';
          this.openModal(`Pre-order: ${itemName}`);
        });
      });

      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeModal());
      if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeModal());

      // Close on backdrop click
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });

      // Escape key listener & focus trapping
      document.addEventListener('keydown', (e) => {
        if (!this.modal.classList.contains('active')) return;

        if (e.key === 'Escape') {
          this.closeModal();
          return;
        }

        if (e.key === 'Tab') {
          this.handleFocusTrap(e);
        }
      });

      // Handle reservation form submission
      if (this.form) {
        this.form.addEventListener('submit', (e) => this.handleReservationSubmit(e));
      }
    },

    openModal(prefilledNote = '') {
      this.lastFocusedElement = document.activeElement;
      if (this.notesInput && prefilledNote) {
        this.notesInput.value = prefilledNote;
      }
      this.modal.classList.add('active');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Set default date to today
      const dateInput = document.getElementById('res-date');
      if (dateInput && !dateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
      }

      // Focus first input
      const firstInput = document.getElementById('res-name');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 50);
      }
    },

    closeModal() {
      this.modal.classList.remove('active');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (this.feedback) {
        this.feedback.style.display = 'none';
        this.feedback.className = 'modal-feedback';
      }
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
      }
    },

    handleFocusTrap(e) {
      const focusableElements = this.modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    },

    handleReservationSubmit(e) {
      e.preventDefault();

      const name = document.getElementById('res-name').value.trim();
      const phone = document.getElementById('res-phone').value.trim();
      const date = document.getElementById('res-date').value;
      const time = document.getElementById('res-time').value;

      if (!name || !phone || !date || !time) {
        this.showFeedback('Please fill out all required fields marked with an asterisk (*).', 'error');
        return;
      }

      // Simulated successful reservation
      this.showFeedback(`Reservation confirmed for ${name} on ${date} at ${time}! A confirmation SMS will be sent to ${phone}.`, 'success');

      setTimeout(() => {
        this.form.reset();
        this.closeModal();
      }, 2500);
    },

    showFeedback(message, type) {
      if (!this.feedback) return;
      this.feedback.textContent = message;
      this.feedback.className = `modal-feedback ${type}`;
      this.feedback.style.display = 'block';
    }
  };

  /* ==========================================================================
     6. Contact Form Validation Manager (Inline Checks & Friendly Feedback)
     ========================================================================== */
  const ContactFormManager = {
    form: null,
    feedback: null,

    init() {
      this.form = document.getElementById('contact-form');
      this.feedback = document.getElementById('form-feedback');
      if (!this.form) return;

      this.form.addEventListener('submit', (e) => this.handleSubmit(e));

      // Clear inline error on input
      ['contact-name', 'contact-email', 'contact-subject', 'contact-message'].forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
          input.addEventListener('input', () => {
            const errorSpan = document.getElementById(`${input.name}-error`);
            if (errorSpan) errorSpan.textContent = '';
          });
        }
      });
    },

    handleSubmit(e) {
      e.preventDefault();
      let hasError = false;

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      // Reset errors
      document.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));

      if (!nameVal) {
        this.setFieldError('name', 'Please provide your full name.');
        hasError = true;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailPattern.test(emailVal)) {
        this.setFieldError('email', 'Please provide a valid email address.');
        hasError = true;
      }

      if (!subjectVal) {
        this.setFieldError('subject', 'Please select a topic of inquiry.');
        hasError = true;
      }

      if (!messageVal || messageVal.length < 10) {
        this.setFieldError('message', 'Please write a message of at least 10 characters.');
        hasError = true;
      }

      if (hasError) {
        this.showFeedback('Please correct the highlighted fields before sending.', 'error');
        return;
      }

      // Success feedback
      this.showFeedback(`Thank you, ${nameVal}! Your inquiry has been sent to our roastery team. We will respond within 24 hours.`, 'success');
      this.form.reset();
    },

    setFieldError(fieldName, message) {
      const errorSpan = document.getElementById(`${fieldName}-error`);
      if (errorSpan) errorSpan.textContent = message;
    },

    showFeedback(message, type) {
      if (!this.feedback) return;
      this.feedback.textContent = message;
      this.feedback.className = `form-feedback ${type}`;
    }
  };

  /* ==========================================================================
     Application Initialization
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    NavigationManager.init();
    StoreStatusManager.init();
    MenuFilterManager.init();
    ModalManager.init();
    ContactFormManager.init();
  });
})();
