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
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/modules - listar módulos
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[MODULES] --- INICIO GET /api/modules ---');
    try {
        const modules = yield prisma_1.default.module.findMany({ orderBy: { order: 'asc' } });
        console.log('[MODULES] Módulos encontrados:', modules.length);
        res.json(modules);
        console.log('[MODULES] --- FIN GET /api/modules (éxito) ---');
    }
    catch (error) {
        console.error('[MODULES] Error al obtener módulos:', error);
        res.status(500).json({ error: 'Error al obtener módulos' });
        console.log('[MODULES] --- FIN GET /api/modules (error) ---');
    }
}));
// POST /api/modules - crear módulo (solo admin)
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[MODULES] --- INICIO POST /api/modules ---');
    const { title, description, url } = req.body;
    if (!title || !description || !url) {
        return res.status(400).json({ error: 'Faltan campos requeridos: title, description, url' });
    }
    try {
        const module = yield prisma_1.default.module.create({
            data: {
                title,
                description,
                url,
                createdById: req.user.id
            }
        });
        console.log('[MODULES] Módulo creado:', module.id);
        res.status(201).json(module);
        console.log('[MODULES] --- FIN POST /api/modules (éxito) ---');
    }
    catch (error) {
        console.error('[MODULES] Error al crear módulo:', error);
        res.status(500).json({ error: 'Error al crear módulo' });
        console.log('[MODULES] --- FIN POST /api/modules (error) ---');
    }
}));
// PUT /api/modules/:id - editar módulo (solo admin)
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[MODULES] --- INICIO PUT /api/modules/:id ---');
    const { id } = req.params;
    const { title, description, url } = req.body;
    if (!title || !description || !url) {
        return res.status(400).json({ error: 'Faltan campos requeridos: title, description, url' });
    }
    try {
        const updated = yield prisma_1.default.module.update({
            where: { id },
            data: { title, description, url }
        });
        console.log('[MODULES] Módulo actualizado:', id);
        res.json(updated);
        console.log('[MODULES] --- FIN PUT /api/modules/:id (éxito) ---');
    }
    catch (err) {
        console.error('[MODULES] Error al actualizar módulo:', err);
        res.status(500).json({ error: 'Error al actualizar módulo' });
        console.log('[MODULES] --- FIN PUT /api/modules/:id (error) ---');
    }
}));
// PUT /api/modules/reorder - actualizar orden de módulos (solo admin)
router.put('/reorder', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds))
        return res.status(400).json({ error: 'orderedIds debe ser un array' });
    try {
        yield Promise.all(orderedIds.map((id, idx) => prisma_1.default.module.update({ where: { id }, data: { order: idx } })));
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: 'Error al reordenar módulos' });
    }
}));
// DELETE /api/modules/:id - eliminar módulo (solo admin)
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[MODULES] --- INICIO DELETE /api/modules/:id ---');
    const { id } = req.params;
    try {
        yield prisma_1.default.module.delete({ where: { id } });
        console.log('[MODULES] Módulo eliminado:', id);
        res.json({ success: true });
        console.log('[MODULES] --- FIN DELETE /api/modules/:id (éxito) ---');
    }
    catch (err) {
        console.error('[MODULES] Error al eliminar módulo:', err);
        res.status(500).json({ error: 'Error al eliminar módulo' });
        console.log('[MODULES] --- FIN DELETE /api/modules/:id (error) ---');
    }
}));
exports.default = router;
