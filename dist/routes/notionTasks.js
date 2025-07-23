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
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
// GET /api/notion/tasks
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const notionToken = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!notionToken || !databaseId) {
        return res.status(500).json({ error: 'Faltan variables de entorno NOTION_TOKEN o NOTION_DATABASE_ID' });
    }
    try {
        const response = yield axios_1.default.post(`https://api.notion.com/v1/databases/${databaseId}/query`, {}, {
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al consultar Notion', details: ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message });
    }
}));
// GET /api/notion/tasks/:id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const notionToken = process.env.NOTION_TOKEN;
    if (!notionToken) {
        return res.status(500).json({ error: 'Falta NOTION_TOKEN' });
    }
    try {
        const response = yield axios_1.default.get(`https://api.notion.com/v1/pages/${id}`, {
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al consultar tarea de Notion', details: ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message });
    }
}));
exports.default = router;
