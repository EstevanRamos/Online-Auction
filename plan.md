## Online Auction Project – Sprint Plan

Tech stack: SvelteKit (Svelte 5), PocketBase
Key dirs: `sk/` (web app), `pb/` (PocketBase), `pb/pb_migrations/` (DB schema)

---

### Sprint 0: Environment, Cleanup, and Foundations (0.5–1 day)
- Goals
  - Run PocketBase locally, run the SvelteKit app
  - Fix typos in directories and unify PocketBase URL via env
- Files to create/edit
  - Create: `/.env`, `/sk/.env`, `/.env.example`
  - Edit: `/sk/src/hooks.server.js` (use env for PB URL)
  - Edit+Rename: `/sk/src/lib/servrices` → `/sk/src/lib/services`
  - Edit+Rename: `/sk/src/lib/stores/prefrences.svelte.js` → `/sk/src/lib/stores/preferences.svelte.js`
  - Edit: `/sk/src/lib/stores/auth.svelte.js` (use env PB URL)
  - Optional Docs: `/README.md` (run instructions)
- Features/Acceptance
  - `npm run dev` in `sk/` serves the app
  - `./pocketbase serve` in `pb/` serves API at `PB_URL`
  - No broken imports after renames
- Commands
  - From `/workspace/pb`: `chmod +x pocketbase && ./pocketbase serve | cat`
  - From `/workspace/sk`: `npm i && npm run dev`

---

### Sprint 1: Authentication UX wired to PocketBase (1 day)
- Goals
  - Functional login, register, reset password flows
  - Session cookies persisted (SSR + client)
- Files to edit
  - `/sk/src/hooks.server.js` (already seeds cookie; ensure `PB_URL`)
  - `/sk/src/lib/stores/auth.svelte.js` (ensure register/login/reset integrate with PB; use env)
  - `/sk/src/routes/login/+page.svelte` (submit → `authStore.login`)
  - `/sk/src/routes/register/+page.svelte` (submit → `authStore.register`)
  - `/sk/src/routes/reset-password/+page.svelte` (submit → `authStore.requestPasswordReset`)
  - Create: `/sk/src/routes/logout/+page.server.js` (clear session and redirect)
- Features/Acceptance
  - Can create a user and auto-login
  - Login redirects to `/dashboard`
  - Reset password sends email (PB dev: verify logs)

---

### Sprint 2: Core Services Layer + Config (0.5–1 day)
- Goals
  - Implement service classes and standardize API usage
- Files to create/edit
  - Create: `/sk/src/lib/config/pocketbase.js` exporting `PB_URL`
  - Edit: `/sk/src/lib/services/api.js` (PocketBase client wrapper CRUD)
  - Edit: `/sk/src/lib/services/auth.js` (wrap auth flows)
  - Edit: `/sk/src/lib/services/auction.js` (list, details, items)
  - Edit: `/sk/src/lib/services/bidding.js` (place, proxy, history)
  - Edit: `/sk/src/lib/services/realtime.js` (collection/item subscriptions)
  - Edit: pages/stores to import from `services` if used
- Features/Acceptance
  - Single place to switch PB URL
  - Services return typed objects and handle errors consistently

---

### Sprint 3: Public Auctions Browse (1–1.5 days)
- Goals
  - Users can browse auctions and items from PB
- Files to create
  - `/sk/src/routes/auctions/+page.svelte` (grid of auctions)
  - `/sk/src/routes/auctions/+page.js` or `+page.server.js` (load via service)
  - `/sk/src/routes/auctions/[id]/+page.svelte` (auction detail with items)
  - `/sk/src/routes/auctions/[id]/+page.js` or `+page.server.js`
  - Optional UI components under `/sk/src/lib/components/auction/`
- Files to edit
  - `/sk/src/lib/stores/auction.svelte.js` (load from services or server endpoints)
  - `/sk/src/routes/+layout.svelte` (nav link to `/auctions`)
- Features/Acceptance
  - Auctions page lists from PB `auction_item` relations
  - Filters: category, status, price range (basic)

---

### Sprint 4: Item Detail + Bidding Mechanics (1.5–2 days)
- Goals
  - Place bids and set proxy bids; view bid history
- Files to create
  - `/sk/src/routes/items/[id]/+page.svelte` (item detail)
  - `/sk/src/routes/items/[id]/+page.js` or `+page.server.js`
  - Server endpoints:
    - `/sk/src/routes/api/bids/+server.js` (POST place bid)
    - `/sk/src/routes/api/proxy-bids/+server.js` (POST set proxy)
- Files to edit
  - `/sk/src/lib/stores/bidding.svelte.js` (wire to endpoints; update state)
  - `/sk/src/lib/services/bidding.js` (call PB or endpoints)
- Features/Acceptance
  - Cannot bid below increment/current price
  - Proxy bid auto-increments and caps at max
  - Bid history visible per item

