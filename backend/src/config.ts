import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/smartdeal',
  jwtSecret: process.env.JWT_SECRET ?? 'changeme_super_secure_secret',
  redisUrl: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:3000',
};
