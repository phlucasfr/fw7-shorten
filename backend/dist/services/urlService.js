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
exports.getUrlService = exports.shortenUrlService = void 0;
const uuid_1 = require("uuid");
const urlRepository_1 = require("../repositories/urlRepository");
const generateShortId = () => (0, uuid_1.v4)().slice(0, 8);
const shortenUrlService = (originalUrl, remainingUrls) => __awaiter(void 0, void 0, void 0, function* () {
    const shortId = generateShortId();
    yield (0, urlRepository_1.saveUrl)({ originalUrl, shortId });
    return {
        shortUrl: `https://fw7-shorten.onrender.com/api/urls/${shortId}`,
        remaining: remainingUrls - 1,
        shortId,
    };
});
exports.shortenUrlService = shortenUrlService;
const getUrlService = (shortId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, urlRepository_1.getUrl)(shortId);
});
exports.getUrlService = getUrlService;
