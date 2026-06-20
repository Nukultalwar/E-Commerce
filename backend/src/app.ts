import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { securityMiddleware } from './middleware/security';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import aiRoutes from './routes/ai';

const app = express();

app.use(cookieParser());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
// In local development we allow calls without CSRF token.
// CSRF still applies in production unless explicitly disabled.
if (process.env.NODE_ENV === 'production') {
  app.use(securityMiddleware);
} else {
  // keep helmet + cors + rate-limit without csurf
  const [helmetMw, corsMw, rateLimitMw] = securityMiddleware;
  app.use(helmetMw);
  app.use(corsMw);
  app.use(rateLimitMw);
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'SmartDeal AI backend' });
});

// Prevent Chrome DevTools from repeatedly requesting a missing well-known config.
// This is primarily to avoid CSP console noise during local development.
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.json({});
});

// Avoid noisy 404 for browser default favicon requests.
app.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

export default app;
