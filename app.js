/**
 * Auspify E-Commerce Store - Core Application Logic
 * Implements catalog filtering, search, cart, checkout, order management & localStorage
 */

// Initial demo order so users can immediately test Order Management
const defaultInitialOrders = [
  {
    id: "ORD-849201",
    date: new Date(Date.now() - 86400000 * 2).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }),
    status: "Shipped",
    items: [
      {
        id: 1,
        name: "Aura Pro Wireless ANC Headphones",
        price: 199.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
      },
      {
        id: 12,
        name: "Executive Leather Bound Notebook & Pen",
        price: 29.99,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80"
      }
    ],
    shippingAddress: {
      fullName: "Alex Morgan",
      email: "alex.morgan@example.com",
      phone: "+1 (555) 234-5678",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      zip: "97477"
    },
    paymentMethod: "Credit Card (ending in 4242)",
    subtotal: 259.97,
    shippingCost: 0,
    tax: 20.80,
    discount: 51.99,
    total: 228.78
  }
];

// App Global State
const appState = {
  products: [...productsData],
  cart: JSON.parse(localStorage.getItem("auspify_cart")) || [],
  wishlist: JSON.parse(localStorage.getItem("auspify_wishlist")) || [],
  orders: JSON.parse(localStorage.getItem("auspify_orders")) || defaultInitialOrders,
  theme: localStorage.getItem("auspify_theme") || "light",
  activeCategory: "all",
  searchQuery: "",
  maxPrice: 250,
  sortBy: "featured",
  appliedCoupon: null,
  checkoutStep: 1,
  checkoutFormData: {
    shipping: {},
    paymentMethod: "card"
  },
  currentQuickViewProduct: null,
  lastCompletedOrder: null
};

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupEventListeners();
  renderCategories();
  renderProducts();
  updateCartBadge();
  updateWishlistBadge();
});

// ==========================================================================
// Theme Management (Light / Dark Mode)
// ==========================================================================
function initTheme() {
  document.documentElement.setAttribute("data-theme", appState.theme);
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.innerHTML = appState.theme === "dark" ? getSunIcon() : getMoonIcon();
  }
}

function toggleTheme() {
  appState.theme = appState.theme === "light" ? "dark" : "light";
  localStorage.setItem("auspify_theme", appState.theme);
  initTheme();
  showToast(`Switched to ${appState.theme} mode`, "info");
}

