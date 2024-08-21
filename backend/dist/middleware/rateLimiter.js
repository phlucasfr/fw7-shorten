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
exports.rateLimiter = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const LIMIT = 100;
const SECONDS_IN_A_DAY = 24 * 60 * 60;
const getTodayKey = (ip) => `rate_limit:${ip}:${new Date().toISOString().split('T')[0]}`;
const rateLimiter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method === 'POST' && req.path.startsWith('/api/urls/shorten')) {
        const ip = req.ip;
        if (!ip) {
            return res.status(500).json({ error: 'IP address not found' });
        }
        const key = getTodayKey(ip);
        const requests = yield redis_1.default.get(key);
        if (requests && parseInt(requests) >= LIMIT) {
            return res.status(429).json({
                error: 'Você atingiu o limite de encurtamentos de URL. Tente novamente amanhã.',
                remaining: 0,
            });
        }
        res.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
            if (res.statusCode === 201) {
                if (requests) {
                    yield redis_1.default.incr(key);
                }
                else {
                    yield redis_1.default.set(key, '1', {
                        EX: SECONDS_IN_A_DAY,
                    });
                }
            }
        }));
        req.remainingUrls = LIMIT - (requests ? parseInt(requests) : 0);
        next();
    }
    else {
        next();
    }
});
exports.rateLimiter = rateLimiter;
