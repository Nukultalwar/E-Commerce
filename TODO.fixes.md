# Fixes Applied

## Backend Fixes

### 1. Removed unused dependencies
- `backend/package.json`: Removed `useragent`, `validator` (unused packages)
- `backend/src/routes/auth.ts`: Removed `import validator from 'validator'` (unused import)
- `backend/src/app.ts`: Removed `requestSizeLimiter` and `authRateLimiter` from security imports (imported but never referenced in code)

### 2. Fixed invalid import in app.ts
- Removed `requestSizeLimiter` and `authRateLimiter` from the import line since they were imported but never used

## Frontend Fixes

### 1. Fixed missing dependency
- `frontend/package.json`: Added `framer-motion` which was missing but is used by `HeroSection.tsx`
- `frontend/package.json`: Removed unused `clsx`, `next-themes`, `swr` dependencies

### 2. Fixed unused imports
- `frontend/components/AccountSecurityPanel.tsx`: Removed `AlertTriangle` from lucide-react import (unused)
- `frontend/app/checkout/page.tsx`: Removed `useRouter` import from next/navigation (unused import and its usage)