// ==========================================================================
// Event Listeners Setup
// ==========================================================================
function setupEventListeners() {
  // Theme Toggle
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Live Search with Debounce
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        appState.searchQuery = e.target.value.trim().toLowerCase();
        if (clearSearchBtn) {
          clearSearchBtn.style.display = appState.searchQuery ? "flex" : "none";
        }
        renderProducts();
      }, 250);
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      appState.searchQuery = "";
      clearSearchBtn.style.display = "none";
      renderProducts();
    });
  }

  // Price Slider
  const priceSlider = document.getElementById("price-slider");
  const priceValueDisplay = document.getElementById("price-value-display");
  if (priceSlider) {
    priceSlider.addEventListener("input", (e) => {
      appState.maxPrice = parseFloat(e.target.value);
      if (priceValueDisplay) {
        priceValueDisplay.textContent = `$${appState.maxPrice}`;
      }
      renderProducts();
    });
  }

  // Sorting
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      appState.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Cart Drawer Open / Close
  const cartBtn = document.getElementById("cart-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartOverlay = document.getElementById("cart-overlay");
  const continueShoppingBtn = document.getElementById("continue-shopping-btn");

  if (cartBtn) cartBtn.addEventListener("click", openCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
  if (continueShoppingBtn) continueShoppingBtn.addEventListener("click", closeCart);

  // Wishlist Modal Open / Close
  const wishlistBtn = document.getElementById("wishlist-btn");
  const closeWishlistBtn = document.getElementById("close-wishlist-btn");
  const wishlistOverlay = document.getElementById("wishlist-modal-overlay");

  if (wishlistBtn) wishlistBtn.addEventListener("click", openWishlist);
  if (closeWishlistBtn) closeWishlistBtn.addEventListener("click", closeWishlist);
  if (wishlistOverlay) {
    wishlistOverlay.addEventListener("click", (e) => {
      if (e.target === wishlistOverlay) closeWishlist();
    });
  }

  // Orders Dashboard Open / Close
  const ordersBtn = document.getElementById("orders-btn");
  const closeOrdersBtn = document.getElementById("close-orders-btn");
  const ordersOverlay = document.getElementById("orders-modal-overlay");

  if (ordersBtn) ordersBtn.addEventListener("click", openOrders);
  if (closeOrdersBtn) closeOrdersBtn.addEventListener("click", closeOrders);
  if (ordersOverlay) {
    ordersOverlay.addEventListener("click", (e) => {
      if (e.target === ordersOverlay) closeOrders();
    });
  }

  // Quick View Close
  const closeQuickViewBtn = document.getElementById("close-quick-view-btn");
  const quickViewOverlay = document.getElementById("quick-view-modal-overlay");
  if (closeQuickViewBtn) closeQuickViewBtn.addEventListener("click", closeQuickView);
  if (quickViewOverlay) {
    quickViewOverlay.addEventListener("click", (e) => {
      if (e.target === quickViewOverlay) closeQuickView();
    });
  }

  // Checkout Modal Open / Close
  const proceedCheckoutBtn = document.getElementById("proceed-checkout-btn");
  const closeCheckoutBtn = document.getElementById("close-checkout-btn");
  const checkoutOverlay = document.getElementById("checkout-modal-overlay");

  if (proceedCheckoutBtn) proceedCheckoutBtn.addEventListener("click", startCheckout);
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener("click", closeCheckout);
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener("click", (e) => {
      if (e.target === checkoutOverlay) closeCheckout();
    });
  }

  // Checkout Steps Buttons
  const checkoutNextBtn = document.getElementById("checkout-next-btn");
  const checkoutPrevBtn = document.getElementById("checkout-prev-btn");
  const placeOrderBtn = document.getElementById("place-order-btn");

  if (checkoutNextBtn) checkoutNextBtn.addEventListener("click", handleCheckoutNext);
  if (checkoutPrevBtn) checkoutPrevBtn.addEventListener("click", handleCheckoutPrev);
  if (placeOrderBtn) placeOrderBtn.addEventListener("click", handlePlaceOrder);

  // Payment Method Selection
  const paymentCards = document.querySelectorAll(".payment-method-card");
  paymentCards.forEach(card => {
    card.addEventListener("click", () => {
      paymentCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      const radio = card.querySelector("input[type='radio']");
      if (radio) {
        radio.checked = true;
        appState.checkoutFormData.paymentMethod = radio.value;
        togglePaymentDetailsFields(radio.value);
      }
    });
  });

  // Apply Coupon
  const applyCouponBtn = document.getElementById("apply-coupon-btn");
  const couponInput = document.getElementById("coupon-input");
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener("click", () => {
      const code = couponInput.value.trim().toUpperCase();
      applyCoupon(code);
    });
    couponInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyCoupon(couponInput.value.trim().toUpperCase());
      }
    });
  }

  // Order Confirmation Modal Close & Track
  const closeConfirmationBtn = document.getElementById("close-confirmation-btn");
  const viewOrderHistoryBtn = document.getElementById("view-order-history-btn");
  const printReceiptBtn = document.getElementById("print-receipt-btn");

  if (closeConfirmationBtn) {
    closeConfirmationBtn.addEventListener("click", () => {
      closeConfirmationModal();
    });
  }

  if (viewOrderHistoryBtn) {
    viewOrderHistoryBtn.addEventListener("click", () => {
      closeConfirmationModal();
      openOrders();
    });
  }

  if (printReceiptBtn) {
    printReceiptBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Close modals on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
      closeQuickView();
      closeWishlist();
      closeCheckout();
      closeOrders();
      closeConfirmationModal();
    }
  });
}

// ==========================================================================
// Category Chips Rendering
// ==========================================================================
function renderCategories() {
  const categoriesContainer = document.getElementById("categories-container");
  if (!categoriesContainer) return;

  const categories = [
    { id: "all", label: "All Products", icon: "✨" },
    { id: "electronics", label: "Electronics", icon: "⚡" },
    { id: "fashion", label: "Fashion & Apparel", icon: "👕" },
    { id: "home", label: "Home & Living", icon: "🏡" },
    { id: "accessories", label: "Accessories", icon: "🎒" }
  ];

  categoriesContainer.innerHTML = categories.map(cat => `
    <button class="category-chip ${appState.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
      <span>${cat.icon}</span>
      <span>${cat.label}</span>
    </button>
  `).join("");

  categoriesContainer.querySelectorAll(".category-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      appState.activeCategory = btn.getAttribute("data-category");
      renderCategories();
      renderProducts();
    });
  });
}

