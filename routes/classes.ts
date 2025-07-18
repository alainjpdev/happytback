import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

router.get('/', async (_req, res) => {
  console.log('[CLASSES] --- INICIO GET /api/classes ---');
  try {
    const classes = await prisma.class.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        module: { select: { title: true } },
        teacher: { select: { firstName: true, lastName: true } },
        teacherId: true
      }
    });
    console.log('[CLASSES] Clases encontradas:', classes.length);
    res.json(classes);
    console.log('[CLASSES] --- FIN GET /api/classes (éxito) ---');
  } catch (error) {
    console.error('[CLASSES] Error al obtener clases:', error);
    res.status(500).json({ error: 'Error al obtener clases' });
    console.log('[CLASSES] --- FIN GET /api/classes (error) ---');
  }
});

router.put('/:id', async (req, res) => {
  console.log('[CLASSES] --- INICIO PUT /api/classes/:id ---');
  const { id } = req.params;
  const { teacherId } = req.body;
  try {
    const updated = await prisma.class.update({
      where: { id },
      data: { teacherId }
    });
    console.log('[CLASSES] Clase actualizada:', id);
    res.json(updated);
    console.log('[CLASSES] --- FIN PUT /api/classes/:id (éxito) ---');
  } catch (err) {
    console.error('[CLASSES] Error al actualizar la clase:', err);
    res.status(500).json({ error: 'Error al actualizar la clase' });
    console.log('[CLASSES] --- FIN PUT /api/classes/:id (error) ---');
  }
});

export default router; 