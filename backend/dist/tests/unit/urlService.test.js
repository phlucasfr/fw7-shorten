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
Object.defineProperty(exports, "__esModule", { value: true });
const urlService_1 = require("../../src/services/urlService");
const urlRepository_1 = require("../../src/repositories/urlRepository");
const redis_1 = require("@testcontainers/redis");
const redis_2 = require("redis");
jest.mock('../../src/repositories/urlRepository');
describe('Url Service', () => {
    let redisContainer;
    let redisClient;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.setTimeout(60000);
        redisContainer = yield new redis_1.RedisContainer().start();
        redisClient = (0, redis_2.createClient)({
            url: redisContainer.getConnectionUrl(),
        });
        yield redisClient.connect();
    }), 60000);
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield redisClient.quit();
        yield redisContainer.stop();
    }), 60000);
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('deve encurtar a URL e salvar no banco de dados', () => __awaiter(void 0, void 0, void 0, function* () {
        const originalUrl = 'http://exampletest.com';
        urlRepository_1.saveUrl.mockResolvedValue(undefined);
        urlRepository_1.getUrl.mockResolvedValue(originalUrl);
        const result = yield (0, urlService_1.shortenUrlService)(originalUrl, 100);
        expect(urlRepository_1.saveUrl).toHaveBeenCalledWith({ originalUrl: originalUrl, shortId: result.shortId });
        const gettedUrl = yield (0, urlService_1.getUrlService)(result.shortUrl);
        expect(gettedUrl).toBe(originalUrl);
    }));
    it('deve retornar a URL original', () => __awaiter(void 0, void 0, void 0, function* () {
        const originalUrl = 'http://exampletest2.com';
        urlRepository_1.saveUrl.mockResolvedValue(undefined);
        urlRepository_1.getUrl.mockResolvedValue(originalUrl);
        const result = yield (0, urlService_1.shortenUrlService)(originalUrl, 100);
        const gettedUrl = yield (0, urlService_1.getUrlService)(result.shortUrl);
        expect(gettedUrl).toBe(originalUrl);
    }));
    it('deve retornar null para um shortId não encontrado', () => __awaiter(void 0, void 0, void 0, function* () {
        const shortId = 'nonexistentId';
        urlRepository_1.getUrl.mockResolvedValue(null);
        const result = yield (0, urlService_1.getUrlService)(shortId);
        expect(result).toBeNull();
    }));
    it('deve tratar entradas maliciosas no retrieveUrl', () => __awaiter(void 0, void 0, void 0, function* () {
        const sqlInjectionAttempt = "' OR '1'='1";
        urlRepository_1.getUrl.mockResolvedValue(null);
        const result = yield (0, urlService_1.getUrlService)(sqlInjectionAttempt);
        expect(result).toBeNull();
    }));
});