// ==========================================================================
// Product Catalog Filtering & Rendering
// ==========================================================================
function getFilteredAndSortedProducts() {
  let list = [...appState.products];

  // Category filter
  if (appState.activeCategory !== "all") {
    list = list.filter(p => p.category.toLowerCase() === appState.activeCategory.toLowerCase());
  }

  // Search filter
  if (appState.searchQuery) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(appState.searchQuery) ||
      p.description.toLowerCase().includes(appState.searchQuery) ||
      p.category.toLowerCase().includes(appState.searchQuery)
    );
  }

  // Price range filter
  list = list.filter(p => p.price <= appState.maxPrice);

  // Sorting
  switch (appState.sortBy) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "name-asc":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "featured":
    default:
      list.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
      break;
  }

  return list;
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  const countDisplay = document.getElementById("results-count");
  if (!grid) return;

  const products = getFilteredAndSortedProducts();

  if (countDisplay) {
    countDisplay.innerHTML = `Showing <strong>${products.length}</strong> of <strong>${appState.products.length}</strong> products`;
  }

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <h3>No matching products found</h3>
        <p>Try adjusting your search criteria, category filters, or price slider.</p>
        <button class="btn-primary" style="margin-top: 16px;" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(product => {
    const isWishlisted = appState.wishlist.includes(product.id);
    const discountPercent = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />

          <div class="card-badges">
            ${product.isTrending ? '<span class="badge-tag badge-trending">Trending</span>' : ''}
            ${product.isNew ? '<span class="badge-tag badge-new">New</span>' : ''}
            ${discountPercent > 0 ? `<span class="badge-tag badge-discount">-${discountPercent}%</span>` : ''}
          </div>

          <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" aria-label="Toggle Wishlist" onclick="toggleWishlist(${product.id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>

          <button class="btn-quick-view" onclick="openQuickView(${product.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Quick View
          </button>
        </div>

        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-title" title="${product.name}">${product.name}</h3>

          <div class="product-rating">
            <span class="stars">${renderStarRating(product.rating)}</span>
            <span class="rating-text">(${product.reviewsCount})</span>
          </div>

          <div class="product-price-row">
            <span class="current-price">$${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
            <span class="stock-indicator ${product.stock <= 5 ? 'low' : ''}">
              ${product.stock <= 5 ? `Only ${product.stock} left!` : 'In Stock'}
            </span>
          </div>

          <button class="btn-add-cart" id="btn-add-cart-${product.id}" onclick="addToCart(${product.id}, 1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Add to Cart
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function renderStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let str = "★".repeat(fullStars);
  if (hasHalf) str += "★";
  while (str.length < 5) str += "☆";
  return str;
}

function resetFilters() {
  appState.activeCategory = "all";
  appState.searchQuery = "";
  appState.maxPrice = 250;
  appState.sortBy = "featured";

  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";

  const priceSlider = document.getElementById("price-slider");
  if (priceSlider) priceSlider.value = 250;

  const priceDisplay = document.getElementById("price-value-display");
  if (priceDisplay) priceDisplay.textContent = "$250";

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) sortSelect.value = "featured";

  renderCategories();
  renderProducts();
  showToast("All filters have been reset", "info");
}

// ==========================================================================
// Shopping Cart Operations
// ==========================================================================
function addToCart(productId, quantity = 1) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  const existingItemIndex = appState.cart.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    const currentQty = appState.cart[existingItemIndex].quantity;
    if (currentQty + quantity > product.stock) {
      showToast(`Cannot add more than ${product.stock} items (stock limit reached)`, "error");
      return;
    }
    appState.cart[existingItemIndex].quantity += quantity;
  } else {
    if (quantity > product.stock) {
      showToast(`Only ${product.stock} available in stock`, "error");
      return;
    }
    appState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: quantity
    });
  }

  saveCart();
  updateCartBadge(true);
  renderCart();

  // Button feedback animation
  const btn = document.getElementById(`btn-add-cart-${productId}`);
  if (btn) {
    btn.classList.add("added");
    btn.innerHTML = `✓ Added!`;
    setTimeout(() => {
      btn.classList.remove("added");
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg> Add to Cart
      `;
    }, 1200);
  }

  showToast(`Added "${product.name}" to cart`, "success");
}

function updateCartQuantity(productId, newQty) {
  const index = appState.cart.findIndex(i => i.id === productId);
  if (index === -1) return;

  const item = appState.cart[index];
  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  if (newQty > item.stock) {
    showToast(`Maximum available stock is ${item.stock}`, "error");
    return;
  }

  item.quantity = newQty;
  saveCart();
  updateCartBadge();
  renderCart();
}

function removeFromCart(productId) {
  const item = appState.cart.find(i => i.id === productId);
  appState.cart = appState.cart.filter(i => i.id !== productId);
  saveCart();
  updateCartBadge();
  renderCart();
  if (item) {
    showToast(`Removed "${item.name}" from cart`, "info");
  }
}

function saveCart() {
  localStorage.setItem("auspify_cart", JSON.stringify(appState.cart));
}

function updateCartBadge(bounce = false) {
  const badge = document.getElementById("cart-count-badge");
  if (!badge) return;

  const totalCount = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalCount;

  if (bounce) {
    badge.classList.add("bounce");
    setTimeout(() => badge.classList.remove("bounce"), 300);
  }
}

function calculateCartTotals() {
  const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Shipping: free over $75 or with coupon
  let shippingCost = subtotal >= 75 || subtotal === 0 ? 0 : 9.99;
  if (appState.appliedCoupon && appState.appliedCoupon.type === "shipping") {
    shippingCost = 0;
  }

  // Discounts
  let discountAmount = 0;
  if (appState.appliedCoupon) {
    if (appState.appliedCoupon.type === "percent") {
      discountAmount = (subtotal * appState.appliedCoupon.value) / 100;
    } else if (appState.appliedCoupon.type === "flat") {
      discountAmount = Math.min(subtotal, appState.appliedCoupon.value);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.08; // 8% tax
  const total = taxableAmount + shippingCost + tax;

  return {
    subtotal,
    shippingCost,
    tax,
    discountAmount,
    total
  };
}

function renderCart() {
  const itemsContainer = document.getElementById("cart-items-container");
  const emptyMessage = document.getElementById("empty-cart-message");
  const cartSummarySection = document.getElementById("cart-summary-section");
  if (!itemsContainer) return;

  if (appState.cart.length === 0) {
    itemsContainer.innerHTML = "";
    if (emptyMessage) emptyMessage.style.display = "block";
    if (cartSummarySection) cartSummarySection.style.display = "none";
    return;
  }

  if (emptyMessage) emptyMessage.style.display = "none";
  if (cartSummarySection) cartSummarySection.style.display = "block";

  itemsContainer.innerHTML = appState.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-details">
        <h4 class="cart-item-name" title="${item.name}">${item.name}</h4>
        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)} ($${item.price.toFixed(2)} each)</div>
        <div class="cart-item-stepper">
          <button class="stepper-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">−</button>
          <span class="stepper-qty">${item.quantity}</span>
          <button class="stepper-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
      </div>
      <button class="btn-remove-item" aria-label="Remove item" onclick="removeFromCart(${item.id})">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  `).join("");

  // Update summary breakdown
  const { subtotal, shippingCost, tax, discountAmount, total } = calculateCartTotals();

  const subtotalEl = document.getElementById("cart-subtotal-val");
  const shippingEl = document.getElementById("cart-shipping-val");
  const taxEl = document.getElementById("cart-tax-val");
  const discountRow = document.getElementById("cart-discount-row");
  const discountEl = document.getElementById("cart-discount-val");
  const totalEl = document.getElementById("cart-total-val");

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;

  if (discountRow && discountEl) {
    if (discountAmount > 0) {
      discountRow.style.display = "flex";
      discountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
      discountRow.style.display = "none";
    }
  }

  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  // Applied coupon badge display
  const couponPill = document.getElementById("applied-coupon-pill");
  if (couponPill) {
    if (appState.appliedCoupon) {
      couponPill.style.display = "flex";
      couponPill.innerHTML = `
        <span>Code <strong>${appState.appliedCoupon.code}</strong> applied (${appState.appliedCoupon.description})</span>
        <button onclick="removeCoupon()">✕ Remove</button>
      `;
    } else {
      couponPill.style.display = "none";
    }
  }
}

function applyCoupon(code) {
  if (!code) {
    showToast("Please enter a promo code", "error");
    return;
  }

  if (validCoupons[code]) {
    appState.appliedCoupon = { code, ...validCoupons[code] };
    const couponInput = document.getElementById("coupon-input");
    if (couponInput) couponInput.value = "";
    renderCart();
    showToast(`Coupon "${code}" successfully applied!`, "success");
  } else {
    showToast(`Invalid coupon code "${code}". Try "AUSPIFY20"`, "error");
  }
}

function removeCoupon() {
  appState.appliedCoupon = null;
  renderCart();
  showToast("Coupon removed", "info");
}

function openCart() {
  renderCart();
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (drawer && overlay) {
    drawer.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeCart() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (drawer && overlay) {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// ==========================================================================
// Wishlist Management
// ==========================================================================
function toggleWishlist(productId) {
  const index = appState.wishlist.indexOf(productId);
  const product = appState.products.find(p => p.id === productId);

  if (index > -1) {
    appState.wishlist.splice(index, 1);
    showToast(`Removed "${product ? product.name : 'item'}" from wishlist`, "info");
  } else {
    appState.wishlist.push(productId);
    showToast(`Saved "${product ? product.name : 'item'}" to wishlist`, "success");
  }

  saveWishlist();
  updateWishlistBadge();
  renderProducts();

  // If wishlist modal is open, re-render it
  const overlay = document.getElementById("wishlist-modal-overlay");
  if (overlay && overlay.classList.contains("active")) {
    renderWishlist();
  }
}

function saveWishlist() {
  localStorage.setItem("auspify_wishlist", JSON.stringify(appState.wishlist));
}

function updateWishlistBadge() {
  const badge = document.getElementById("wishlist-count-badge");
  if (badge) {
    badge.textContent = appState.wishlist.length;
  }
}

function openWishlist() {
  renderWishlist();
  const overlay = document.getElementById("wishlist-modal-overlay");
  if (overlay) {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeWishlist() {
  const overlay = document.getElementById("wishlist-modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function renderWishlist() {
  const container = document.getElementById("wishlist-items-container");
  if (!container) return;

  if (appState.wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 40px 10px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <h3>Your wishlist is empty</h3>
        <p>Click the heart icon on any product to save it here for later.</p>
      </div>
    `;
    return;
  }

  const items = appState.products.filter(p => appState.wishlist.includes(p.id));

  container.innerHTML = items.map(p => `
    <div class="wishlist-card">
      <img src="${p.image}" alt="${p.name}" class="wishlist-img" />
      <h4 style="font-size: 0.95rem; font-weight: 700; margin-top: 4px;">${p.name}</h4>
      <div style="font-weight: 800; color: var(--primary);">$${p.price.toFixed(2)}</div>
      <div style="display: flex; gap: 8px; margin-top: auto;">
        <button class="btn-primary" style="flex: 1; padding: 8px; font-size: 0.82rem;" onclick="addToCart(${p.id}, 1); toggleWishlist(${p.id});">
          Move to Cart
        </button>
        <button class="btn-secondary" style="padding: 8px 12px; color: var(--danger); font-size: 0.82rem;" onclick="toggleWishlist(${p.id})">
          Remove
        </button>
      </div>
    </div>
  `).join("");
}

// ==========================================================================
// Quick View Modal
// ==========================================================================
function openQuickView(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  appState.currentQuickViewProduct = product;
  const overlay = document.getElementById("quick-view-modal-overlay");
  const modalBody = document.getElementById("quick-view-content");
  if (!overlay || !modalBody) return;

  const isWishlisted = appState.wishlist.includes(product.id);

  modalBody.innerHTML = `
    <div class="quick-view-container">
      <div>
        <img src="${product.image}" alt="${product.name}" class="quick-view-image" />
      </div>
      <div class="quick-view-info">
        <span class="product-category">${product.category}</span>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px;">${product.name}</h2>

        <div class="product-rating" style="margin-bottom: 12px;">
          <span class="stars">${renderStarRating(product.rating)}</span>
          <span class="rating-text">${product.rating} (${product.reviewsCount} customer reviews)</span>
        </div>

        <div class="product-price-row" style="margin-bottom: 14px;">
          <span class="current-price" style="font-size: 1.6rem;">$${product.price.toFixed(2)}</span>
          ${product.originalPrice ? `<span class="original-price" style="font-size: 1.1rem;">$${product.originalPrice.toFixed(2)}</span>` : ''}
          <span class="stock-indicator" style="margin-left: 12px;">In Stock (${product.stock} units)</span>
        </div>

        <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px;">
          ${product.description}
        </p>

        <h4 style="font-size: 0.88rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Key Highlights</h4>
        <ul class="quick-view-features">
          ${product.features.map(f => `<li>${f}</li>`).join("")}
        </ul>

        <div class="quick-view-actions">
          <div class="cart-item-stepper" style="background: var(--bg-subtle); padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <button class="stepper-btn" onclick="adjustQuickViewQty(-1)">−</button>
            <span id="quick-view-qty" class="stepper-qty">1</span>
            <button class="stepper-btn" onclick="adjustQuickViewQty(1)">+</button>
          </div>

          <button class="btn-primary" style="flex: 1;" onclick="addQuickViewToCart()">
            Add to Cart
          </button>

          <button class="icon-btn ${isWishlisted ? 'active' : ''}" style="color: ${isWishlisted ? 'var(--danger)' : 'inherit'};" onclick="toggleWishlist(${product.id}); openQuickView(${product.id});">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

let quickViewSelectedQty = 1;

function adjustQuickViewQty(delta) {
  const product = appState.currentQuickViewProduct;
  if (!product) return;

  const nextQty = quickViewSelectedQty + delta;
  if (nextQty >= 1 && nextQty <= product.stock) {
    quickViewSelectedQty = nextQty;
    const qtyEl = document.getElementById("quick-view-qty");
    if (qtyEl) qtyEl.textContent = quickViewSelectedQty;
  }
}

function addQuickViewToCart() {
  if (!appState.currentQuickViewProduct) return;
  addToCart(appState.currentQuickViewProduct.id, quickViewSelectedQty);
  closeQuickView();
  openCart();
}

function closeQuickView() {
  const overlay = document.getElementById("quick-view-modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    quickViewSelectedQty = 1;
    appState.currentQuickViewProduct = null;
  }
}

// ==========================================================================
// Multi-Step Checkout Workflow
// ==========================================================================
function startCheckout() {
  if (appState.cart.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }

  closeCart();
  appState.checkoutStep = 1;
  updateCheckoutStepUI();

  const overlay = document.getElementById("checkout-modal-overlay");
  if (overlay) {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeCheckout() {
  const overlay = document.getElementById("checkout-modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function updateCheckoutStepUI() {
  // Update step indicators
  const stepIndicators = document.querySelectorAll(".step-indicator");
  stepIndicators.forEach((el, index) => {
    const stepNum = index + 1;
    el.classList.remove("active", "completed");
    if (stepNum === appState.checkoutStep) {
      el.classList.add("active");
    } else if (stepNum < appState.checkoutStep) {
      el.classList.add("completed");
    }
  });

  // Toggle step panes
  document.getElementById("checkout-step-1").style.display = appState.checkoutStep === 1 ? "block" : "none";
  document.getElementById("checkout-step-2").style.display = appState.checkoutStep === 2 ? "block" : "none";
  document.getElementById("checkout-step-3").style.display = appState.checkoutStep === 3 ? "block" : "none";

  // Navigation buttons
  const prevBtn = document.getElementById("checkout-prev-btn");
  const nextBtn = document.getElementById("checkout-next-btn");
  const placeOrderBtn = document.getElementById("place-order-btn");

  if (prevBtn) prevBtn.style.display = appState.checkoutStep > 1 ? "block" : "none";
  if (nextBtn) nextBtn.style.display = appState.checkoutStep < 3 ? "block" : "none";
  if (placeOrderBtn) placeOrderBtn.style.display = appState.checkoutStep === 3 ? "block" : "none";

  if (appState.checkoutStep === 3) {
    renderCheckoutReview();
  }
}

function validateShippingForm() {
  const fullName = document.getElementById("ship-fullname").value.trim();
  const email = document.getElementById("ship-email").value.trim();
  const phone = document.getElementById("ship-phone").value.trim();
  const address = document.getElementById("ship-address").value.trim();
  const city = document.getElementById("ship-city").value.trim();
  const zip = document.getElementById("ship-zip").value.trim();

  if (!fullName || !email || !phone || !address || !city || !zip) {
    showToast("Please fill in all shipping fields", "error");
    return false;
  }

  // Basic email pattern check
  if (!email.includes("@") || !email.includes(".")) {
    showToast("Please provide a valid email address", "error");
    return false;
  }

  appState.checkoutFormData.shipping = {
    fullName,
    email,
    phone,
    address,
    city,
    zip
  };

  return true;
}

function togglePaymentDetailsFields(method) {
  const cardDetails = document.getElementById("card-details-box");
  const upiDetails = document.getElementById("upi-details-box");
  const codDetails = document.getElementById("cod-details-box");

  if (cardDetails) cardDetails.style.display = method === "card" ? "block" : "none";
  if (upiDetails) upiDetails.style.display = method === "upi" ? "block" : "none";
  if (codDetails) codDetails.style.display = method === "cod" ? "block" : "none";
}

function handleCheckoutNext() {
  if (appState.checkoutStep === 1) {
    if (!validateShippingForm()) return;
    appState.checkoutStep = 2;
    updateCheckoutStepUI();
  } else if (appState.checkoutStep === 2) {
    // Validate payment inputs
    if (appState.checkoutFormData.paymentMethod === "card") {
      const cardNum = document.getElementById("card-number")?.value.trim();
      const cardExp = document.getElementById("card-exp")?.value.trim();
      const cardCvv = document.getElementById("card-cvv")?.value.trim();

      if (!cardNum || !cardExp || !cardCvv) {
        showToast("Please enter credit card information", "error");
        return;
      }
    } else if (appState.checkoutFormData.paymentMethod === "upi") {
      const upiId = document.getElementById("upi-id-input")?.value.trim();
      if (!upiId || !upiId.includes("@")) {
        showToast("Please enter a valid UPI ID (e.g., name@okaxis)", "error");
        return;
      }
    }

    appState.checkoutStep = 3;
    updateCheckoutStepUI();
  }
}

function handleCheckoutPrev() {
  if (appState.checkoutStep > 1) {
    appState.checkoutStep--;
    updateCheckoutStepUI();
  }
}

function renderCheckoutReview() {
  const reviewContainer = document.getElementById("checkout-review-content");
  if (!reviewContainer) return;

  const { shipping, paymentMethod } = appState.checkoutFormData;
  const { subtotal, shippingCost, tax, discountAmount, total } = calculateCartTotals();

  let paymentLabel = "Credit/Debit Card";
  if (paymentMethod === "upi") paymentLabel = "UPI / QR Payment";
  if (paymentMethod === "cod") paymentLabel = "Cash on Delivery";
  if (paymentMethod === "paypal") paymentLabel = "PayPal";

  reviewContainer.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
      <div>
        <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Shipping To:</h4>
        <p style="font-weight: 600; margin-top: 4px;">${shipping.fullName}</p>
        <p style="font-size: 0.88rem; color: var(--text-secondary);">${shipping.address}, ${shipping.city} ${shipping.zip}</p>
        <p style="font-size: 0.88rem; color: var(--text-secondary);">${shipping.email} | ${shipping.phone}</p>
      </div>

      <div>
        <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Payment Method:</h4>
        <p style="font-weight: 600; margin-top: 4px;">${paymentLabel}</p>
        <p style="font-size: 0.88rem; color: var(--success); font-weight: 500;">✓ Encrypted & Verified</p>
      </div>
    </div>

    <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Order Items (${appState.cart.length}):</h4>
    <div style="max-height: 140px; overflow-y: auto; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
      ${appState.cart.map(item => `
        <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
          <span>${item.name} × ${item.quantity}</span>
          <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
      `).join("")}
    </div>

    <div style="border-top: 1px dashed var(--border-color); padding-top: 10px; display: flex; flex-direction: column; gap: 6px; font-size: 0.88rem;">
      <div style="display: flex; justify-content: space-between;">
        <span>Subtotal:</span> <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Shipping:</span> <span>${shippingCost === 0 ? 'FREE' : '$' + shippingCost.toFixed(2)}</span>
      </div>
      ${discountAmount > 0 ? `
      <div style="display: flex; justify-content: space-between; color: var(--success);">
        <span>Discount:</span> <span>-$${discountAmount.toFixed(2)}</span>
      </div>` : ''}
      <div style="display: flex; justify-content: space-between;">
        <span>Estimated Tax:</span> <span>$${tax.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; border-top: 1px solid var(--border-color); padding-top: 8px; margin-top: 4px;">
        <span>Total Payable:</span> <span style="color: var(--primary);">$${total.toFixed(2)}</span>
      </div>
    </div>
  `;
}

function handlePlaceOrder() {
  const { subtotal, shippingCost, tax, discountAmount, total } = calculateCartTotals();
  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

  const newOrder = {
    id: orderId,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }),
    status: "Confirmed",
    items: [...appState.cart],
    shippingAddress: { ...appState.checkoutFormData.shipping },
    paymentMethod: appState.checkoutFormData.paymentMethod.toUpperCase(),
    subtotal,
    shippingCost,
    tax,
    discount: discountAmount,
    total,
    estimatedDelivery: new Date(Date.now() + 86400000 * 4).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    })
  };

  // Prepend new order to orders list
  appState.orders.unshift(newOrder);
  localStorage.setItem("auspify_orders", JSON.stringify(appState.orders));

  // Reset cart
  appState.cart = [];
  appState.appliedCoupon = null;
  saveCart();
  updateCartBadge();
  renderCart();

  // Close checkout modal and show Order Confirmation modal
  closeCheckout();
  showOrderConfirmation(newOrder);
}

// ==========================================================================
// Order Confirmation Screen
// ==========================================================================
function showOrderConfirmation(order) {
  appState.lastCompletedOrder = order;
  const overlay = document.getElementById("confirmation-modal-overlay");
  const content = document.getElementById("confirmation-modal-content");
  if (!overlay || !content) return;

  content.innerHTML = `
    <div class="order-success-container" id="order-receipt-content">
      <div class="success-icon-badge">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 6px;">Thank You For Your Order!</h2>
      <p style="color: var(--text-secondary); font-size: 0.95rem;">
        Your order has been placed and is being prepared for shipment.
      </p>

      <div class="order-id-highlight">
        Order ID: ${order.id}
      </div>

      <div style="background: var(--bg-subtle); padding: 16px; border-radius: var(--radius-md); text-align: left; margin: 16px 0; font-size: 0.88rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Estimated Delivery:</span>
          <strong>${order.estimatedDelivery}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Shipping To:</span>
          <span>${order.shippingAddress.fullName}, ${order.shippingAddress.city}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Payment Method:</span>
          <span>${order.paymentMethod}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 8px; font-weight: 800; font-size: 1rem;">
          <span>Total Paid:</span>
          <span style="color: var(--primary);">$${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px;">
        <button class="btn-primary" id="view-order-history-btn" onclick="closeConfirmationModal(); openOrders();">
          Track in Order History
        </button>
        <button class="btn-secondary" id="print-receipt-btn" onclick="window.print();">
          🖨️ Print Receipt
        </button>
      </div>
    </div>
  `;

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
  showToast("Order placed successfully!", "success");
}

function closeConfirmationModal() {
  const overlay = document.getElementById("confirmation-modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// ==========================================================================
// Order Management Dashboard
// ==========================================================================
function openOrders() {
  renderOrders();
  const overlay = document.getElementById("orders-modal-overlay");
  if (overlay) {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeOrders() {
  const overlay = document.getElementById("orders-modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function renderOrders() {
  const container = document.getElementById("orders-list-container");
  if (!container) return;

  if (appState.orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <h3>No orders placed yet</h3>
        <p>When you complete a purchase, your orders and tracking information will appear here.</p>
        <button class="btn-primary" style="margin-top: 16px;" onclick="closeOrders();">Start Shopping</button>
      </div>
    `;
    return;
  }

  container.innerHTML = appState.orders.map(order => {
    let statusClass = "status-confirmed";
    if (order.status === "Shipped") statusClass = "status-shipped";
    if (order.status === "Delivered") statusClass = "status-delivered";
    if (order.status === "Cancelled") statusClass = "status-cancelled";

    return `
      <article class="order-card">
        <header class="order-card-header">
          <div>
            <span style="font-weight: 700; font-size: 0.95rem;">${order.id}</span>
            <span style="font-size: 0.82rem; color: var(--text-muted); margin-left: 10px;">${order.date}</span>
          </div>
          <span class="order-badge-status ${statusClass}">${order.status}</span>
        </header>

        <div class="order-card-body">
          ${renderOrderTimeline(order.status)}

          <div class="order-items-preview">
            ${order.items.map(item => `
              <div class="order-item-row">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;" />
                  <div>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">Qty: ${item.quantity} × $${item.price.toFixed(2)}</div>
                  </div>
                </div>
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            `).join("")}
          </div>
        </div>

        <footer class="order-card-footer">
          <div>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Total Amount:</span>
            <strong style="font-size: 1.05rem; color: var(--text-primary); margin-left: 6px;">$${order.total.toFixed(2)}</strong>
          </div>

          <div style="display: flex; gap: 8px;">
            ${order.status !== 'Cancelled' && order.status !== 'Delivered' ? `
              <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem; color: var(--danger);" onclick="cancelOrder('${order.id}')">
                Cancel Order
              </button>
            ` : ''}

            <button class="btn-primary" style="padding: 6px 14px; font-size: 0.8rem;" onclick="reorderItems('${order.id}')">
              Buy Again
            </button>
          </div>
        </footer>
      </article>
    `;
  }).join("");
}

function renderOrderTimeline(status) {
  const steps = ["Placed", "Confirmed", "Shipped", "Delivered"];
  const currentStepIndex = steps.indexOf(status);

  if (status === "Cancelled") {
    return `
      <div style="background: var(--danger-light); color: var(--danger); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600;">
        ✕ This order was cancelled.
      </div>
    `;
  }

  return `
    <div class="order-timeline">
      ${steps.map((step, idx) => {
        let stateClass = "";
        if (currentStepIndex >= idx) stateClass = "done";
        if (currentStepIndex === idx) stateClass = "current";

        return `
          <div class="timeline-step ${stateClass}">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${currentStepIndex >= idx ? 'var(--primary)' : 'var(--border-color)'}; margin-bottom: 4px;"></div>
            <span>${step}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function cancelOrder(orderId) {
  const order = appState.orders.find(o => o.id === orderId);
  if (!order) return;

  if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
    order.status = "Cancelled";
    localStorage.setItem("auspify_orders", JSON.stringify(appState.orders));
    renderOrders();
    showToast(`Order ${orderId} has been cancelled`, "info");
  }
}

function reorderItems(orderId) {
  const order = appState.orders.find(o => o.id === orderId);
  if (!order) return;

  order.items.forEach(item => {
    addToCart(item.id, item.quantity);
  });

  closeOrders();
  openCart();
  showToast(`Items from order ${orderId} added to your cart`, "success");
}

// ==========================================================================
// Toast Notification Engine
// ==========================================================================
function showToast(message, type = "info", duration = 3000) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let icon = `ℹ️`;
  if (type === "success") icon = `✓`;
  if (type === "error") icon = `⚠️`;

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, duration);
}

// ==========================================================================
// SVG Icons
// ==========================================================================
function getSunIcon() {
  return `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `;
}

function getMoonIcon() {
  return `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  `;
}
