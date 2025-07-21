import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, canEditProfile, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/users - lista todos los usuarios (solo admin)
router.get('/', authenticateToken, requireRole(['admin']), async (_req, res) => {
  console.log('[USERS] --- INICIO GET /api/users ---');
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        createdAt: true,
        status: true, // <-- incluir status
        notes: true,  // <-- incluir notes
        hours: true   // <-- incluir hours
      }
    });
    console.log('[USERS] Usuarios encontrados:', users.length);
    res.json(users);
    console.log('[USERS] --- FIN GET /api/users (éxito) ---');
  } catch (error) {
    console.error('[USERS] Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
    console.log('[USERS] --- FIN GET /api/users (error) ---');
  }
});

// GET /api/users/:id - obtener perfil específico (solo el propio usuario o admin)
router.get('/:id', authenticateToken, async (req, res) => {
  console.log('[USERS] --- INICIO GET /api/users/:id ---');
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    // Verificar permisos
    if (userId !== id && req.user?.role !== 'admin') {
      console.log('[USERS] Permiso denegado para ver perfil', id);
      return res.status(403).json({ error: 'No tienes permisos para ver este perfil' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        createdAt: true,
        status: true, // <-- incluir status
        notes: true,  // <-- incluir notes
        hours: true   // <-- incluir hours
      }
    });

    if (!user) {
      console.log('[USERS] Usuario no encontrado:', id);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    console.log('[USERS] Usuario encontrado:', user.email);
    res.json(user);
    console.log('[USERS] --- FIN GET /api/users/:id (éxito) ---');
  } catch (error) {
    console.error('[USERS] Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
    console.log('[USERS] --- FIN GET /api/users/:id (error) ---');
  }
});

// PUT /api/users/:id - actualizar datos del usuario (solo el propio usuario o admin)
router.put('/:id', authenticateToken, canEditProfile, async (req, res) => {
  console.log('[USERS] --- INICIO PUT /api/users/:id ---');
  const { id } = req.params;
  const { firstName, lastName, email, avatar, status, notes, hours } = req.body;
  
  try {
    // Verificar que el email no esté en uso por otro usuario
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id }
        }
      });
      
      if (existingUser) {
        console.log('[USERS] Email ya en uso:', email);
        return res.status(400).json({ error: 'El email ya está en uso por otro usuario' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, email, avatar, status, notes, hours }, // <-- permitir actualizar hours
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        createdAt: true,
        status: true, // <-- incluir status
        notes: true,  // <-- incluir notes
        hours: true   // <-- incluir hours
      }
    });
    console.log('[USERS] Usuario actualizado:', updatedUser.email);
    res.json(updatedUser);
    console.log('[USERS] --- FIN PUT /api/users/:id (éxito) ---');
  } catch (error) {
    console.error('[USERS] Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
    console.log('[USERS] --- FIN PUT /api/users/:id (error) ---');
  }
});

// DELETE /api/users/:id - eliminar usuario (solo admin)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  console.log('[USERS] --- INICIO DELETE /api/users/:id ---');
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    console.log('[USERS] Usuario eliminado:', id);
    res.json({ success: true });
    console.log('[USERS] --- FIN DELETE /api/users/:id (éxito) ---');
  } catch (error: any) {
    if (error.code === 'P2003' || (error.message && error.message.includes('Foreign key constraint failed'))) {
      console.log('[USERS] No se puede eliminar usuario por módulos asociados:', id);
      return res.status(400).json({ error: 'No se puede eliminar el usuario porque tiene módulos asociados. Reasigna o elimina los módulos primero.' });
    }
    console.error('[USERS] Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
    console.log('[USERS] --- FIN DELETE /api/users/:id (error) ---');
  }
});

// GET /api/users/:id/modules - módulos asignados a un usuario
router.get('/:id/modules', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { id } = req.params;
  const userModules = await prisma.userModule.findMany({
    where: { userId: id },
    include: { module: true }
  });
  res.json(userModules.map(um => um.module));
});

// PUT /api/users/:id/modules - actualizar módulos asignados a un usuario
router.put('/:id/modules', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { id } = req.params;
  const { moduleIds } = req.body;
  if (!Array.isArray(moduleIds)) return res.status(400).json({ error: 'moduleIds debe ser un array' });

  // Elimina los módulos actuales
  await prisma.userModule.deleteMany({ where: { userId: id } });
  // Asigna los nuevos módulos
  await prisma.userModule.createMany({
    data: moduleIds.map((moduleId: string) => ({ userId: id, moduleId })),
    skipDuplicates: true
  });
  res.json({ success: true });
});

export default router; 