import mongoose from 'mongoose';
import { createClient } from 'redis';
import { config } from './config';
import app from './app';

// Use mongodb-memory-server in development when a real MongoDB is not available.
let mongod: any = null;

async function startInMemoryMongo() {
  // Dynamically import to keep production bundle lean
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongod = await MongoMemoryServer.create();
  return mongod.getUri();
}

async function bootstrap() {
  try {
    await mongoose.connect(config.mongoUri, { autoIndex: true });
    console.log('Connected to MongoDB at', config.mongoUri);
  } catch (err) {
    console.warn('Primary MongoDB connection failed:', (err as Error).message);
    // treat any non-production environment as development for local convenience
    if (process.env.NODE_ENV !== 'production') {
      console.log('Starting in-memory MongoDB for development...');
      const uri = await startInMemoryMongo();
      await mongoose.connect(uri, { autoIndex: true });
      console.log('Connected to in-memory MongoDB');
    } else {
      throw err;
    }
  }

  let redisClient: any = null;
  // Only attempt Redis when an explicit REDIS_URL is provided. In local dev
  // environments we skip Redis to avoid noisy connection errors when it's not
  // installed or running.
  if (process.env.REDIS_URL) {
    try {
      redisClient = createClient({ url: config.redisUrl });
      redisClient.on('error', (error: any) => {
        console.error('Redis client error', error);
      });

      // attempt to connect but do not crash the app if Redis is unavailable in dev
      await redisClient.connect();
      app.locals.redis = redisClient;
      console.log('Connected to Redis at', config.redisUrl);
    } catch (rerr) {
      console.warn('Redis unavailable, continuing without Redis cache. Error:', (rerr as Error).message);
      app.locals.redis = null;
    }
  } else {
    console.log('REDIS_URL not set — skipping Redis initialization (development mode)');
    app.locals.redis = null;
  }
  app.locals.mongod = mongod;

  const server = app.listen(config.port, () => {
    console.log(`SmartDeal AI backend listening on http://localhost:${config.port}`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down backend...');
    if (redisClient) await redisClient.disconnect().catch(() => {});
    await mongoose.disconnect().catch(() => {});
    if (mongod) await mongod.stop();
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
