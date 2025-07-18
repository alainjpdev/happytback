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
exports.requireRole = exports.canEditProfile = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
// Middleware para verificar JWT token
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Verificar que el usuario existe en la base de datos
        const user = yield prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true }
        });
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Token inválido' });
    }
});
exports.authenticateToken = authenticateToken;
// Middleware para verificar si el usuario puede editar su propio perfil
const canEditProfile = (req, res, next) => {
    var _a, _b;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    // Permitir que el usuario edite su propio perfil
    if (userId === id) {
        return next();
    }
    // Permitir que admin edite cualquier perfil
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'No tienes permisos para editar este perfil' });
};
exports.canEditProfile = canEditProfile;
// Middleware para verificar roles específicos
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
        }
        next();
    };
};
exports.requireRole = requireRole;
