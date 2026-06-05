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
app.use(securityMiddleware);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'SmartDeal AI backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

export default app;
