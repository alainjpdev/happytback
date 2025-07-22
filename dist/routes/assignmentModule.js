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
const prisma_1 = __importDefault(require("../prisma"));
const router = (0, express_1.Router)();
// POST /api/assignment-module
// Body: { userId, moduleId, content }
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, moduleId, content } = req.body;
    if (!userId || !moduleId || !content) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    try {
        const assignment = yield prisma_1.default.assignmentModule.upsert({
            where: { userId_moduleId: { userId, moduleId } },
            update: { content },
            create: { userId, moduleId, content },
        });
        res.json(assignment);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al guardar assignment', details: error });
    }
}));
// GET /api/assignment-module?userId=...&moduleId=...
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, moduleId } = req.query;
    if (!userId || !moduleId) {
        return res.status(400).json({ error: 'Faltan parámetros' });
    }
    try {
        const assignment = yield prisma_1.default.assignmentModule.findUnique({
            where: { userId_moduleId: { userId: String(userId), moduleId: String(moduleId) } },
        });
        res.json(assignment);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al consultar assignment', details: error });
    }
}));
exports.default = router;
