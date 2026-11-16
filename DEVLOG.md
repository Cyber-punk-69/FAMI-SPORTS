# Development Log

## Step 1 — Repository metadata

### Files created or changed

- `/home/punk/Desktop/WEB/web ass 3/.gitignore`
- `/home/punk/Desktop/WEB/web ass 3/README.md`

### What changed and why

Initialized the FAMI SPORTS assignment repository with ignore rules for generated files, environment values, and logs, plus a minimal project README. This keeps the first commit deliberately small and safe.

### Requirements covered

- Project setup prerequisite for all FR01–FR19.

### Known issues and fixes

- GitHub CLI (`gh`) is not installed in this environment, so no public remote was created or pushed.

### Manual checks

- Confirm the repository contains no `node_modules`, `dist`, or environment files.
- Confirm the first commit includes only `.gitignore` and the README stub.

## Step 2 — Vite and React foundation

### Files created or changed

- `/home/punk/Desktop/WEB/web ass 3/package.json`
- `/home/punk/Desktop/WEB/web ass 3/package-lock.json`
- `/home/punk/Desktop/WEB/web ass 3/index.html`
- `/home/punk/Desktop/WEB/web ass 3/vite.config.js`
- `/home/punk/Desktop/WEB/web ass 3/src/main.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/App.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/styles/global.css`
- `/home/punk/Desktop/WEB/web ass 3/src/components/.gitkeep`
- `/home/punk/Desktop/WEB/web ass 3/src/pages/.gitkeep`
- `/home/punk/Desktop/WEB/web ass 3/src/context/.gitkeep`
- `/home/punk/Desktop/WEB/web ass 3/src/hooks/.gitkeep`
- `/home/punk/Desktop/WEB/web ass 3/src/data/.gitkeep`
- `/home/punk/Desktop/WEB/web ass 3/src/services/.gitkeep`
- `/home/punk/Desktop/WEB/web ass 3/src/rules/.gitkeep`
- `/home/punk/Desktop/WEB/web ass 3/src/utils/.gitkeep`
- `/home/punk/Desktop/WEB/web ass 3/src/assets/.gitkeep`
- `/home/punk/Desktop/WEB/web ass 3/tests/.gitkeep`

### What changed and why

Created the Vite React entry point, BrowserRouter boundary, minimal working app shell, package scripts, and the required modular directories. The project is now ready for route and design-system work.

### Requirements covered

- FR01 foundation: BrowserRouter is installed and mounted.
- FR17 foundation: viewport metadata and overflow-safe base sizing.

### Known issues and fixes

- The initial `create-vite` command cancelled because the folder already contained the required README and log. The equivalent Vite setup was created explicitly without overwriting those files.
- No tests exist yet; `npm test` currently reports zero tests by design.

### Manual checks

- Run `npm run dev` and confirm the FAMI SPORTS shell renders.
- Run `npm run build` and confirm the production bundle completes.

## Step 3 — Design tokens

### Files created or changed

- `/home/punk/Desktop/WEB/web ass 3/src/styles/tokens.css`
- `/home/punk/Desktop/WEB/web ass 3/src/styles/global.css`

### What changed and why

Added the red/black theme roles, spacing scale, radius tokens, and global surface styling so later components share one visual foundation.

### Requirements covered

- Theme requirement: named colour roles are defined as CSS variables.
- FR17 foundation: global sizing remains compatible with narrow viewports.

### Known issues and fixes

- None. The production build passed after the token import was corrected.

### Manual checks

- Confirm primary actions use the red role and focus states use the focus role when components are added.

## Step 4 — Product catalogue

### Files created or changed

- `/home/punk/Desktop/WEB/web ass 3/src/data/products.js`

### What changed and why

Added twelve stable product records across cricket, football, badminton, tennis, and fitness. The catalogue includes junior products, out-of-stock and low-stock cases, a missing image, and a deliberately long name/description for later layout testing.

### Requirements covered

- FR03: local catalogue with stable IDs and required product fields.
- FR06 foundation: details/specification data is available for future pages.
- FR17 foundation: long-content and missing-image cases are represented.

### Known issues and fixes

- Product images use royalty-free Unsplash URLs and will receive fallback handling in the product card milestone.

### Manual checks

- Verify each record has an ID, category, price, specs, age group, stock, tags, and image metadata.

### Follow-up fix

- Added `tennis-02` after the initial catalogue count smoke test found only eleven products. The catalogue now meets the 12+ record requirement.

