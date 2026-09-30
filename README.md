# 🛒 Auspify E-Commerce Website

> **Task 5 (Advanced) – E-Commerce Website**  
> **AUSPIFY – Bring Future Through Tech**

A modern, responsive, high-performance E-Commerce web application developed with pure HTML5, CSS3, and Advanced JavaScript. It features an interactive product catalog, live search and multi-facet filtering, a slide-over shopping cart with persistent `localStorage`, a multi-step checkout wizard, and a complete order management & tracking system.

---

## 🚀 Key Features & Task Workflow Mapping

### 1. Step 1: Design Product and Cart Pages
- **Modern Responsive Design**: Fluid layouts optimized across mobile phones, tablets, and wide-screen desktop displays using CSS Grid and Flexbox.
- **Dark & Light Mode Support**: Instant theme toggling with smooth transitions and persistent memory via `localStorage`.
- **Auspify Theme Aesthetics**: Professional color palette with gradient accents, clean cards, subtle elevation shadows, and accessible focus states.
- **Slide-Over Shopping Cart Drawer**: Quick-access side drawer featuring cart count badges with animated bounce feedback.

### 2. Step 2: Product Listing Functionality
- **Rich Product Catalog**: Realistic catalog across Electronics, Fashion & Apparel, Home & Living, and Accessories with high-resolution imagery and detailed specifications.
- **Dynamic Category Filtering**: Interactive category pills for quick browsing (All, Electronics, Fashion, Home, Accessories).
- **Live Search with Debounce**: Instant keyword filtering across titles, descriptions, and categories.
- **Price Range Filtering**: Dynamic slider allowing real-time price bracket adjustments.
- **Sorting Options**: Sort by Featured / Trending, Price: Low to High, Price: High to Low, Highest Rated, and Alphabetical (A–Z).
- **Quick View Modal**: Inspect comprehensive specifications, stock availability, full descriptions, and add customized quantities without leaving the current page.

### 3. Step 3: Shopping Cart Features
- **Persistent Storage**: Cart items, quantities, and coupons persist across browser restarts and page refreshes via the browser's `localStorage` API.
- **Cart Management**: Real-time quantity steppers (`+` / `−`), individual item removal, and stock limit boundary checks.
- **Automatic Price Calculations**: Real-time subtotal, free shipping threshold (orders over $75), estimated tax (8%), and grand total calculations.
- **Promotional Coupon Engine**:
  - `AUSPIFY20`: 20% discount on entire order
  - `SAVE10`: $10 flat discount
  - `FREESHIP`: Free standard shipping

### 4. Step 4: Manage Orders & Checkout Process
- **Multi-Step Checkout Wizard**:
  - **Step 1 – Shipping Information**: Full Name, Email, Phone, Street Address, City, and Postal Code with live validation.
  - **Step 2 – Payment Method**: Credit/Debit Card (with card details form), UPI / QR Code simulation, Cash on Delivery, and PayPal.
  - **Step 3 – Order Review**: Review order breakdown, shipping address, and payment method before placing.
- **Order Placement**: Automatically generates unique Order IDs (e.g. `ORD-849201`), computes estimated delivery dates, and persists orders to `localStorage`.
- **Order Confirmation & Receipt**: Interactive confirmation modal with printable receipt/invoice format (`Ctrl + P` / Print button).

### 5. Step 5: Order Management Dashboard
- **"My Orders" Modal**: Complete history of past placed orders.
- **Order Status Tracking**: Visual progress bar tracking order states: `Placed` → `Confirmed` → `Shipped` → `Delivered`.
- **Order Actions**:
  - **Buy Again / Re-order**: Instant 1-click re-addition of order items to cart.
  - **Cancel Order**: Cancel active/unshipped orders with status updates.

### 6. User Experience & Accessibility Optimizations
- **Interactive Toast Notifications**: Context-aware alerts for cart modifications, coupon validations, and wishlist actions.
- **Wishlist Management**: Save items for later with dedicated wishlist drawer and 1-click "Move to Cart".
- **Keyboard Navigation & Traps**: Dismiss any modal or slide-over drawer using the `Escape` key.
- **Zero External Dependencies**: Pure vanilla code that runs instantly in any modern web browser without build tools or npm installation required.

---

## 🛠️ Skills Demonstrated

- **Advanced JavaScript**: ES6+ modules, state management, event delegation, input debouncing, dynamic DOM creation, and financial calculations.
- **Local Storage API**: Persistent state synchronization across sessions for cart items, wishlist, order history, and theme preferences.
- **E-Commerce Development**: Multi-step checkout flows, discount calculations, inventory constraints, and receipt generation.
- **User Experience Design**: Glassmorphism sticky headers, animated badges, mobile responsiveness, and intuitive navigation.

---

## 📂 Project Structure

```
ecommerce-website/
├── index.html       # Semantic HTML5 markup, modals, and templates
├── style.css        # CSS variables, responsive grid, animations, and dark/light themes
├── products.js      # Comprehensive product catalog data & valid coupon configurations
├── app.js           # Core state management, cart logic, checkout, and order management
└── README.md        # Complete documentation and setup guide
```

---

## 🖥️ How to Run

### Method 1: Direct File Opening
Double-click `index.html` or right-click and choose **Open with > Chrome / Edge / Firefox**.

### Method 2: Local HTTP Server (Node.js)
```bash
# Using npx serve
npx serve -s . -l 3000

# Or using Python 3
python -m http.server 3000
```
Open `http://localhost:3000` in your web browser.

---

## 🏷️ Test Coupons

| Coupon Code | Discount |
| :--- | :--- |
| `AUSPIFY20` | **20% OFF** entire purchase |
| `SAVE10` | **$10.00 OFF** order subtotal |
| `FREESHIP` | **Free Shipping** |
