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
exports.getUrl = exports.saveUrl = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const saveUrl = (_a) => __awaiter(void 0, [_a], void 0, function* ({ originalUrl, shortId }) {
    yield redis_1.default.set(`url:${shortId}`, originalUrl);
});
exports.saveUrl = saveUrl;
const getUrl = (shortId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redis_1.default.get(`url:${shortId}`);
});
exports.getUrl = getUrl;
