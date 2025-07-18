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
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[CLASSES] --- INICIO GET /api/classes ---');
    try {
        const classes = yield prisma_1.default.class.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                module: { select: { title: true } },
                teacher: { select: { firstName: true, lastName: true } },
                teacherId: true
            }
        });
        console.log('[CLASSES] Clases encontradas:', classes.length);
        res.json(classes);
        console.log('[CLASSES] --- FIN GET /api/classes (éxito) ---');
    }
    catch (error) {
        console.error('[CLASSES] Error al obtener clases:', error);
        res.status(500).json({ error: 'Error al obtener clases' });
        console.log('[CLASSES] --- FIN GET /api/classes (error) ---');
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[CLASSES] --- INICIO PUT /api/classes/:id ---');
    const { id } = req.params;
    const { teacherId } = req.body;
    try {
        const updated = yield prisma_1.default.class.update({
            where: { id },
            data: { teacherId }
        });
        console.log('[CLASSES] Clase actualizada:', id);
        res.json(updated);
        console.log('[CLASSES] --- FIN PUT /api/classes/:id (éxito) ---');
    }
    catch (err) {
        console.error('[CLASSES] Error al actualizar la clase:', err);
        res.status(500).json({ error: 'Error al actualizar la clase' });
        console.log('[CLASSES] --- FIN PUT /api/classes/:id (error) ---');
    }
}));
exports.default = router;
