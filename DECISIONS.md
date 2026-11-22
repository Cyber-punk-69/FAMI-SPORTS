# Frontend Decisions

> Replace the "Problem" lines with the actual reference site, URL and screenshots from your investigation.
> The implementations below address these three problems: (1) filters/selections lost, (2) charges and restrictions shown late, (3) dead-end empty results.

## 1. Interaction / state — filters and selections are lost on navigation
- **Problem:** Opening a product and returning resets search/filters; selected items vanish from view when filtered out.
- **Decision:** Filters live in the URL query string and are mirrored to localStorage; the shop shows a cart strip saying how many selected items are hidden; cards show "In cart × n".
- **Alternative:** Keep filters in React state only (simpler, lost on refresh/Back).
- **Reason:** Shoppers compare across sports; keeping their place avoids repeated work and URLs are shareable.
- **Tradeoff:** More code (param parsing, restore-on-mount) and restored filters may surprise a returning user — mitigated by visible chips and "Clear all filters".
- **Code:** `src/hooks/useShopFilters.js`, `src/pages/Shop.jsx` (`hiddenSelected`), `ProductCard.jsx`.
- **Evidence:** Search "bat" → open a product → click Shop: search and results restored; `?q=bat` in the URL.

## 2. Information hierarchy — charges and restrictions appear too late
- **Problem:** Delivery fees, quantity limits and age restrictions are only revealed at checkout.
- **Decision:** Show the rules where the decision is made: announcement bar, home facts, "Ages 13–17" and stock badges on cards, limits beside the quantity control, delivery progress bar in the cart, live summary at checkout.
- **Alternative:** One shipping-policy page linked from the footer.
- **Reason:** Customers decide to buy on the card/details page; surprises at checkout cause abandonment.
- **Tradeoff:** More text on each screen; mitigated by short labels and visual hierarchy (badges, one summary panel).
- **Code:** `components/QuantityControl.jsx`, `ProductCard.jsx`, `OrderSummary.jsx`, `rules/*`, `Header.jsx`.
- **Evidence:** Product page shows "1–3 per order · only 3 in stock"; cart shows "Add Rs. X more for free delivery".

## 3. Empty results — no way forward (also mobile layout)
- **Problem:** "No results" pages give no alternative; mobile filter controls take over the page.
- **Decision:** No-match state explains the cause and offers one-click "Remove <filter> → N products" buttons computed from current data; on mobile, filters collapse behind a "Filters (n)" toggle and the checkout summary moves above the form.
- **Alternative:** Generic "No results, try again" message.
- **Reason:** Turns a dead end into a next action; keeps first content visible at 390 px.
- **Tradeoff:** `suggestRelaxations` recomputes the catalogue once per active filter (negligible at 12 products).
- **Code:** `utils/filterProducts.js` (`suggestRelaxations`), `pages/Shop.jsx`, `Shop.module.css`.
- **Evidence:** Search "zzz" → "Remove search "zzz" → 12 products"; also category + in-stock combinations.
