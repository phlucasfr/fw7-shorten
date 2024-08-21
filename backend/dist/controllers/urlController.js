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
exports.urlRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const urlService_1 = require("../services/urlService");
exports.urlRouter = (0, express_1.Router)();
exports.urlRouter.post('/shorten', (0, express_validator_1.body)('url').isURL().withMessage('Invalid URL format'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { url } = req.body;
    if (typeof url !== 'string') {
        return res.status(400).json({ error: 'Invalid URL format' });
    }
    if (req.remainingUrls === undefined) {
        return res.status(429).json({ error: 'Você não possui encurtamentos disponíveis.' });
    }
    try {
        const result = yield (0, urlService_1.shortenUrlService)(url, req.remainingUrls);
        return res.status(201).json(result);
    }
    catch (error) {
        console.error('Error shortening URL:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}));
exports.urlRouter.get('/:shortId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortId } = req.params;
    try {
        const originalUrl = yield (0, urlService_1.getUrlService)(shortId);
        if (originalUrl) {
            return res.json({ originalUrl });
        }
        else {
            return res.status(404).json({ error: 'URL not found' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}));
