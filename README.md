# SmartDeal AI

SmartDeal AI is a premium next-generation AI-powered e-commerce ecosystem built with React, Next.js, TypeScript, Node.js, Express.js, MongoDB, Redis, Docker, and JWT authentication.

## What is included

- Personalized AI-driven homepage and search experience
- Multi-modal search concept with voice, image, and natural language prompts
- Advanced product pages with variant updates, responsive interactions, and deal analytics
- Secure onboarding with email verification, OTP, 2FA, session monitoring, and suspicious-login tracking
- Seller trust scoring, price history, AI deal analyzer, recommendation engine, and bundle suggestions
- Admin and user dashboards with analytics stubs, security panels, and community features
- Docker Compose orchestration for frontend, backend, MongoDB and Redis

## Local development

1. Install dependencies in workspace root:

```bash
npm install
```

2. Start the platform:

```bash
npm run dev
```

3. Open the frontend at `http://localhost:3000`

## Architecture

- `frontend/`: Next.js app with modern UI, skeleton loading, motion, and personalized shopping experience
- `backend/`: Express API with MongoDB models, Redis caching, JWT auth, OAuth stubs, security middleware, and analytics routes
- `docker-compose.yml`: Local orchestration for all services

## Notes

This scaffold is built to be extended into a full enterprise system. Replace placeholder data, add production secrets, and integrate real email, auth, and AI services when moving to production.
