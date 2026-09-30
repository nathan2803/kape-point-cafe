/**
 * Kape Point Cafe - Online Ordering Architecture (order.js)
 * Modular Vanilla ES6+ State & Event Architecture, Zero Framework Dependencies
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Menu Item Database
     ========================================================================== */
  const MENU_DATABASE = [
    {
      id: 'barako-double',
      name: 'Highland Barako Double',
      category: 'espresso',
      price: 120,
      image: './assets/menu-espresso.svg',
      tag: 'Roaster Pick',
      type: 'beverage',
      desc: 'Double-shot single-origin Batangas Liberica blend with notes of dark cacao, toasted hazelnut, and sweet anise.',
      details: 'Single Origin / 60ml'
    },
    {
      id: 'spanish-latte',
      name: 'Spanish Caramel Latte',
      category: 'espresso',
      price: 165,
      image: './assets/menu-latte.svg',
      tag: 'Customer Favorite',
      type: 'beverage',
      desc: 'Steamed oat or fresh milk, sweetened condensed milk drizzle, robust espresso, and a touch of Pangasinan sea salt.',
      details: 'Hot or Chilled / 350ml'
    },
    {
      id: 'cold-brew',
      name: 'Slow Drip Cold Brew',
      category: 'cold',
      price: 150,
      image: './assets/menu-coldbrew.svg',
      tag: '48-Hr Extraction',
      type: 'beverage',
      desc: 'Immersion brewed for 48 hours under chilled temperatures. Silky mouthfeel with sweet stone fruit undertones.',
      details: 'Chilled / Low Acidity'
    },
    {
      id: 'americano',
      name: 'Iced Highland Americano',
      category: 'espresso',
      price: 130,
      image: './assets/menu-americano.svg',
      tag: 'Clean & Bold',
      type: 'beverage',
      desc: 'Two shots of Benguet Arabica pulled over crisp mineral water and slow-melting crystal ice.',
      details: 'Chilled / 350ml'
    },
    {
      id: 'matcha-latte',
      name: 'Uji Cloud Matcha Latte',
      category: 'cold',
      price: 175,
      image: './assets/menu-matcha.svg',
      tag: 'Non-Coffee',
      type: 'beverage',
      desc: 'Whisked first-harvest Japanese ceremonial matcha layered over creamy chilled milk with pure wildflower honey.',
      details: 'Antioxidant-Rich / 350ml'
    },
    {
      id: 'butter-croissant',
      name: 'Flaky French Butter Croissant',
      category: 'pastry',
      price: 110,
      image: './assets/menu-pastry.svg',
      tag: 'Baked at 6:30 AM',
      type: 'pastry',
      desc: 'Layered with French butter, fermented over 72 hours for an airy honeycomb crumb and golden caramelized crust.',
      details: 'Fresh Daily / French Butter'
    },
    {
      id: 'sourdough-melt',
      name: 'Wild Sourdough Melt',
      category: 'savory',
      price: 195,
      image: './assets/menu-sandwich.svg',
      tag: 'Warm Sourdough',
      type: 'pastry',
      desc: 'House-baked rye sourdough packed with smoked ham, aged cheddar, dijon emulsion, and crisp garden arugula.',
      details: 'Grilled Warm / House Sourdough'
    },
    {
      id: 'sea-salt-cookie',
      name: 'Sea Salt Dark Chocolate Cookie',
      category: 'pastry',
      price: 95,
      image: './assets/menu-cookie.svg',
      tag: 'Single Batch',
      type: 'pastry',
      desc: 'Thick-baked browned butter dough studded with 70% Davao dark chocolate chunks and Maldon sea salt flakes.',
      details: 'Fresh Daily / Baked In-House'
    }
  ];

  /* ==========================================================================
     2. Theme Manager (Shared with Index)
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
     3. Authentication & Member Rewards State Manager
     ========================================================================== */
  const AuthManager = {
    STORAGE_KEY: 'kape_point_user',
    user: null,

    init() {
      this.loadUser();
      this.renderAuthState();
      this.bindEvents();
    },

    loadUser() {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.user = JSON.parse(stored);
        } catch {
          this.user = null;
        }
      }
    },

    saveUser(userObj) {
      this.user = userObj;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userObj));
      this.renderAuthState();
    },

    signOut() {
      this.user = null;
      localStorage.removeItem(this.STORAGE_KEY);
      this.renderAuthState();
    },

    addPoints(pointsToAdd) {
      if (!this.user) return;
      this.user.points = (this.user.points || 0) + pointsToAdd;
      this.saveUser(this.user);
    },

    renderAuthState() {
      const headerContainer = document.getElementById('auth-header-container');
      const rewardsBanner = document.getElementById('rewards-banner');
      const pointsRewardNote = document.getElementById('points-reward-note');

      if (!headerContainer) return;

      if (this.user) {
        // Authenticated Header Badge
        const initials = this.user.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();

        headerContainer.innerHTML = `
          <div class="user-profile-badge">
            <div class="user-avatar-circle">${initials}</div>
            <div class="user-meta-text">
              <span class="user-display-name">${this.user.name}</span>
              <span class="user-points-pill">★ ${this.user.points} Points</span>
            </div>
            <button type="button" class="btn-text user-signout-btn" id="signout-btn" title="Sign Out">Sign Out</button>
          </div>
        `;

        const signoutBtn = document.getElementById('signout-btn');
        if (signoutBtn) signoutBtn.addEventListener('click', () => this.signOut());

        // Authenticated Banner
        if (rewardsBanner) {
          const neededForNextReward = Math.max(0, 150 - (this.user.points % 150));
          const progressPercent = Math.min(100, Math.round(((this.user.points % 150) / 150) * 100));

          rewardsBanner.innerHTML = `
            <div class="rewards-banner-inner signed-in">
              <div class="rewards-info">
                <span class="rewards-greeting">Mabuhay, ${this.user.name}!</span>
                <p class="rewards-status-text">
                  You have <strong>${this.user.points} Kape Points</strong>. Only ${neededForNextReward} more points until a complimentary Highland Pour-Over!
                </p>
                <div class="rewards-bar-track" role="progressbar" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100">
                  <div class="rewards-bar-fill" style="width: ${progressPercent}%;"></div>
                </div>
              </div>
              <div class="rewards-badge-tier">
                <span class="tier-label">Member Tier</span>
                <strong class="tier-name">${this.user.points >= 200 ? 'Gold Roaster' : 'Highland Regular'}</strong>
              </div>
            </div>
          `;
        }

        if (pointsRewardNote) {
          pointsRewardNote.innerHTML = `Earning <strong>10 Points</strong> per ₱100 to account <strong>${this.user.email}</strong>.`;
        }
      } else {
        // Guest / Unauthenticated Header Button
        headerContainer.innerHTML = `
          <button type="button" class="btn btn-sm btn-secondary sign-in-trigger-btn" id="open-auth-modal-btn">
            Sign In
          </button>
        `;

        const openBtn = document.getElementById('open-auth-modal-btn');
        if (openBtn) openBtn.addEventListener('click', () => this.openAuthModal());

        // Guest Banner
        if (rewardsBanner) {
          rewardsBanner.innerHTML = `
            <div class="rewards-banner-inner guest">
              <div class="rewards-info">
                <span class="rewards-greeting">Kape Point Rewards</span>
                <p class="rewards-status-text">
                  Sign in or create an account to earn points on every cup, save favorite brew recipes, and receive free anniversary drinks.
                </p>
              </div>
              <button type="button" class="btn btn-primary" id="banner-signin-btn">
                Sign In / Join
              </button>
            </div>
          `;

          const bannerBtn = document.getElementById('banner-signin-btn');
          if (bannerBtn) bannerBtn.addEventListener('click', () => this.openAuthModal());
        }

        if (pointsRewardNote) {
          pointsRewardNote.innerHTML = `Sign in to earn <strong>10 Kape Points</strong> per ₱100 spent.`;
        }
      }
    },

    bindEvents() {
      const modal = document.getElementById('auth-modal');
      const closeBtn = document.getElementById('close-auth-modal-btn');
      const authForm = document.getElementById('auth-form');
      const quickDemoBtn = document.getElementById('quick-demo-btn');

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeAuthModal());

      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) this.closeAuthModal();
        });
      }

      // Quick Demo 1-Click Login
      if (quickDemoBtn) {
        quickDemoBtn.addEventListener('click', () => {
          this.saveUser({
            name: 'Juan Dela Cruz',
            email: 'juan@example.com',
            points: 120
          });
          this.closeAuthModal();
        });
      }

      // Form submission login
      if (authForm) {
        authForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const nameInput = document.getElementById('auth-name');
          const emailInput = document.getElementById('auth-email');
          const feedback = document.getElementById('auth-feedback');

          const nameVal = nameInput ? nameInput.value.trim() : '';
          const emailVal = emailInput ? emailInput.value.trim() : '';

          if (!nameVal || !emailVal) {
            if (feedback) {
              feedback.textContent = 'Please provide both your name and email.';
              feedback.className = 'form-feedback error';
            }
            return;
          }

          this.saveUser({
            name: nameVal,
            email: emailVal,
            points: 50 // Welcome bonus points
          });
          authForm.reset();
          this.closeAuthModal();
        });
      }
    },

    openAuthModal() {
      const modal = document.getElementById('auth-modal');
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const nameInput = document.getElementById('auth-name');
        if (nameInput) setTimeout(() => nameInput.focus(), 50);
      }
    },

    closeAuthModal() {
      const modal = document.getElementById('auth-modal');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  };

  /* ==========================================================================
     4. Catalog Manager (Search, Filter, & Item Rendering)
     ========================================================================== */
  const CatalogManager = {
    currentCategory: 'all',
    searchQuery: '',
    itemsContainer: null,

    init() {
      this.itemsContainer = document.getElementById('order-grid');
      if (!this.itemsContainer) return;

      this.render();
      this.bindFilters();
      this.bindSearch();
    },

    bindFilters() {
      const filterBtns = document.querySelectorAll('.order-filter-bar .filter-btn');
      filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          filterBtns.forEach((b) => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          this.currentCategory = btn.getAttribute('data-category') || 'all';
          this.render();
        });
      });
    },

    bindSearch() {
      const searchInput = document.getElementById('catalog-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.render();
        });
      }
    },

    render() {
      const filtered = MENU_DATABASE.filter((item) => {
        const matchesCategory = this.currentCategory === 'all' || item.category === this.currentCategory;
        const matchesSearch = !this.searchQuery ||
          item.name.toLowerCase().includes(this.searchQuery) ||
          item.desc.toLowerCase().includes(this.searchQuery);
        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        this.itemsContainer.innerHTML = `
          <div class="empty-search-state">
            <p>No matching coffee or pastry found for "${this.searchQuery}".</p>
            <button type="button" class="btn-text" id="reset-search-btn">Reset search filters</button>
          </div>
        `;
        const resetBtn = document.getElementById('reset-search-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            const searchInput = document.getElementById('catalog-search');
            if (searchInput) searchInput.value = '';
            this.searchQuery = '';
            this.render();
          });
        }
        return;
      }

      this.itemsContainer.innerHTML = filtered
        .map((item) => `
          <article class="order-card" data-id="${item.id}">
            <div class="order-card-media">
              <img src="${item.image}" alt="${item.name}" width="140" height="140" loading="lazy">
              ${item.tag ? `<span class="item-tag">${item.tag}</span>` : ''}
            </div>
            <div class="order-card-info">
              <div class="order-card-title-row">
                <h3 class="order-item-title">${item.name}</h3>
                <span class="order-item-price">₱${item.price.toFixed(2)}</span>
              </div>
              <p class="order-item-description">${item.desc}</p>
              <div class="order-card-bottom">
                <span class="order-item-specs">${item.details}</span>
                <button type="button" class="btn btn-sm btn-primary add-item-trigger-btn" data-id="${item.id}">
                  Customize &amp; Add
                </button>
              </div>
            </div>
          </article>
        `)
        .join('');

      // Bind customization triggers
      this.itemsContainer.querySelectorAll('.add-item-trigger-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const itemId = btn.getAttribute('data-id');
          const targetItem = MENU_DATABASE.find((i) => i.id === itemId);
          if (targetItem) {
            CustomizationModalManager.open(targetItem);
          }
        });
      });
    }
  };

  /* ==========================================================================
     5. Customization Modal Manager
     ========================================================================== */
  const CustomizationModalManager = {
    modal: null,
    currentItem: null,
    quantity: 1,

    init() {
      this.modal = document.getElementById('customize-modal');
      const closeBtn = document.getElementById('close-customize-modal-btn');
      const minusBtn = document.getElementById('qty-minus');
      const plusBtn = document.getElementById('qty-plus');
      const confirmBtn = document.getElementById('confirm-add-item-btn');

      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (this.modal) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) this.close();
        });
      }

      if (minusBtn) {
        minusBtn.addEventListener('click', () => {
          if (this.quantity > 1) {
            this.quantity--;
            this.updatePriceDisplay();
          }
        });
      }

      if (plusBtn) {
        plusBtn.addEventListener('click', () => {
          if (this.quantity < 20) {
            this.quantity++;
            this.updatePriceDisplay();
          }
        });
      }

      // Radio pills listener to recalculate price dynamically
      const radioInputs = document.querySelectorAll('#customize-modal input[type="radio"]');
      radioInputs.forEach((radio) => {
        radio.addEventListener('change', () => {
          // Highlight active label
          const parentGroup = radio.closest('.radio-pill-group');
          if (parentGroup) {
            parentGroup.querySelectorAll('.radio-pill').forEach((pill) => pill.classList.remove('active'));
            radio.closest('.radio-pill')?.classList.add('active');
          }
          this.updatePriceDisplay();
        });
      });

      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => this.handleConfirm());
      }
    },

    open(item) {
      this.currentItem = item;
      this.quantity = 1;

      const titleEl = document.getElementById('customize-title');
      const priceEl = document.getElementById('customize-base-price');
      const descEl = document.getElementById('customize-item-desc');
      const notesEl = document.getElementById('customize-notes');

      if (titleEl) titleEl.textContent = item.name;
      if (priceEl) priceEl.textContent = `₱${item.price.toFixed(2)}`;
      if (descEl) descEl.textContent = item.desc;
      if (notesEl) notesEl.value = '';

      // Reset options
      document.querySelectorAll('#customize-modal input[type="radio"]').forEach((r) => {
        if (r.value === 'dairy' || r.value === '100%' || r.value === 'iced' || r.value === 'standard') {
          r.checked = true;
          r.closest('.radio-pill')?.classList.add('active');
        } else {
          r.checked = false;
          r.closest('.radio-pill')?.classList.remove('active');
        }
      });

      // Show/hide beverage options vs pastry options
      const isBeverage = item.type === 'beverage';
      const milkGroup = document.getElementById('opt-milk-group');
      const sweetGroup = document.getElementById('opt-sweet-group');
      const tempGroup = document.getElementById('opt-temp-group');
      const shotGroup = document.getElementById('opt-shot-group');

      if (milkGroup) milkGroup.style.display = isBeverage ? 'block' : 'none';
      if (sweetGroup) sweetGroup.style.display = isBeverage ? 'block' : 'none';
      if (tempGroup) tempGroup.style.display = isBeverage ? 'block' : 'none';
      if (shotGroup) shotGroup.style.display = isBeverage && item.category === 'espresso' ? 'block' : 'none';

      this.updatePriceDisplay();

      this.modal.classList.add('active');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    },

    close() {
      if (!this.modal) return;
      this.modal.classList.remove('active');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      this.currentItem = null;
    },

    calculateCurrentItemUnitPrice() {
      if (!this.currentItem) return 0;
      let unitPrice = this.currentItem.price;

      const selectedMilk = document.querySelector('input[name="opt-milk"]:checked');
      if (selectedMilk && (selectedMilk.value === 'oat' || selectedMilk.value === 'almond')) {
        unitPrice += 30;
      }

      const selectedShot = document.querySelector('input[name="opt-shot"]:checked');
      if (selectedShot && selectedShot.value === 'extra') {
        unitPrice += 40;
      }

      return unitPrice;
    },

    updatePriceDisplay() {
      const unitPrice = this.calculateCurrentItemUnitPrice();
      const totalPrice = unitPrice * this.quantity;

      const qtyVal = document.getElementById('qty-val');
      const totalBtnPrice = document.getElementById('customize-total-btn-price');

      if (qtyVal) qtyVal.textContent = this.quantity;
      if (totalBtnPrice) totalBtnPrice.textContent = `₱${totalPrice.toFixed(2)}`;
    },

    handleConfirm() {
      if (!this.currentItem) return;

      const unitPrice = this.calculateCurrentItemUnitPrice();
      const selectedMilk = document.querySelector('input[name="opt-milk"]:checked')?.value || 'dairy';
      const selectedSweet = document.querySelector('input[name="opt-sweet"]:checked')?.value || '100%';
      const selectedTemp = document.querySelector('input[name="opt-temp"]:checked')?.value || 'iced';
      const selectedShot = document.querySelector('input[name="opt-shot"]:checked')?.value || 'standard';
      const notesVal = document.getElementById('customize-notes')?.value.trim() || '';

      const customizationSummary = [];
      if (this.currentItem.type === 'beverage') {
        customizationSummary.push(selectedTemp === 'iced' ? 'Chilled' : 'Steamed Hot');
        if (selectedMilk !== 'dairy') customizationSummary.push(selectedMilk === 'oat' ? 'Oat Milk (+₱30)' : 'Almond Milk (+₱30)');
        if (selectedSweet !== '100%') customizationSummary.push(`${selectedSweet} Sweet`);
        if (selectedShot === 'extra') customizationSummary.push('Extra Shot (+₱40)');
      }
      if (notesVal) customizationSummary.push(`"${notesVal}"`);

      CartManager.addItem({
        id: `${this.currentItem.id}-${Date.now()}`,
        menuItemId: this.currentItem.id,
        name: this.currentItem.name,
        unitPrice: unitPrice,
        quantity: this.quantity,
        customization: customizationSummary.join(', ') || 'Standard'
      });

      this.close();
    }
  };

  /* ==========================================================================
     6. Cart & Order Tray Manager
     ========================================================================== */
  const CartManager = {
    items: [],
    fulfillment: 'dine-in',
    hasTumblerDiscount: false,

    init() {
      this.bindFulfillmentOptions();
      this.bindTumblerDiscount();
      this.bindMobileDrawer();
      this.render();
    },

    addItem(itemObj) {
      // Check if duplicate with same customization
      const existing = this.items.find(
        (i) => i.menuItemId === itemObj.menuItemId && i.customization === itemObj.customization
      );

      if (existing) {
        existing.quantity += itemObj.quantity;
      } else {
        this.items.push(itemObj);
      }

      this.render();
      this.notifyCartUpdated();
    },

    removeItem(id) {
      this.items = this.items.filter((i) => i.id !== id);
      this.render();
    },

    updateQuantity(id, delta) {
      const item = this.items.find((i) => i.id === id);
      if (!item) return;

      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(id);
      } else {
        this.render();
      }
    },

    clearCart() {
      this.items = [];
      this.render();
    },

    bindFulfillmentOptions() {
      const radios = document.querySelectorAll('input[name="fulfillment"]');
      const tableGroup = document.getElementById('table-input-group');
      const addressGroup = document.getElementById('address-input-group');

      radios.forEach((radio) => {
        radio.addEventListener('change', () => {
          this.fulfillment = radio.value;

          radios.forEach((r) => r.closest('.fulfillment-pill')?.classList.remove('active'));
          radio.closest('.fulfillment-pill')?.classList.add('active');

          if (tableGroup) tableGroup.style.display = this.fulfillment === 'dine-in' ? 'block' : 'none';
          if (addressGroup) addressGroup.style.display = this.fulfillment === 'delivery' ? 'block' : 'none';
        });
      });
    },

    bindTumblerDiscount() {
      const checkbox = document.getElementById('tumbler-discount-checkbox');
      if (checkbox) {
        checkbox.addEventListener('change', () => {
          this.hasTumblerDiscount = checkbox.checked;
          this.render();
        });
      }
    },

    bindMobileDrawer() {
      const mobileToggleBtn = document.getElementById('mobile-cart-toggle');
      const sidebar = document.getElementById('order-tray-sidebar');

      if (mobileToggleBtn && sidebar) {
        mobileToggleBtn.addEventListener('click', () => {
          sidebar.classList.toggle('mobile-open');
        });
      }
    },

    notifyCartUpdated() {
      const badge = document.getElementById('mobile-cart-count');
      if (badge) {
        badge.classList.add('bounce');
        setTimeout(() => badge.classList.remove('bounce'), 300);
      }
    },

    calculateTotals() {
      const subtotal = this.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const discount = this.hasTumblerDiscount && subtotal > 0 ? 15 : 0;
      const total = Math.max(0, subtotal - discount);
      return { subtotal, discount, total };
    },

    render() {
      const listEl = document.getElementById('tray-items-list');
      const counterEl = document.getElementById('tray-item-counter');
      const mobileCounterEl = document.getElementById('mobile-cart-count');
      const subtotalEl = document.getElementById('tray-subtotal');
      const discountRow = document.getElementById('discount-row');
      const discountEl = document.getElementById('tray-discount');
      const totalEl = document.getElementById('tray-total');
      const checkoutBtn = document.getElementById('checkout-btn');

      const totalItemsCount = this.items.reduce((sum, i) => sum + i.quantity, 0);

      if (counterEl) counterEl.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'}`;
      if (mobileCounterEl) mobileCounterEl.textContent = totalItemsCount;

      if (!listEl) return;

      if (this.items.length === 0) {
        listEl.innerHTML = `
          <div class="empty-tray-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <p class="empty-title">Your tray is empty</p>
            <p class="empty-subtitle">Choose handcrafted beverages or pastries from the menu to start your order.</p>
          </div>
        `;
        if (checkoutBtn) checkoutBtn.disabled = true;
      } else {
        listEl.innerHTML = this.items
          .map((item) => `
            <div class="tray-item-row" data-id="${item.id}">
              <div class="tray-item-details">
                <span class="tray-item-name">${item.name}</span>
                <span class="tray-item-customization">${item.customization}</span>
                <span class="tray-item-unit-cost">₱${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
              <div class="tray-item-actions">
                <div class="qty-stepper-sm">
                  <button type="button" class="btn-step-minus" data-id="${item.id}" aria-label="Decrease quantity">-</button>
                  <span class="step-qty-val">${item.quantity}</span>
                  <button type="button" class="btn-step-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                </div>
                <button type="button" class="tray-remove-btn" data-id="${item.id}" aria-label="Remove item">&times;</button>
              </div>
            </div>
          `)
          .join('');

        if (checkoutBtn) checkoutBtn.disabled = false;

        // Bind item row actions
        listEl.querySelectorAll('.btn-step-minus').forEach((btn) => {
          btn.addEventListener('click', () => this.updateQuantity(btn.getAttribute('data-id'), -1));
        });
        listEl.querySelectorAll('.btn-step-plus').forEach((btn) => {
          btn.addEventListener('click', () => this.updateQuantity(btn.getAttribute('data-id'), 1));
        });
        listEl.querySelectorAll('.tray-remove-btn').forEach((btn) => {
          btn.addEventListener('click', () => this.removeItem(btn.getAttribute('data-id')));
        });
      }

      // Calculate totals
      const { subtotal, discount, total } = this.calculateTotals();
      if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
      if (discountRow) discountRow.style.display = discount > 0 ? 'flex' : 'none';
      if (discountEl) discountEl.textContent = `-₱${discount.toFixed(2)}`;
      if (totalEl) totalEl.textContent = `₱${total.toFixed(2)}`;
    }
  };

  /* ==========================================================================
     7. Checkout & Confirmation Manager
     ========================================================================== */
  const CheckoutManager = {
    init() {
      const checkoutBtn = document.getElementById('checkout-btn');
      const receiptCloseBtn = document.getElementById('receipt-close-btn');
      const receiptModal = document.getElementById('receipt-modal');

      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => this.handleCheckout());
      }

      if (receiptCloseBtn) {
        receiptCloseBtn.addEventListener('click', () => this.closeReceipt());
      }

      if (receiptModal) {
        receiptModal.addEventListener('click', (e) => {
          if (e.target === receiptModal) this.closeReceipt();
        });
      }
    },

    handleCheckout() {
      if (CartManager.items.length === 0) return;

      // If user is not signed in, offer quick sign-in to earn points
      if (!AuthManager.user) {
        AuthManager.openAuthModal();
        return;
      }

      const { total } = CartManager.calculateTotals();
      const pointsEarned = Math.floor(total / 10);
      const orderRef = `KP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const tableInput = document.getElementById('order-table-num');
      const tableNum = tableInput ? tableInput.value.trim() : '';

      // Update rewards points for signed in member
      AuthManager.addPoints(pointsEarned);

      // Populate Receipt Modal
      const refCodeEl = document.getElementById('receipt-ref-code');
      const dispatchEl = document.getElementById('receipt-dispatch-instruction');
      const itemsListEl = document.getElementById('receipt-items-list');
      const finalTotalEl = document.getElementById('receipt-final-total');
      const pointsBadgeEl = document.getElementById('receipt-points-earned');

      if (refCodeEl) refCodeEl.textContent = `Order Ref: #${orderRef}`;

      if (dispatchEl) {
        if (CartManager.fulfillment === 'dine-in') {
          dispatchEl.textContent = tableNum
            ? `Your order will be served directly to ${tableNum}.`
            : 'Your order will be served to your table once seated.';
        } else if (CartManager.fulfillment === 'pickup') {
          dispatchEl.textContent = 'Please present your order reference number at our express pickup counter.';
        } else {
          dispatchEl.textContent = 'Our courier is preparing to dispatch your warm order across Lucena City.';
        }
      }

      if (itemsListEl) {
        itemsListEl.innerHTML = CartManager.items
          .map(
            (item) => `
            <li class="receipt-item-row">
              <div>
                <strong>${item.quantity}x ${item.name}</strong>
                <p class="receipt-item-customization">${item.customization}</p>
              </div>
              <span>₱${(item.unitPrice * item.quantity).toFixed(2)}</span>
            </li>
          `
          )
          .join('');
      }

      if (finalTotalEl) finalTotalEl.textContent = `₱${total.toFixed(2)}`;
      if (pointsBadgeEl) pointsBadgeEl.textContent = `+${pointsEarned} Points Earned`;

      // Open receipt modal
      const receiptModal = document.getElementById('receipt-modal');
      if (receiptModal) {
        receiptModal.classList.add('active');
        receiptModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }

      // Clear Cart
      CartManager.clearCart();
    },

    closeReceipt() {
      const receiptModal = document.getElementById('receipt-modal');
      if (receiptModal) {
        receiptModal.classList.remove('active');
        receiptModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  };

  /* ==========================================================================
     Application Lifecycle Initialization
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    AuthManager.init();
    CatalogManager.init();
    CustomizationModalManager.init();
    CartManager.init();
    CheckoutManager.init();
  });
})();
