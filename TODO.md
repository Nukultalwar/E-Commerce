# TODO — SmartDeal AI upgrade roadmap

## Step 0 — Audit complete
- [x] Repo inventory: frontend (Next+Tailwind), backend (Express+Mongo+Redis), existing routes and contracts.
- [x] Identified gaps: mocks-only AI/UI wiring, regex search bottleneck, security not yet enterprise.

## Step 1 — Vertical slice: wire UI to existing backend endpoints
- [x] Wire **AI Assistant** frontend shell to `POST /api/ai/assistant` (keeps mock fallback on failure).
- [ ] Wire **Search** shell to `GET /api/products/search?q=...` and render real results (keep mock fallback).
- [ ] Wire **Deal Intelligence** section on product page to `GET /api/products/:slug/deal-analyzer` (keep mock fallback).

## Step 2 — Contracts-first hardening (additive)
- [ ] Add Zod validation to new “v2” endpoints matching `backend/src/routes/contracts.ts` schemas.
- [ ] Add response DTOs (type-safe) between frontend and backend.

## Step 3 — Performance baseline
- [ ] Add indexes for Product fields used in search (`title`, `shortDescription`, `category`, `slug`).
- [ ] Add basic Redis caching around deal analyzer and search.

## Step 4 — Security enterprise scaffolding (additive)
- [ ] Implement OTP/2FA endpoints behind feature flags.
- [ ] Add audit logging collection + middleware for auth/security events.

## Step 5 — Subscription + AI tiering (scaffold)
- [ ] Add plan read endpoint and gating logic in frontend (Free/Pro/Business).
- [ ] Add placeholder subscription webhooks endpoints (won’t break existing auth).

