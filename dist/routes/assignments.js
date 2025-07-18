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
    console.log('[ASSIGNMENTS] --- INICIO GET /api/assignments ---');
    try {
        const assignments = yield prisma_1.default.assignment.findMany();
        console.log('[ASSIGNMENTS] Asignaciones encontradas:', assignments.length);
        res.json(assignments);
        console.log('[ASSIGNMENTS] --- FIN GET /api/assignments (éxito) ---');
    }
    catch (error) {
        console.error('[ASSIGNMENTS] Error al obtener asignaciones:', error);
        res.status(500).json({ error: 'Error al obtener asignaciones' });
        console.log('[ASSIGNMENTS] --- FIN GET /api/assignments (error) ---');
    }
}));
exports.default = router;
