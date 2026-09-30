# Agent Instructions: Static Website Project

## 1. Project Overview
- **Project Name:** Kape Point Cafe
- **Category:** Local Business
- **Description:** A community-focused specialty coffee shop offering single-origin Philippine coffee, handcrafted beverages, and fresh artisan pastries in a cozy, work-friendly space in Lucena City, complete with a customer ordering portal.
- **Primary Goal:** Drive customer visits, showcase signature menu offerings, provide clear operating hours and location, facilitate table reservations, and power direct customer online ordering once signed in.

## 2. Technical Stack & Constraints
- **Core Stack:** Plain HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Zero External Dependencies:** Do NOT use external build tools, package managers (npm/yarn), or third-party CSS/JS frameworks (no Tailwind CDN, Bootstrap, React, or jQuery).
- **Font & Icon Constraints:** Modern web-safe system font stacks or Google Fonts via `<link>` tag. Use inline SVGs or local SVG files in `assets/` for icons.
- **Paths:** All internal links, stylesheets, scripts, and asset references must use **relative paths** (e.g., `./assets/logo.svg`, `./style.css`, `./script.js`, `./order.html`) to ensure compatibility with GitHub Pages subdirectory hosting.

## 3. Directory Layout
```text
kape-point-cafe/
├── AGENTS.md
├── index.html
├── order.html
├── style.css
├── script.js
├── order.js
└── assets/
    ├── logo.svg
    ├── hero-coffee.svg
    ├── menu-espresso.svg
    ├── menu-latte.svg
    ├── menu-coldbrew.svg
    ├── menu-matcha.svg
    ├── menu-pastry.svg
    ├── menu-sandwich.svg
    ├── menu-americano.svg
    ├── menu-cookie.svg
    ├── feature-beans.svg
    ├── feature-barista.svg
    └── feature-space.svg
```

## 4. UI/UX & Design Guidelines
Color Palette:
- Primary: `#2C1810` (Deep Espresso Walnut)
- Secondary: `#F5EBE1` (Warm Cream Oat)
- Accent / CTA: `#B8671B` (Golden Honey Amber, `#D98236` in Dark Mode)
- Background: `#FAF7F2` (Linen Canvas, `#15100D` in Dark Mode)
- Text: `#1E140E` (Dark Coffee Neutral, `#F5EFEB` in Dark Mode)
- Surface Cards: `#FFFFFF` (Card base, `#201712` in Dark Mode)

Typography: Clean, accessible sans-serif system stack (`system-ui, -apple-system, sans-serif`) with elegant serif accents (`Georgia, serif`).
Font Weight Ceiling: All elements strictly compute to `font-weight <= 600` (semibold ceiling).
Touch Targets: Minimum `44px` on all buttons, links, inputs, and tab filters.
Layout Approach: Mobile-first design using CSS Flexbox and CSS Grid.
Responsiveness: Fluid breakpoints (Mobile: < 640px, Tablet: 640px - 1024px, Desktop: > 1024px).

## 5. Required Pages & Sections
### Page 1: Landing Page (`index.html`)
- Header: Brand logo, navigation links, theme switch, "Order Online" / "Reserve a Table" action, and mobile hamburger menu.
- Hero Section: Value proposition, coffee origin tags, primary CTA ("Explore Daily Menu" / "Order Online"), and artisanal visual.
- Core Content:
  - Our Story & Highland Heritage
  - The Craft & Sourcing Standards
  - Seasonal Brews & Artisan Bakes (filterable menu)
  - Community Notes & Verified Reviews
  - Operating Hours & Space Amenities (live status calculator)
- Contact Section: Field-validated static inquiry form & direct contact cards.
- Interactive Table Reservation Modal: Accessible dialog with focus trapping and ESC key dismiss.
- Footer: Copyright, navigation links, schedule, and social icons.

### Page 2: Online Ordering Portal (`order.html`)
- Sign-In Gate & User Profile Banner:
  - Unauthenticated view: Quick and secure sign-in modal/panel with demo credentials and guest checkout.
  - Authenticated view: Displays user greeting ("Welcome back, Juan!"), rewards points balance (e.g. 120 Kape Points), and Sign Out button.
- Live Product Catalog:
  - Category filters: All, Espresso & Brews, Cold Drinks, Artisan Pastries, Savory Toasties.
  - Search bar to filter items in real-time.
  - Customization options (milk selection, sweetness level, temperature, extra shot, custom barista notes).
- Live Interactive Cart & Checkout Drawer:
  - Real-time cart calculation with quantity adjustments (`+` / `-`).
  - Fulfillment options: Dine-In (Table delivery with table number), Counter Pickup, or Local Delivery.
  - Reusable Tumbler / Senior / PWD discount checkbox.
  - Order submission with animated progress and digital receipt breakdown with order number and preparation timer.

## 6. Agent Rules of Engagement
- Always generate complete, functional code blocks: avoid placeholders, ellipsis comments, or truncated snippets.
- Ensure semantic HTML tags are prioritized (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Keep CSS organized with clear section headers, CSS custom properties (`:root`), and smooth transitions.
- Keep JavaScript modular, event-driven, and scoped without polluting global namespace.
