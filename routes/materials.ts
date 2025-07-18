import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

router.get('/', async (_req, res) => {
  console.log('[MATERIALS] --- INICIO GET /api/materials ---');
  try {
    const materials = await prisma.material.findMany();
    console.log('[MATERIALS] Materiales encontrados:', materials.length);
    res.json(materials);
    console.log('[MATERIALS] --- FIN GET /api/materials (éxito) ---');
  } catch (error) {
    console.error('[MATERIALS] Error al obtener materiales:', error);
    res.status(500).json({ error: 'Error al obtener materiales' });
    console.log('[MATERIALS] --- FIN GET /api/materials (error) ---');
  }
});

export default router; 