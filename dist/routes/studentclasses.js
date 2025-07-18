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
// GET /api/studentclasses
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[STUDENTCLASSES] --- INICIO GET /api/studentclasses ---');
    try {
        const studentclasses = yield prisma_1.default.studentClass.findMany({
            include: {
                student: { select: { id: true, firstName: true, lastName: true, email: true } },
                class: { select: { id: true, title: true, description: true } }
            }
        });
        console.log('[STUDENTCLASSES] Inscripciones encontradas:', studentclasses.length);
        res.json(studentclasses);
        console.log('[STUDENTCLASSES] --- FIN GET /api/studentclasses (éxito) ---');
    }
    catch (error) {
        console.error('[STUDENTCLASSES] Error al obtener inscripciones:', error);
        res.status(500).json({ error: 'Error al obtener inscripciones' });
        console.log('[STUDENTCLASSES] --- FIN GET /api/studentclasses (error) ---');
    }
}));
exports.default = router;