---

### Sprint 5: User Dashboard Sections (1–1.5 days)
- Goals
  - Watchlist, My Bids, Won Items, Profile
- Files to create
  - `/sk/src/routes/dashboard/watchlist/+page.svelte`
  - `/sk/src/routes/dashboard/bids/+page.svelte`
  - `/sk/src/routes/dashboard/won/+page.svelte`
  - `/sk/src/routes/dashboard/profile/+page.svelte`
  - Endpoints (if needed): `/sk/src/routes/api/items/[id]/watch/+server.js`
- Files to edit
  - `/sk/src/routes/dashboard/+page.svelte` (link cards to sections)
  - `/sk/src/routes/+layout.svelte` (show login/register vs avatar/logout based on auth)
- Features/Acceptance
  - Toggle watchlist, view watched items
  - My active bids list with status
  - Won items list
  - Edit profile fields (displayName), change password via PB

---

### Sprint 6: Admin Panel (2 days)
- Goals
  - Admin CRUD for items, auctions, and users; role gating
- Files to create
  - `/sk/src/routes/admin/+page.svelte` (dashboard)
  - `/sk/src/routes/admin/items/+page.svelte`
  - `/sk/src/routes/admin/items/create/+page.svelte`
  - `/sk/src/routes/admin/items/[id]/edit/+page.svelte`
  - `/sk/src/routes/admin/auctions/+page.svelte`
  - `/sk/src/routes/admin/auctions/create/+page.svelte`
  - `/sk/src/routes/admin/auctions/[id]/edit/+page.svelte`
  - `/sk/src/routes/admin/users/+page.svelte`
  - Server endpoints for CRUD or direct PB calls via `services`
- Files to edit
  - Guards: load functions to check `authStore.isAdmin` or server-side PB rules
  - PB Rules (migrations or console) to restrict writes to admins
- Features/Acceptance
  - Only admins can access `/admin/*`
  - Create/edit items and auctions with validation

---

### Sprint 7: Realtime Updates and Notifications (1–1.5 days)
- Goals
  - Live bid updates; basic in-app notifications
- Files to create/edit
  - `/sk/src/lib/stores/notifications.svelte.js` (state + toasts)
  - `/sk/src/lib/services/realtime.js` (subscribe to `bids`, `auction_item` changes)
  - Use subscriptions on item/auction pages to update price/time left
- Features/Acceptance
  - When another user bids, current page updates
  - Toast on outbid events

---

### Sprint 8: Checkout and Payment (2–3 days)
- Goals
  - Basic checkout flow for won items (Stripe or placeholder)
- Files to create
  - `/sk/src/routes/checkout/[itemId]/+page.svelte`
  - `/sk/src/routes/checkout/[itemId]/success/+page.svelte`
  - `/sk/src/routes/api/payment/create-intent/+server.js`
  - `/sk/src/routes/api/payment/confirm/+server.js`
  - `/sk/src/routes/api/webhooks/payment/+server.js`
  - `/sk/src/lib/services/payment.js`
- Features/Acceptance
  - Only winners can pay for a won item
  - Success page after payment confirmation

---

### Sprint 9: QA, Testing, and Deployment (1–2 days)
- Goals
  - Stabilize and document
- Files to create/edit
  - `/sk/tests/*` (unit/integration/e2e as feasible)
  - `/docs/api.md`, `/docs/database-schema.md`, `/docs/deployment.md`
  - `/sk/svelte.config.js` (adapter for target deploy), `/sk/vite.config.js` (aliases if added)
  - `README.md` (top-level run + deploy steps)
- Features/Acceptance
  - Happy-path flows covered by tests
  - Clear deployment steps

---

### Data Model Notes (PocketBase)
- Migrations found: `users`, `auction_item`, `bids`
- Ensure fields exist for:
  - Users: `displayName`, `role` (user/admin)
  - Auction Item: `title`, `description`, `images`, `currentPrice`, `endAt`, `auctionId`
  - Bids: `itemId` (rel), `userId` (rel), `amount`, `created`
- Add indexes and rules as needed (admin-only writes for items/auctions)

---

### Known Tech Debt To Fix Early
- Directory name typos:
  - `sk/src/lib/servrices` → `sk/src/lib/services`
  - `sk/src/lib/stores/prefrences.svelte.js` → `sk/src/lib/stores/preferences.svelte.js`
- PB URL consistency:
  - Use `PB_URL` from env in both `hooks.server.js` and `auth.svelte.js`

---

### Env Examples
```
# /.env and /sk/.env
PB_URL=http://127.0.0.1:8090
```

---

### Quick Run Book
- Start PocketBase
  - `cd pb && chmod +x pocketbase && ./pocketbase serve`
- Start Web App
  - `cd sk && npm install && npm run dev`