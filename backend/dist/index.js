"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
const config_1 = require("./config");
const app_1 = __importDefault(require("./app"));
async function bootstrap() {
    await mongoose_1.default.connect(config_1.config.mongoUri, { autoIndex: true });
    const redisClient = (0, redis_1.createClient)({ url: config_1.config.redisUrl });
    redisClient.on('error', (error) => {
        console.error('Redis client error', error);
    });
    await redisClient.connect();
    app_1.default.locals.redis = redisClient;
    app_1.default.listen(config_1.config.port, () => {
        console.log(`SmartDeal AI backend listening on http://localhost:${config_1.config.port}`);
    });
}
bootstrap().catch((error) => {
    console.error('Failed to start backend', error);
    process.exit(1);
});
