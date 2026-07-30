# SmartDeal AI upgrade roadmap

## Step 0 — Audit complete
- [x] Repo inventory: frontend (Next+Tailwind), backend (Express+Mongo+Redis), existing routes and contracts.
- [x] Identified gaps: mocks-only AI/UI wiring, deal analyzer response mismatch, security not yet enterprise.

## Step 1 — Fix backend deal-analyzer contract bugs (vital)
- [x] Normalize `GET /api/products/:slug/deal-analyzer` response to match `backend/src/routes/contracts.ts` (`decision`, `confidence`, `reasons`, `averageHistoricalPrice`, etc.).

## Step 2 — Wire Search UI to backend (with mock fallback)
- [x] Update `frontend/components/SearchPageShell.tsx` to call `GET /api/products/search?q=...`.
- [x] Keep mock fallback on network/shape errors.

## Step 3 — Wire Product page deal analyzer (with mock fallback)
- [x] Update `frontend/components/ProductDetailShell.tsx` to call `GET /api/products/:slug` and `GET /api/products/:slug/deal-analyzer`.
- [x] Keep mock fallback on network/shape errors.

## Step 4 — Performance & security hardening
- [x] Add indexes for Product search fields used by regex (`title`, `shortDescription`, `category`, `slug`).
- [x] Add basic Redis caching around search and deal analyzer.

- [ ] Review CSRF requirements for POST endpoints in production.

## Step 5 — UI/UX integration
- [x] Add loading/error states for search and deal analyzer sections.
- [x] Ensure type-safe rendering to avoid runtime crashes.

