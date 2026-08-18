# Fix favicon 404

## Steps
- [x] Audit: identify 404 source (browser `/favicon.ico` request)
- [ ] Delete `frontend/app/favicon.ico/route.ts` route handler folder
- [ ] Create a real binary `frontend/app/favicon.ico` file
- [ ] Add `icons` metadata to `frontend/app/layout.tsx`
- [ ] Verify the 404 is resolved
