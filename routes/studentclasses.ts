import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /api/studentclasses
router.get('/', async (_req, res) => {
  console.log('[STUDENTCLASSES] --- INICIO GET /api/studentclasses ---');
  try {
    const studentclasses = await prisma.studentClass.findMany({
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true } },
        class: { select: { id: true, title: true, description: true } }
      }
    });
    console.log('[STUDENTCLASSES] Inscripciones encontradas:', studentclasses.length);
    res.json(studentclasses);
    console.log('[STUDENTCLASSES] --- FIN GET /api/studentclasses (éxito) ---');
  } catch (error) {
    console.error('[STUDENTCLASSES] Error al obtener inscripciones:', error);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
    console.log('[STUDENTCLASSES] --- FIN GET /api/studentclasses (error) ---');
  }
});

export default router; 