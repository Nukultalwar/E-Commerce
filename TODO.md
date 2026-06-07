# SmartDeal AI - Implementation TODO

## Milestone 1 — Platform foundations (scaffolding-first)
- [x] Create/extend API contracts for future “ecosystem” features (recommendations, bundles, deals, reviews, security alerts)
- [ ] Add backend route skeletons + response DTOs for:
  - [ ] AI assistant (structured + streaming-ready contract)
  - [ ] Intent-based search endpoints
  - [ ] Price history endpoint (granularity supported)
  - [ ] Deal analyzer endpoint (decision + reasons + confidence)
  - [ ] Auth/security endpoints for OTP verification, 2FA stubs, session management
- [ ] Add frontend UI scaffolding/components (skeleton loading, micro-interactions, animated sections)
  - [ ] Wire assistant/search/product screens to backend contracts with mock fallback

## Milestone 2 — Vertical slice MVP (demoable end-to-end)
- [ ] Auth flow: email verify + OTP verify + login + active sessions (including suspicious flag placeholder)
- [ ] AI assistant: wire to backend `/api/ai/assistant` contract and add polished UX
- [ ] Search: upgrade UI to call intent search endpoint and display refinement chips
- [ ] Product page: wire deal analyzer + price history graph + variant-driven updates

## Milestone 3 — Ecosystem expansion (iterate)
- [ ] Reviews (verified purchaser gating + fake/spam detection stub + AI review summary stub)
- [ ] Recommendations (compatibility graph contract)
- [ ] Smart bundle engine contract
- [ ] Cart AI savings contract
- [ ] Seller trust score transparency views
- [ ] Admin analytics dashboard endpoints (mock forecasting)

## Milestone 4 — Future-ready premium features scaffolding
- [ ] AR/virtual try-on contract stubs
- [ ] Sustainability/carbon tracking contract stubs
- [ ] Digital product passport + authenticity verification contract stubs
- [ ] Multilingual + accessibility + dark mode wiring

## Notes
- Backend currently uses Express + MongoDB; frontend uses Next.js App Router + Tailwind.
- Repo already has partial mock UI + mock AI responses; goal is to replace mocks with real contracts incrementally.