## Step 5 — Async product loader

### Files created or changed

- `/home/punk/Desktop/WEB/web ass 3/src/services/mockApi.js`
- `/home/punk/Desktop/WEB/web ass 3/src/hooks/useProducts.js`

### What changed and why

Added an async mock service with a delay, controllable failure mode, and stock reduction control. The `useProducts` hook owns loading/error state, retry behavior, and cleanup-safe async updates for the upcoming shop page.

### Requirements covered

- FR14 foundation: async loading, failure, retry entry point, and demo stock controls.
- React concept coverage: hooks, async/await, immutable updates, and effect cleanup.

### Known issues and fixes

- Controls are service-level exports for now and will be wired into the labelled UI demo panel later.

### Manual checks

- Confirm the loader returns all catalogue records.
- Confirm `setMockFailure(true)` produces a retryable error.
- Confirm reducing a known product stock never makes it negative.

## Step 6 — Route skeleton

### Files created or changed

- `/home/punk/Desktop/WEB/web ass 3/src/App.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/pages/Home.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/pages/Shop.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/pages/ItemDetails.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/pages/Cart.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/pages/Checkout.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/pages/Confirmation.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/pages/NotFound.jsx`

### What changed and why

Added all required route paths with independent page modules and a wildcard not-found route. The route skeleton establishes the navigation surface before page behavior is implemented.

### Requirements covered

- FR01: required routes are registered with `react-router-dom`.
- FR02: item-detail route accepts an ID for later validation.
- FR19 foundation: Vite serves the SPA entry point.

### Known issues and fixes

- Pages are placeholders until their individual milestones are implemented.

### Manual checks

- Visit `/`, `/shop`, `/items/bat-01`, `/cart`, `/checkout`, `/confirmation`, and an unknown path.
- Use browser Back and Forward between routes.

## Step 7 — Shared layout

### Files created or changed

- `/home/punk/Desktop/WEB/web ass 3/src/App.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/components/Header.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/components/Header.module.css`
- `/home/punk/Desktop/WEB/web ass 3/src/components/Footer.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/components/Layout.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/components/Layout.module.css`
- `/home/punk/Desktop/WEB/web ass 3/src/styles/global.css`

### What changed and why

Added the shared semantic header, navigation, footer, skip link, focus-visible styling, and outlet layout. Every route now has consistent navigation and an accessible page shell.

### Requirements covered

- FR01: shared navigation across all routes.
- FR17: skip link, keyboard focus styling, semantic landmarks, and responsive container sizing.
- Accessibility requirement: image credit is visible in the footer.

### Known issues and fixes

- Cart count and active commerce state will be connected when CartContext is introduced.

### Manual checks

- Navigate using only the keyboard and confirm the skip link and nav links are reachable.
- Confirm the footer remains at the bottom on short pages.

## Step 8 — Product cards and grid

### Files created or changed

- `/home/punk/Desktop/WEB/web ass 3/src/components/ProductCard.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/components/ProductCard.module.css`
- `/home/punk/Desktop/WEB/web ass 3/src/components/ProductGrid.jsx`
- `/home/punk/Desktop/WEB/web ass 3/src/components/ProductGrid.module.css`

### What changed and why

Added reusable product cards and a responsive keyed product grid. Cards expose comparison information early, link to stable item routes, show stock status, and provide an image fallback for missing or failed images.

### Requirements covered

- FR03: stable IDs are used as list keys.
- FR06 foundation: price, specs, stock, and category are visible.
- FR17: grid sizing and long-name wrapping support narrow layouts.
- P2/P3 foundation: stock and comparison information appear before checkout.

### Known issues and fixes

- Product cards are not yet mounted on a populated page; Shop integration follows.

### Manual checks

- Confirm the missing-image product displays “Image unavailable.”
- Confirm the long product name wraps without horizontal overflow.

## Requirement status

| Requirement | Status |
|---|---|
| FR01 | Not started |
| FR02 | Not started |
| FR03 | Not started |
| FR04 | Not started |
| FR05 | Not started |
| FR06 | Not started |
| FR07 | Not started |
| FR08 | Not started |
| FR09 | Not started |
| FR10 | Not started |
| FR11 | Not started |
| FR12 | Not started |
| FR13 | Not started |
| FR14 | Not started |
| FR15 | Not started |
| FR16 | Not started |
| FR17 | Not started |
| FR18 | Not started |
| FR19 | Not started |
