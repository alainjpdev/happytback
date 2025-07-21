import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Middleware de validación de campos requeridos SOLO para POST y PUT /:id
function validateModuleFields(req: Request, res: Response, next: NextFunction) {
  const { title, description, url } = req.body;
  if (!title || !description || !url) {
    return res.status(400).json({ error: 'Faltan campos requeridos: title, description, url' });
  }
  next();
}

// GET /api/modules - listar módulos
router.get('/', async (_req, res) => {
  console.log('[MODULES] --- INICIO GET /api/modules ---');
  try {
    const modules = await prisma.module.findMany({
      orderBy: [{ order: 'asc' }]
    });
    console.log('[MODULES] Módulos encontrados:', modules.length);
    res.json(modules);
    console.log('[MODULES] --- FIN GET /api/modules (éxito) ---');
  } catch (error) {
    console.error('[MODULES] Error al obtener módulos:', error);
    res.status(500).json({ error: 'Error al obtener módulos' });
    console.log('[MODULES] --- FIN GET /api/modules (error) ---');
  }
});

// POST /api/modules (crear módulo)
router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  validateModuleFields,
  async (req, res) => {
    console.log('[MODULES] --- INICIO POST /api/modules ---');
    const { title, description, url } = req.body;
    try {
      const module = await prisma.module.create({
        data: {
          title,
          description,
          url,
          createdById: req.user!.id
        }
      });
      console.log('[MODULES] Módulo creado:', module.id);
      res.status(201).json(module);
      console.log('[MODULES] --- FIN POST /api/modules (éxito) ---');
    } catch (error) {
      console.error('[MODULES] Error al crear módulo:', error);
      res.status(500).json({ error: 'Error al crear módulo' });
      console.log('[MODULES] --- FIN POST /api/modules (error) ---');
    }
  }
);

// PUT /api/modules/:id (editar módulo)
router.put(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  validateModuleFields,
  async (req, res) => {
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
  }
);

// PUT /api/modules/reorder (solo admin, solo valida orderedIds)
router.put(
  '/reorder',
  authenticateToken,
  requireRole(['admin']),
  async (req, res) => {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds debe ser un array' });
    }
    try {
      await Promise.all(
        orderedIds.map((id, idx) =>
          prisma.module.update({ where: { id }, data: { order: idx } as any })
        )
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error al reordenar módulos' });
    }
  }
);

// DELETE /api/modules/:id - eliminar módulo (solo admin)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
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