# Edge-case checklist (Chrome, 390 px, console open — no application errors or React warnings)

| # | Case | Actions | Expected | Observed |
|---|---|---|---|---|
| 1 | Qty above stock | `/items/bat-02` (stock 3), type 4 | Specific error, Add disabled | "Only 3 in stock. Choose 3 or fewer." ✔ |
| 2 | Qty above limit | `/items/ball-01`, type 6 | "Maximum 5 per order" | ✔ |
| 3 | Changed availability | Cart has 3 bats; Demo controls → bat stock 1 | Alert, checkout hidden, "Fix my cart" | Conflict shown; fix clears it ✔ |
| 4 | Restored cart | Reload page | Cart restored from localStorage | ✔ |
| 5 | Invalid form | Submit empty checkout | Error summary + per-field errors, focus first field | 5 errors listed ✔ |
| 6 | Valid input kept | Fix some fields, submit again | Name stays; only bad fields flagged | ✔ |
| 7 | Out-of-area city | Choose Lahore | "We deliver only in Islamabad and Rawalpindi" | ✔ |
| 8 | Age restriction | Junior bat in cart, age 18 | Blocked with product message | ✔ |
| 9 | Empty results | Search "zzz" | Explanation + relax buttons | ✔ |
| 10 | Invalid URL | `/items/xyz`, `/abc` | Useful message + links | ✔ |
| 11 | Loading failure | Demo → simulate failure | Error + Retry; works after switching off | ✔ |
| 12 | Confirmation refresh | Place order, refresh | Confirmation persists | ✔ |
| 13 | Missing image / long name | `/shop` | Placeholder, clamped title | ✔ |
| 14 | Overflow | 390 px and 1280 px, all routes | No horizontal scroll | ✔ |

Automated: `npm test` → 6 tests, 6 pass (`tests/quantityRule.test.js`).
