import mongoose from 'mongoose';
import { createClient } from 'redis';
import { config } from './config';
import app from './app';

async function bootstrap() {
  await mongoose.connect(config.mongoUri, { autoIndex: true });

  const redisClient = createClient({ url: config.redisUrl });
  redisClient.on('error', (error) => {
    console.error('Redis client error', error);
  });

  await redisClient.connect();
  app.locals.redis = redisClient;

  app.listen(config.port, () => {
    console.log(`SmartDeal AI backend listening on http://localhost:${config.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
