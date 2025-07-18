import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

router.get('/', async (_req, res) => {
  console.log('[MODULES] --- INICIO GET /api/modules ---');
  try {
    const modules = await prisma.module.findMany(); // url ya está incluido por defecto
    console.log('[MODULES] Módulos encontrados:', modules.length);
    res.json(modules); // No se requiere cambio si se usa findMany() directo
    console.log('[MODULES] --- FIN GET /api/modules (éxito) ---');
  } catch (error) {
    console.error('[MODULES] Error al obtener módulos:', error);
    res.status(500).json({ error: 'Error al obtener módulos' });
    console.log('[MODULES] --- FIN GET /api/modules (error) ---');
  }
});

// PUT /api/modules/:id - editar módulo
router.put('/:id', async (req, res) => {
  console.log('[MODULES] --- INICIO PUT /api/modules/:id ---');
  const { id } = req.params;
  const { title, description, url } = req.body;
  try {
    const updated = await prisma.module.update({
      where: { id },
      data: { title, description, url }
    });
    console.log('[MODULES] Módulo actualizado:', id);
    res.json(updated);
    console.log('[MODULES] --- FIN PUT /api/modules/:id (éxito) ---');
  } catch (err) {
    console.error('[MODULES] Error al actualizar módulo:', err);
    res.status(500).json({ error: 'Error al actualizar módulo' });
    console.log('[MODULES] --- FIN PUT /api/modules/:id (error) ---');
  }
});

// DELETE /api/modules/:id - eliminar módulo
router.delete('/:id', async (req, res) => {
  console.log('[MODULES] --- INICIO DELETE /api/modules/:id ---');
  const { id } = req.params;
  try {
    await prisma.module.delete({ where: { id } });
    console.log('[MODULES] Módulo eliminado:', id);
    res.json({ success: true });
    console.log('[MODULES] --- FIN DELETE /api/modules/:id (éxito) ---');
  } catch (err) {
    console.error('[MODULES] Error al eliminar módulo:', err);
    res.status(500).json({ error: 'Error al eliminar módulo' });
    console.log('[MODULES] --- FIN DELETE /api/modules/:id (error) ---');
  }
});

export default router; 