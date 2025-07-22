import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// POST /api/assignment-module
// Body: { userId, moduleId, content }
router.post('/', async (req, res) => {
  const { userId, moduleId, content } = req.body;
  if (!userId || !moduleId || !content) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  try {
    const assignment = await prisma.assignmentModule.upsert({
      where: { userId_moduleId: { userId, moduleId } },
      update: { content },
      create: { userId, moduleId, content },
    });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar assignment', details: error });
  }
});

// GET /api/assignment-module?userId=...&moduleId=...
router.get('/', async (req, res) => {
  const { userId, moduleId } = req.query;
  if (!userId || !moduleId) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }
  try {
    const assignment = await prisma.assignmentModule.findUnique({
      where: { userId_moduleId: { userId: String(userId), moduleId: String(moduleId) } },
    });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar assignment', details: error });
  }
});

export default router; 