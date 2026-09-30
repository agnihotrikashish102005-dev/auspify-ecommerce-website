/**
 * Auspify E-Commerce Store - Product Catalog Data
 * Comprehensive collection of products across various categories
 */

const productsData = [
  {
    id: 1,
    name: "Aura Pro Wireless ANC Headphones",
    category: "electronics",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewsCount: 342,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    description: "Premium wireless noise-cancelling over-ear headphones with 40-hour battery life, high-resolution audio drivers, and ultra-plush memory foam earcups.",
    features: [
      "Active Noise Cancellation (ANC)",
      "40-Hour Battery Life with Fast Charge",
      "Bluetooth 5.3 & Multipoint Connection",
      "Built-in Studio Grade Microphones"
    ],
    stock: 15,
    isTrending: true,
    isNew: false
  },
  {
    id: 2,
    name: "Vertex Mechanical Gaming Keyboard",
    category: "electronics",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.7,
    reviewsCount: 215,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    description: "Compact 75% hot-swappable mechanical keyboard featuring RGB backlighting, custom pre-lubed switches, and double-shot PBT keycaps.",
    features: [
      "Custom Pre-lubed Linear Switches",
      "Per-key RGB with 18 dynamic effects",
      "Hot-Swappable 5-pin PCB",
      "Aircraft-Grade Aluminum Frame"
    ],
    stock: 8,
    isTrending: true,
    isNew: true
  },
  {
    id: 3,
    name: "PulseFit Ultra Smartwatch",
    category: "electronics",
    price: 179.99,
    originalPrice: 219.99,
    rating: 4.6,
    reviewsCount: 189,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    description: "Next-gen fitness tracker and smartwatch with AMOLED always-on display, ECG sensor, GPS tracking, and 7-day battery life.",
    features: [
      "1.43-inch HD AMOLED Display",
      "Real-time Heart Rate & SpO2 Monitoring",
      "Dual-Band Multi-Satellite GPS",
      "5ATM Water Resistance (50m)"
    ],
    stock: 22,
    isTrending: false,
    isNew: true
  },
  {
    id: 4,
    name: "Minimalist Urban Leather Backpack",
    category: "fashion",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.9,
    reviewsCount: 420,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    description: "Water-resistant vegan leather backpack with a dedicated padded 16-inch laptop compartment, hidden anti-theft pockets, and ergonomic shoulder straps.",
    features: [
      "Padded 16\" Laptop Sleeve",
      "Weatherproof Vegan Leather",
      "Integrated USB Charging Port",
      "Hidden Passport & Card Security Pocket"
    ],
    stock: 12,
    isTrending: true,
    isNew: false
  },
  {
    id: 5,
    name: "Classic Organic Cotton Hoodie",
    category: "fashion",
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.5,
    reviewsCount: 154,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    description: "Super-soft heavyweight 450 GSM organic French terry cotton pullover hoodie with relaxed streetwear fit and ribbed trims.",
    features: [
      "100% GOTS Certified Organic Cotton",
      "Heavyweight 450 GSM French Terry",
      "Double-lined Thermal Hood",
      "Pre-shrunk Fabric for Long-lasting Fit"
    ],
    stock: 30,
    isTrending: false,
    isNew: false
  },
  {
    id: 6,
    name: "Retro Polarized Aviator Sunglasses",
    category: "fashion",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.6,
    reviewsCount: 98,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    description: "Timeless handcrafted aviator sunglasses with UV400 polarized gradient lenses and lightweight stainless steel frame.",
    features: [
      "100% UV400 Eye Protection",
      "Scratch-Resistant Polarized Lenses",
      "Ultra-Light Stainless Steel Frame",
      "Includes Hard Travel Case & Microfiber Cloth"
    ],
    stock: 18,
    isTrending: false,
    isNew: true
  },
  {
    id: 7,
    name: "Lumina Smart LED Desk Lamp",
    category: "home",
    price: 64.99,
    originalPrice: 84.99,
    rating: 4.7,
    reviewsCount: 167,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    description: "Architect-style eye-care LED desk lamp with adjustable color temperature, wireless charging base, and touch slider dimming.",
    features: [
      "5 Color Modes & 6 Brightness Levels",
      "10W Built-in Qi Wireless Charging Pad",
      "Flicker-Free Eye Protection Technology",
      "Multi-angle Foldable Gooseneck Arm"
    ],
    stock: 14,
    isTrending: false,
    isNew: false
  },
  {
    id: 8,
    name: "Artisan Ceramic Pour-Over Kettle & Mug Set",
    category: "home",
    price: 74.99,
    originalPrice: 94.99,
    rating: 4.9,
    reviewsCount: 230,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    description: "Handmade matte ceramic coffee brewer with precision gooseneck spout, stainless steel mesh filter, and twin matching mugs.",
    features: [
      "Precision Gooseneck Spout for Steady Pour",
      "Lead-Free Non-Toxic Glazed Ceramic",
      "Reusable Dual-Layer Fine Mesh Filter",
      "Heat-Resistant Walnut Wood Handle"
    ],
    stock: 9,
    isTrending: true,
    isNew: false
  },
  {
    id: 9,
    name: "Ergonomic Memory Foam Lumbar Cushion",
    category: "home",
    price: 39.99,
    originalPrice: 54.99,
    rating: 4.6,
    reviewsCount: 188,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80",
    description: "Orthopedic therapeutic back support pillow with contoured memory foam and breathable 3D air-mesh washable cover.",
    features: [
      "100% High-Density Premium Memory Foam",
      "Targeted Spine & Lower Back Alignment",
      "Dual Adjustable Securing Straps",
      "Machine-Washable Breathable Cover"
    ],
    stock: 25,
    isTrending: false,
    isNew: false
  },
  {
    id: 10,
    name: "AeroGlide Fast Magnetic Wireless Charger",
    category: "accessories",
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.5,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1622445268047-97592a95c911?w=800&auto=format&fit=crop&q=80",
    description: "Sleek 15W MagSafe-compatible 3-in-1 fast wireless charging stand for your smartphone, smartwatch, and wireless earbuds.",
    features: [
      "Fast 15W Maximum Wireless Charging",
      "Strong N52 Neodymium Magnetic Lock",
      "Overcharge & Temperature Protection",
      "Includes 20W USB-C Power Adapter"
    ],
    stock: 20,
    isTrending: false,
    isNew: true
  },
  {
    id: 11,
    name: "Titanium EDC Pocket Knife & Multitool",
    category: "accessories",
    price: 54.99,
    originalPrice: 69.99,
    rating: 4.8,
    reviewsCount: 143,
    image: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=800&auto=format&fit=crop&q=80",
    description: "Rugged Grade-5 Titanium pocket multitool with D2 steel blade, bottle opener, hex wrenches, and glass breaker tip.",
    features: [
      "Grade 5 Titanium Alloy Casing",
      "Cryo-Treated D2 Tool Steel Blade",
      "7-in-1 Compact Utility Functions",
      "Deep-Carry Reversible Pocket Clip"
    ],
    stock: 11,
    isTrending: true,
    isNew: false
  },
  {
    id: 12,
    name: "Executive Leather Bound Notebook & Pen",
    category: "accessories",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.9,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    description: "Luxurious refillable full-grain leather journal with 240 numbered pages of 120gsm fountain-pen friendly paper and brass ballpoint pen.",
    features: [
      "Full-Grain Crazy Horse Distressed Leather",
      "120 GSM Acid-Free Bleed-Proof Paper",
      "Solid Brass Smooth-Flowing Rollerball Pen",
      "Ribbon Bookmark & Inner Expansion Pocket"
    ],
    stock: 35,
    isTrending: false,
    isNew: false
  }
];

// Coupon codes for discounts
const validCoupons = {
  "AUSPIFY20": { type: "percent", value: 20, description: "20% off entire order" },
  "SAVE10": { type: "flat", value: 10, description: "$10 off your purchase" },
  "FREESHIP": { type: "shipping", value: 0, description: "Free standard shipping" }
};
