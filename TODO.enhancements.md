# TODO - SmartDeal AI Enhancements (UX + Performance + Security)

## Step 1 — UX error/partial states (frontend)
- [x] Update `frontend/components/SearchPageShell.tsx` with `error` state + retry button.
- [x] Update `frontend/components/ProductDetailShell.tsx` with deal-analyzer specific error/partial rendering.

## Step 2 — Performance hardening (backend)

- [ ] Add MongoDB indexes for product search fields (title/shortDescription/category) and slug.
- [ ] Implement Redis caching for:
  - [ ] `GET /api/products/search`
  - [ ] `GET /api/products/:slug/deal-analyzer`


## Step 3 — Security hardening (backend)
- [ ] Validate `q` input (length limits) for `/products/search`.
- [ ] Validate `slug` format for `/products/:slug` and `/products/:slug/deal-analyzer`.
- [ ] Add/tighten rate limiting on search + deal-analyzer endpoints.


## Step 4 — Verification
- [ ] TypeScript build/lint (frontend + backend).
- [ ] Manual API checks for search and deal analyzer.
- [ ] Forced-backend-down UI check (ensure graceful errors).

