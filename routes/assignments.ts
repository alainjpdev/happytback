import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

router.get('/', async (_req, res) => {
  console.log('[ASSIGNMENTS] --- INICIO GET /api/assignments ---');
  try {
    const assignments = await prisma.assignment.findMany();
    console.log('[ASSIGNMENTS] Asignaciones encontradas:', assignments.length);
    res.json(assignments);
    console.log('[ASSIGNMENTS] --- FIN GET /api/assignments (éxito) ---');
  } catch (error) {
    console.error('[ASSIGNMENTS] Error al obtener asignaciones:', error);
    res.status(500).json({ error: 'Error al obtener asignaciones' });
    console.log('[ASSIGNMENTS] --- FIN GET /api/assignments (error) ---');
  }
});

export default router; 