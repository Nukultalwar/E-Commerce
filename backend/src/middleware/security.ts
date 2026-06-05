import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import csurf from 'csurf';

export const securityMiddleware = [
  helmet(),
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
