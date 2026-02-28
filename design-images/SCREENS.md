# Design Reference — Keyturn Screen Index

All images are from the Keyturn UI/UX design (Behance #169315941).
Use these as the visual target when implementing each page.
Playwright visual tests compare screenshots against these references.

---

## Screen Map

| File | Screen | Routes |
|------|--------|--------|
| `2f6699169315941.644a620d9e041.png` | **Design system** — colors (#1B59E8, #CEE8FB, #EEF2F6, #ACB3BA, #151515), Cera Pro font | All pages |
| `35293a169315941.644a620da04ad.png` | **Marketing landing page** — full wireframe, section layout, mobile grid | `/` |
| `35293a169315941(1).644a620da04ad.png` | **Marketing landing expanded** — full page sections + mobile screenshots | `/` |
| `5bee51169315941.Y3JvcCwxNDAwLDEwOTUsMCww.png` | **Cover / hero banner** — blue bg, catalog card grid overview | `/` |
| `8dc055169315941.644a620d99f4b.png` | **Cover variant** — same hero with catalog open | `/` |
| `5dc528169315941.644a620da4469.png` | **Property catalog** — list+map split, filter panel, sort bar | `/projects` |
| `faf442169315941.644a620da1378.png` | **Project detail — top section** — image, address, financial snapshot panel, key metrics, in-year stats, revenue chart | `/projects/:slug` |
| `051a85169315941.644a620da6974.png` | **Project detail — full scroll** — calculator, map, detailed financials table (1yr–30yr), visualize returns chart | `/projects/:slug` |
| `bbc941169315941.644a620da2270.png` | **Analyze property / portfolio tool** — property form (Zillow link or manual), financial snapshot, in-year stats, detailed financials, stacked bar chart | `/dashboard/portfolio` |
| `67cbfb169315941.644a620d9b2b4.png` | **Checkout + success** — payment method selector (card form, Apple Pay, Google Pay, PayPal), billing summary card, success confirmation page | `/projects/:slug/invest`, `/projects/:slug/invest/success` |
| `f5aac4169315941.644a620da57d1.png` | **Saved searches / watchlist** — saved search rows with mini property cards | `/dashboard/favorites` |
| `0371e3169315941.644a620d9d1d7.png` | **Messages and notifications** — inbox list, conversation thread, notifications panel | `/dashboard/notifications` |
| `f3512a169315941.644a620da32d0.png` | **Settings** — Profile tab, Password tab, Billing tab (saved cards), Plans tab (subscription), Notifications tab (toggles) + Help page (categories + FAQ accordion) | `/dashboard/settings` |

---

## What to Ignore

| File | Reason |
|------|--------|
| `b31cb2244222145.Y3JvcCwyMTQ3LDE2ODAsNSww.png` | Eclipso fintech dashboard — different Behance project, not Keyturn. Not a design reference. |

---

## Key Design Details

### App Shell (from all dashboard screens)
- Outer frame: `#1B59E8` blue, full viewport
- Inner card: white, `rounded-3xl`, ~12px margin
- Top bar: logo (left) + collapse toggle + page title | bell + avatar + name/email (right)
- Sidebar: 64px icon-only (collapsed) or 224px with labels (expanded)
- Active nav item: `#1B59E8` 3px left border + light blue bg tint
- Sidebar bottom: Help icon + Log out icon

### Property Card (from `5dc528...`)
- Full-width photo, bookmark icon top-right
- Price bold `#151515`, listed date muted
- Strategy · City · Type tags
- 3-col metrics row: Min. investment / IRR / Duration
- Gross yield + funding progress bar

### Project Detail Financial Panel (from `faf442...`, `051a85...`)
- Time selector tabs: 1yr · 5yr · 10yr · 30yr
- Key metrics list: each row = label (blue, 13px) + value (bold, right-aligned)
- In-year statistics: ADR / Occupancy / RevPAN
- Seasonalized revenue projection: bar chart (monthly, blue bars)
- Detailed financials table: rows × year columns, alternating bg
- Visualize returns: stacked bar + line chart

### Checkout (from `67cbfb...`)
- Left: payment method list (radio buttons), active expands to card form
- Right: `#CEE8FB` light-blue billing summary card
- Summary: project thumbnail + metrics + subtotal + discount + **Total**
- CTA: full-width blue "Checkout" button

### Settings (from `f3512a...`)
- Sidebar stays, content area has horizontal tab bar: Profile · Password · Billing · Plans · Notifications
- Profile: avatar upload (drag-drop dashed area), form fields, Save button
- Billing: saved card list with "Set as Primary" + "Add new method"
- Plans: current plan card + billing history table (date + amount + status badge)
- Notifications: toggle switches per category

### Color confirmed (from `2f6699...`)
```
#1B59E8  — Primary blue    RGB 27 89 232
#CEE8FB  — Light blue      RGB 206 232 251  (Note: design shows CEE8FB not CEE8FB — double-check this is correct)
#EEF2F6  — Background      RGB 238 242 246
#ACB3BA  — Gray muted      RGB 172 179 186
#151515  — Dark text       RGB 21 21 21
```
