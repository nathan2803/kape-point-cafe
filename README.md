# Kape Point Cafe & Roastery ☕

[![GitHub Pages Deployment](https://github.com/nathan2803/kape-point-cafe/actions/workflows/deploy.yml/badge.svg)](https://github.com/nathan2803/kape-point-cafe/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success?style=flat&logo=github)](https://nathan2803.github.io/kape-point-cafe/)
[![Design System](https://img.shields.io/badge/Design%20System-Material%20Design%203-blue)](https://m3.material.io/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Vanilla)-orange)](#tech-stack)

> **Artisan Specialty Coffee & Roastery in Lucena City, Philippines.**  
> Featuring single-origin highland harvests (Benguet Arabica, Batangas Liberica, Sagada Typica), small-batch roasting, oven-fresh butter pastries, and an online ordering portal.

---

## 🌐 Live Deployments

- **Live Cafe Website**: [https://nathan2803.github.io/kape-point-cafe/](https://nathan2803.github.io/kape-point-cafe/)
- **Online Ordering Portal**: [https://nathan2803.github.io/kape-point-cafe/order.html](https://nathan2803.github.io/kape-point-cafe/order.html)
- **Search Deep-Link Sample**: [https://nathan2803.github.io/kape-point-cafe/order.html?q=espresso](https://nathan2803.github.io/kape-point-cafe/order.html?q=espresso)
- **Robots & Sitemap**:
  - [sitemap.xml](https://nathan2803.github.io/kape-point-cafe/sitemap.xml)
  - [robots.txt](https://nathan2803.github.io/kape-point-cafe/robots.txt)
  - [favicon.svg](https://nathan2803.github.io/kape-point-cafe/favicon.svg)

---

## ✨ Features

### 1. Storefront & Story (`index.html`)
- **Single-Origin Harvests**: Highlighting direct partnerships with smallholder farmers across Benguet, Batangas, and Sagada.
- **Live In-Site Search**: Instant keyword filtering across all seasonal roasts, cold brews, and artisan bakes.
- **Category Tabs**: Filter items across *Espresso & Brews*, *Cold Drinks*, and *Bakes & Bites*.
- **Table Reservation Modal**: Accessible modal dialog with focus management and form validation.
- **Dynamic Operating Hours Indicator**: Real-time status badge calculating whether the cafe is open or closed based on Philippine Standard Time.
- **Dark Mode Engine**: Persistent theme toggle with `localStorage` memory and OS system-preference fallback (`prefers-color-scheme`).

### 2. Online Ordering Portal (`order.html`)
- **Material Design 3 (M3) Specification**:
  - M3 Top App Bar with back navigation and responsive logo.
  - M3 Search Bar with clear icon and deep-linking support (`?q=query`).
  - M3 Filter Chips with active checkmark states.
  - M3 Segmented Buttons, Steppers, and Outlined Text Fields.
- **Authentication & Kape Point Rewards**:
  - Guest vs. Authenticated state toggling with demo login.
  - Loyalty point tracking (10 points per ₱100 spent) and rewards banner.
- **Live Customization Engine**:
  - Temperature (Hot / Iced / Room Temp).
  - Milk selection (Whole / Oat / Almond).
  - Sweetness level (0% / 25% / 50% / 100%).
  - Extra shots & custom barista notes.
- **Cart & Order Summary**:
  - Real-time price recalculation with 12% VAT and service fee breakdown.
  - Live tray updates and printable confirmed order receipt modal.

### 3. Search Engine Optimization (SEO) & Discoverability
- **Schema.org JSON-LD**:
  - `WebSite` with Google Sitelinks `SearchAction` (`order.html?q={search_term_string}`).
  - `CafeOrCoffeeShop` (LocalBusiness schema with Lucena City address, phone, geo coordinates, and hours).
  - `Menu` and `MenuItem` microdata for all 8 signature drinks and bakes.
- **Open Graph & Twitter Cards**: High-res metadata cards for social media sharing.
- **Responsive SVG Favicon**: Adaptive color palette responding to OS light/dark modes.

---

## 🛠️ Tech Stack & Philosophy

- **Zero Framework / Zero Runtime Dependencies**: Pure semantic HTML5, modern CSS3 with custom properties, and Vanilla ES6+ JavaScript.
- **WCAG AA Accessibility**:
  - All interactive elements adhere to minimum touch target sizes ($\ge 44 \times 44\text{px}$).
  - Accessible focus states and ARIA roles (`role="dialog"`, `role="search"`, `aria-expanded`).
  - Typography weights strictly capped ($\le 600$) to prevent artificial font bloat.
- **Automated CI/CD**:
  - Native GitHub Actions workflow (`.github/workflows/deploy.yml`) deploying directly to GitHub Pages.

---

## 🧪 Local Development & Testing

```bash
# Clone the repository
git clone https://github.com/nathan2803/kape-point-cafe.git
cd kape-point-cafe

# Run a local web server (port 3002)
python3 -m http.server 3002

# Run automated Playwright / Bun test suites
bun test-order-flow.ts
bun test-ui-ux.ts
```

---

## 📍 Location & Contact

- **Address**: Block 4 Lot 8, Quezon Avenue Extension, Lucena City, Quezon 4301, Philippines
- **Phone**: +63 (042) 710-8899
- **Email**: hello@kapepoint.ph
- **Hours**:
  - Mon – Thu: 7:00 AM – 9:00 PM
  - Fri – Sat: 7:00 AM – 10:30 PM
  - Sun: 8:00 AM – 8:00 PM
