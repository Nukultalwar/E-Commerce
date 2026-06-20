"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
const config_1 = require("./config");
const app_1 = __importDefault(require("./app"));
// Use mongodb-memory-server in development when a real MongoDB is not available.
let mongod = null;
async function startInMemoryMongo() {
    // Dynamically import to keep production bundle lean
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    return mongod.getUri();
}
async function bootstrap() {
    try {
        await mongoose_1.default.connect(config_1.config.mongoUri, { autoIndex: true });
        console.log('Connected to MongoDB at', config_1.config.mongoUri);
    }
    catch (err) {
        console.warn('Primary MongoDB connection failed:', err.message);
        // treat any non-production environment as development for local convenience
        if (process.env.NODE_ENV !== 'production') {
            console.log('Starting in-memory MongoDB for development...');
            const uri = await startInMemoryMongo();
            await mongoose_1.default.connect(uri, { autoIndex: true });
            console.log('Connected to in-memory MongoDB');
        }
        else {
            throw err;
        }
    }
    let redisClient = null;
    // Only attempt Redis when an explicit REDIS_URL is provided. In local dev
    // environments we skip Redis to avoid noisy connection errors when it's not
    // installed or running.
    if (process.env.REDIS_URL) {
        try {
            redisClient = (0, redis_1.createClient)({ url: config_1.config.redisUrl });
            redisClient.on('error', (error) => {
                console.error('Redis client error', error);
            });
            // attempt to connect but do not crash the app if Redis is unavailable in dev
            await redisClient.connect();
            app_1.default.locals.redis = redisClient;
            console.log('Connected to Redis at', config_1.config.redisUrl);
        }
        catch (rerr) {
            console.warn('Redis unavailable, continuing without Redis cache. Error:', rerr.message);
            app_1.default.locals.redis = null;
        }
    }
    else {
        console.log('REDIS_URL not set — skipping Redis initialization (development mode)');
        app_1.default.locals.redis = null;
    }
    app_1.default.locals.mongod = mongod;
    const server = app_1.default.listen(config_1.config.port, () => {
        console.log(`SmartDeal AI backend listening on http://localhost:${config_1.config.port}`);
    });
    // Graceful shutdown
    const shutdown = async () => {
        console.log('Shutting down backend...');
        if (redisClient)
            await redisClient.disconnect().catch(() => { });
        await mongoose_1.default.disconnect().catch(() => { });
        if (mongod)
            await mongod.stop();
        server.close(() => process.exit(0));
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}
bootstrap().catch((error) => {
    console.error('Failed to start backend', error);
    process.exit(1);
});
