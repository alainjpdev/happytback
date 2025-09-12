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
// GET /api/users - lista todos los usuarios (solo admin)
router.get('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('[USERS] --- INICIO GET /api/users ---');
    try {
        // Query directa para debug
        const users = yield prisma_1.default.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                avatar: true,
                createdAt: true,
                status: true,
                notes: true,
                hours: true,
                tribe: true,
                group_name: true
            }
        });
        console.log('[USERS] Usuarios encontrados:', users.length);
        console.log('[USERS] Primer usuario con tribu:', (_a = users[0]) === null || _a === void 0 ? void 0 : _a.tribe);
        // Verificar que el campo tribe esté presente
        const usersWithTribe = users.filter((user) => user.tribe !== null);
        console.log('[USERS] Usuarios con tribu:', usersWithTribe.length);
        res.json(users);
        console.log('[USERS] --- FIN GET /api/users (éxito) ---');
    }
    catch (error) {
        console.error('[USERS] Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
        console.log('[USERS] --- FIN GET /api/users (error) ---');
    }
}));
// GET /api/users/debug - endpoint específico para debug (solo admin)
router.get('/debug', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('[USERS] --- INICIO GET /api/users/debug ---');
    try {
        const users = yield prisma_1.default.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                avatar: true,
                createdAt: true,
                status: true,
                notes: true,
                hours: true,
                tribe: true,
                group_name: true
            }
        });
        console.log('[USERS DEBUG] Total usuarios:', users.length);
        console.log('[USERS DEBUG] Primer usuario:', users[0]);
        res.json({
            total: users.length,
            users: users,
            debug: {
                firstUserTribe: (_a = users[0]) === null || _a === void 0 ? void 0 : _a.tribe,
                usersWithTribe: users.filter((u) => u.tribe !== null).length,
                usersWithNullTribe: users.filter((u) => u.tribe === null).length
            }
        });
        console.log('[USERS] --- FIN GET /api/users/debug (éxito) ---');
    }
    catch (error) {
        console.error('[USERS] Error en debug:', error);
        res.status(500).json({ error: 'Error en debug', details: error });
        console.log('[USERS] --- FIN GET /api/users/debug (error) ---');
    }
}));
// GET /api/users/:id - obtener perfil específico (solo el propio usuario o admin)
router.get('/:id', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log('[USERS] --- INICIO GET /api/users/:id ---');
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        // Verificar permisos
        if (userId !== id && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            console.log('[USERS] Permiso denegado para ver perfil', id);
            return res.status(403).json({ error: 'No tienes permisos para ver este perfil' });
        }
        const user = yield prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                avatar: true,
                createdAt: true,
                status: true, // <-- incluir status
                notes: true, // <-- incluir notes
                hours: true, // <-- incluir hours
                tribe: true,
                group_name: true // <-- incluir tribe
            }
        });
        if (!user) {
            console.log('[USERS] Usuario no encontrado:', id);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        console.log('[USERS] Usuario encontrado:', user.email);
        res.json(user);
        console.log('[USERS] --- FIN GET /api/users/:id (éxito) ---');
    }
    catch (error) {
        console.error('[USERS] Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
        console.log('[USERS] --- FIN GET /api/users/:id (error) ---');
    }
}));
// PUT /api/users/:id - actualizar datos del usuario (solo el propio usuario o admin)
router.put('/:id', auth_1.authenticateToken, auth_1.canEditProfile, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[USERS] --- INICIO PUT /api/users/:id ---');
    const { id } = req.params;
    const { firstName, lastName, email, avatar, status, notes, hours, tribe } = req.body;
    try {
        // Verificar que el email no esté en uso por otro usuario
        if (email) {
            const existingUser = yield prisma_1.default.user.findFirst({
                where: {
                    email,
                    id: { not: id }
                }
            });
            if (existingUser) {
                console.log('[USERS] Email ya en uso:', email);
                return res.status(400).json({ error: 'El email ya está en uso por otro usuario' });
            }
        }
        const updatedUser = yield prisma_1.default.user.update({
            where: { id },
            data: { firstName, lastName, email, avatar, status, notes, hours, tribe }, // <-- permitir actualizar hours y tribe
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                avatar: true,
                createdAt: true,
                status: true, // <-- incluir status
                notes: true, // <-- incluir notes
                hours: true, // <-- incluir hours
                tribe: true,
                group_name: true // <-- incluir tribe
            }
        });
        console.log('[USERS] Usuario actualizado:', updatedUser.email);
        res.json(updatedUser);
        console.log('[USERS] --- FIN PUT /api/users/:id (éxito) ---');
    }
    catch (error) {
        console.error('[USERS] Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
        console.log('[USERS] --- FIN PUT /api/users/:id (error) ---');
    }
}));
// DELETE /api/users/:id - eliminar usuario (solo admin)
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[USERS] --- INICIO DELETE /api/users/:id ---');
    const { id } = req.params;
    try {
        yield prisma_1.default.user.delete({ where: { id } });
        console.log('[USERS] Usuario eliminado:', id);
        res.json({ success: true });
        console.log('[USERS] --- FIN DELETE /api/users/:id (éxito) ---');
    }
    catch (error) {
        if (error.code === 'P2003' || (error.message && error.message.includes('Foreign key constraint failed'))) {
            console.log('[USERS] No se puede eliminar usuario por módulos asociados:', id);
            return res.status(400).json({ error: 'No se puede eliminar el usuario porque tiene módulos asociados. Reasigna o elimina los módulos primero.' });
        }
        console.error('[USERS] Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
        console.log('[USERS] --- FIN DELETE /api/users/:id (error) ---');
    }
}));
// GET /api/users/:id/modules - módulos asignados a un usuario
router.get('/:id/modules', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log('[USERS] --- INICIO GET /api/users/:id/modules ---');
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        // Verificar permisos
        if (userId !== id && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            console.log('[USERS] Permiso denegado para ver módulos del usuario:', id);
            return res.status(403).json({ error: 'No autorizado' });
        }
        const userModules = yield prisma_1.default.userModule.findMany({
            where: { userId: id },
            include: { module: true }
        });
        console.log('[USERS] Módulos encontrados para usuario:', id, '- Cantidad:', userModules.length);
        res.json(userModules.map((um) => um.module));
        console.log('[USERS] --- FIN GET /api/users/:id/modules (éxito) ---');
    }
    catch (error) {
        console.error('[USERS] Error al obtener módulos del usuario:', error);
        res.status(500).json({ error: 'Error al obtener módulos del usuario' });
        console.log('[USERS] --- FIN GET /api/users/:id/modules (error) ---');
    }
}));
// PUT /api/users/:id/modules - actualizar módulos asignados a un usuario
router.put('/:id/modules', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[USERS] --- INICIO PUT /api/users/:id/modules ---');
    const { id } = req.params;
    const { moduleIds } = req.body;
    try {
        if (!Array.isArray(moduleIds)) {
            console.log('[USERS] moduleIds debe ser un array:', typeof moduleIds);
            return res.status(400).json({ error: 'moduleIds debe ser un array' });
        }
        // Elimina los módulos actuales
        yield prisma_1.default.userModule.deleteMany({ where: { userId: id } });
        console.log('[USERS] Módulos actuales eliminados para usuario:', id);
        // Asigna los nuevos módulos
        yield prisma_1.default.userModule.createMany({
            data: moduleIds.map((moduleId) => ({ userId: id, moduleId })),
            skipDuplicates: true
        });
        console.log('[USERS] Nuevos módulos asignados al usuario:', id, '- Cantidad:', moduleIds.length);
        res.json({ success: true });
        console.log('[USERS] --- FIN PUT /api/users/:id/modules (éxito) ---');
    }
    catch (error) {
        console.error('[USERS] Error al actualizar módulos del usuario:', error);
        res.status(500).json({ error: 'Error al actualizar módulos del usuario' });
        console.log('[USERS] --- FIN PUT /api/users/:id/modules (error) ---');
    }
}));
exports.default = router;
