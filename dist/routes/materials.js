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
    console.log('[MATERIALS] --- INICIO GET /api/materials ---');
    try {
        const materials = yield prisma_1.default.material.findMany();
        console.log('[MATERIALS] Materiales encontrados:', materials.length);
        res.json(materials);
        console.log('[MATERIALS] --- FIN GET /api/materials (éxito) ---');
    }
    catch (error) {
        console.error('[MATERIALS] Error al obtener materiales:', error);
        res.status(500).json({ error: 'Error al obtener materiales' });
        console.log('[MATERIALS] --- FIN GET /api/materials (error) ---');
    }
}));
exports.default = router;
