# FAMI SPORTS

**CS4032 Web Programming — Assignment 02 (Fall 2026)**
Student: Muhammad Wajid · Roll no: i242054 · BS Cyber Security, FAST-NUCES Islamabad · Section: _(add)_

A React + Vite storefront for a fictional multi-sport equipment shop serving **Islamabad and Rawalpindi**
(cricket, football, badminton, tennis, fitness). Customers browse, search, filter, open details, build a cart,
fill a validated checkout form, see a calculated summary and reach a confirmation. **All orders are simulated.**

- GitHub: _(add public repo link)_
- Deployment: _(add Vercel link)_ — `vercel.json` rewrites all paths to `index.html`, so nested-route refresh works.
- Final commit: _(add hash)_

## Commands
```bash
npm install        # install dependencies
npm run dev        # development server
npm run build      # production build -> dist/
npm test           # node --test (business-rule test)
```

## Routes
| Route | Purpose |
|---|---|
| `/` | Home: categories, rules summary, featured stock |
| `/shop` | Search, filter, sort (state kept in URL + localStorage) |
| `/items/:id` | Product details, options, quantity, add to cart (invalid id → feedback) |
| `/cart` | Quantities, options, availability check, summary |
| `/checkout` | Controlled, validated form + live summary |
| `/confirmation` | Order result (survives refresh via sessionStorage) |
| `*` | Not-found page |

## Operating rules
| Rule | Condition | Where users see it | When broken | Boundary |
|---|---|---|---|---|
| Availability (`src/rules/quantityRule.js`) | 1–5 units per product per order, never above stock | Beside every quantity control, product page, home | Add disabled + specific error; cart flags and offers "Fix my cart" | 5 OK, 6 rejected; stock 2 → 2 OK, 3 rejected |
| Eligibility (`src/rules/ageRule.js`) | Player age ≥ 13; junior gear only for ages 13–17 | Card badge, details, checkout age field | Order blocked with product-specific message | Age 17 OK, 18 blocked for junior gear; 12 blocked |
| Pricing/fulfilment (`src/rules/deliveryRule.js`) | Delivery Rs. 250, free from Rs. 5,000; pickup free; delivery only Islamabad/Rawalpindi | Announcement bar, cards, cart progress bar, checkout | Fee recalculated live; other city → error, suggests pickup | Rs. 4,999 pays 250, Rs. 5,000 free |

## Reproducing edge cases
Open **Demo controls** in the page footer.
- **Loading failure:** tick "Simulate catalogue loading failure" → error + Retry; untick → Retry works.
- **Changed availability:** add a product to the cart, choose it in Demo controls, set stock lower than the cart quantity → cart shows conflict and "Fix my cart". Settings persist on refresh, so a restored cart can be invalidated.
- **Restored cart:** corrupt `fami-sports-cart` in localStorage → invalid entries removed with a notice.
- **Missing image:** "Adjustable Student Dumbbell Pair" has no image → placeholder. **Long name:** "The Islamabad and Rawalpindi Multi-Sport…" clamps on cards.
- **Invalid URL:** `/items/nope` and `/anything`.
- **Reset:** "Reset demo data" in Demo controls.
See `docs/EDGE_CASES.md` for expected/observed results.

## Simulated operations & limitations
Local data only; `mockApi.js` simulates loading delay, failure and order placement. No payment, no real personal data
(use fictional details). Order stock deduction lasts for the page session only. Product photos are hot-linked from Unsplash and shown in monochrome by design.

## Concept map
| Concept | File | Component / function |
|---|---|---|
| Routing, params | `src/App.jsx`, `pages/ItemDetails.jsx` | `Routes`, `useParams` |
| Shared state (context) | `context/ProductsContext.jsx`, `context/CartContext.jsx` | `ProductsProvider`, `CartProvider` |
| Functional updates / immutability | `context/CartContext.jsx` | `addItem`, `setOption`, `setQuantity` |
| Controlled form + validation | `pages/Checkout.jsx`, `utils/validation.js` | `update`, `validateCheckout` |
| Derived values | `utils/cart.js`, `components/OrderSummary.jsx` | `buildCartLines`, `cartTotals`, `calculateDelivery` |
| Effects + cleanup | `hooks/useDebounce.js`, `context/ProductsContext.jsx` | `useDebounce`, load effect |
| Async / errors | `services/mockApi.js` | `loadProducts`, `placeOrder` |
| localStorage / sessionStorage | `utils/storage.js`, `CartContext.jsx`, `hooks/useShopFilters.js` | `readJson`, `writeJson` |
| Business rules + test | `src/rules/*`, `tests/quantityRule.test.js` | `validateQuantity` |
| Search/filter/sort | `utils/filterProducts.js` | `filterAndSortProducts`, `suggestRelaxations` |
| Callback props | `components/QuantityControl.jsx`, `FilterPanel.jsx` | `onChange`, `onClear` |

## Design system
Strict two-colour palette: black surfaces + red (`--red`) for primary actions/selection; white/grey only for text.
Barlow Condensed (display) + Inter (body), self-hosted via `@fontsource`. Primary = filled red button; secondary = outlined.
Status always has text/symbols (✓, !, ✕, "Error:"), never colour alone. Visible white focus ring, 44px targets.
