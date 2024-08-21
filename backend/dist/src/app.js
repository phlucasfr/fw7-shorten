"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const urlController_1 = require("./controllers/urlController");
const rateLimiter_1 = require("./middleware/rateLimiter");
const redis_1 = require("./config/redis");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, body_parser_1.json)());
app.use(rateLimiter_1.rateLimiter);
app.use('/api/urls', urlController_1.urlRouter);
const PORT = process.env.PORT;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, redis_1.connectRedis)();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Error connecting to Redis:', error);
        process.exit(1);
    }
});
const stopServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, redis_1.disconnectRedis)();
    }
    catch (error) {
        console.error('Error disconnecting from Redis:', error);
    }
});
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield stopServer();
    process.exit(0);
}));
startServer();
