import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import csurf from 'csurf';

const isProd = process.env.NODE_ENV === 'production';

const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
  styleSrc: ["'self'", 'https:' ],
  imgSrc: ["'self'", 'data:', 'https:'],
  connectSrc: ["'self'", 'ws:', 'wss:', 'https:', 'http:'],
  fontSrc: ["'self'", 'https:', 'data:'],
  objectSrc: ["'none'"],
  frameAncestors: ["'none'"],
  baseUri: ["'self'"],
};

// Allow inline styles in development for rapid iteration (unsafe-inline).
if (!isProd) {
  // @ts-ignore - allow mutation for development convenience
  cspDirectives.styleSrc.push("'unsafe-inline'");
}

export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: cspDirectives,
    },
  }),
  cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:3000', credentials: true }),
  rateLimit({
    windowMs: 1000 * 60,
    max: 120,
    message: 'Too many requests from this IP, please slow down.',
  }),
  csurf({
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  }),
];
