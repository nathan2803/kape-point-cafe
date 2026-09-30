# Agent Instructions: Static Website Project

## 1. Project Overview
- **Project Name:** Kape Point Cafe
- **Category:** Local Business
- **Description:** A community-focused specialty coffee shop offering single-origin Philippine coffee, handcrafted beverages, and fresh artisan pastries in a cozy, work-friendly space.
- **Primary Goal:** Drive customer visits, showcase signature menu offerings with transparent pricing, provide clear operating hours and location, and facilitate customer inquiries and table reservations.

## 2. Technical Stack & Constraints
- **Core Stack:** Plain HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Zero External Dependencies:** Do NOT use external build tools, package managers (npm/yarn), or third-party CSS/JS frameworks (no Tailwind CDN, Bootstrap, React, or jQuery).
- **Font & Icon Constraints:** Modern web-safe system font stacks or Google Fonts via `<link>` tag. Use inline SVGs or local SVG files in `assets/` for icons.
- **Paths:** All internal links, stylesheets, scripts, and asset references must use **relative paths** (e.g., `./assets/logo.svg`, `./style.css`, `./script.js`) to ensure compatibility with GitHub Pages subdirectory hosting.

## 3. Directory Layout
```text
kape-point-cafe/
├── AGENTS.md
├── index.html
├── style.css
├── script.js
└── assets/
    ├── logo.svg
    ├── hero-coffee.svg
    ├── menu-espresso.svg
    ├── menu-latte.svg
    ├── menu-coldbrew.svg
    ├── menu-matcha.svg
    ├── menu-pastry.svg
    ├── menu-sandwich.svg
    ├── feature-beans.svg
    ├── feature-barista.svg
    └── feature-space.svg
```

## 4. UI/UX & Design Guidelines
Color Palette:
- Primary: `#2C1810` (Deep Espresso Walnut)
- Secondary: `#F5EBE1` (Warm Cream Oat)
- Accent / CTA: `#C87D32` (Golden Honey Amber)
- Background: `#FAF7F2` (Linen Canvas, `#18110D` in Dark Mode)
- Text: `#23170F` (Dark Coffee Neutral, `#EDE6DE` in Dark Mode)
- Surface Cards: `#FFFFFF` (Card base, `#241B15` in Dark Mode)

Typography: Clean, accessible sans-serif system stack (`system-ui, -apple-system, sans-serif`) with elegant serif accents (`'Georgia', serif`).
Layout Approach: Mobile-first design using CSS Flexbox and CSS Grid.
Responsiveness: Fluid breakpoints (Mobile: < 640px, Tablet: 640px - 1024px, Desktop: > 1024px).

## 5. Required Sections
- **Header / Navbar:** Brand logo/title, accessible navigation links, dark/light theme switch, and mobile hamburger menu toggle.
- **Hero Section:** Clear value proposition heading, engaging descriptive text, primary CTA ("View Menu") and secondary CTA ("Reserve a Table").
- **Core Content Section:**
  - About Kape Point (Story, ethical sourcing, community ethos)
  - Features & Highlights (Single-origin beans, craft brewing, work-friendly space)
  - Products & Services Showcase: Filterable menu items (Espresso & Brews, Refreshers, Pastries, Savory) with pricing and detailed notes
  - Customer Testimonials & Reviews
  - Operating Hours & Location details
- **Interactive Features:**
  - Dynamic Menu Category Filter (All, Espresso & Brews, Refreshers, Pastries)
  - Table Reservation & Inquiries Modal Window with accessible focus trapping, escape key dismiss, and validation
  - Light/Dark Mode Toggle with `localStorage` persistence
- **Contact / CTA Section:** Working static contact form UI with field validation, live status messages, and direct contact cards.
- **Footer:** Copyright, quick links, operating hours recap, and social media links.

## 6. Agent Rules of Engagement
- Always generate complete, functional code blocks: avoid placeholders, ellipsis comments (`/* code continues here */`), or truncated snippets.
- Ensure semantic HTML tags are prioritized (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Keep CSS organized with clear section headers, CSS custom properties (`:root`), and smooth transitions.
- Keep JavaScript modular, event-driven, and scoped without polluting global namespace.
