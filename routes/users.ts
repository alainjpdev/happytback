import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { authenticateToken, canEditProfile, requireRole } from '../middleware/auth';

// Extender el tipo Request para incluir user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
  params: any;
  body: any;
}

const router = Router();

// GET /api/users - lista todos los usuarios (solo admin)
router.get('/', authenticateToken, requireRole(['admin']), async (_req: Request, res: Response) => {
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
        hours: true,  // <-- incluir hours
        tribe: true   // <-- incluir tribe
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
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
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
        hours: true,  // <-- incluir hours
        tribe: true   // <-- incluir tribe
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
router.put('/:id', authenticateToken, canEditProfile, async (req: AuthenticatedRequest, res: Response) => {
  console.log('[USERS] --- INICIO PUT /api/users/:id ---');
  const { id } = req.params;
  const { firstName, lastName, email, avatar, status, notes, hours, tribe } = req.body;
  
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
      data: { firstName, lastName, email, avatar, status, notes, hours, tribe }, // <-- permitir actualizar hours y tribe
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
        hours: true,  // <-- incluir hours
        tribe: true   // <-- incluir tribe
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
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req: Request, res: Response) => {
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
router.get('/:id/modules', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  console.log('[USERS] --- INICIO GET /api/users/:id/modules ---');
  const { id } = req.params;
  const userId = req.user?.id;
  
  try {
    // Verificar permisos
    if (userId !== id && req.user?.role !== 'admin') {
      console.log('[USERS] Permiso denegado para ver módulos del usuario:', id);
      return res.status(403).json({ error: 'No autorizado' });
    }

    const userModules = await prisma.userModule.findMany({
      where: { userId: id },
      include: { module: true }
    });
    
    console.log('[USERS] Módulos encontrados para usuario:', id, '- Cantidad:', userModules.length);
    res.json(userModules.map((um: any) => um.module));
    console.log('[USERS] --- FIN GET /api/users/:id/modules (éxito) ---');
  } catch (error) {
    console.error('[USERS] Error al obtener módulos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener módulos del usuario' });
    console.log('[USERS] --- FIN GET /api/users/:id/modules (error) ---');
  }
});

// PUT /api/users/:id/modules - actualizar módulos asignados a un usuario
router.put('/:id/modules', authenticateToken, requireRole(['admin']), async (req: Request, res: Response) => {
  console.log('[USERS] --- INICIO PUT /api/users/:id/modules ---');
  const { id } = req.params;
  const { moduleIds } = req.body;
  
  try {
    if (!Array.isArray(moduleIds)) {
      console.log('[USERS] moduleIds debe ser un array:', typeof moduleIds);
      return res.status(400).json({ error: 'moduleIds debe ser un array' });
    }

    // Elimina los módulos actuales
    await prisma.userModule.deleteMany({ where: { userId: id } });
    console.log('[USERS] Módulos actuales eliminados para usuario:', id);
    
    // Asigna los nuevos módulos
    await prisma.userModule.createMany({
      data: moduleIds.map((moduleId: string) => ({ userId: id, moduleId })),
      skipDuplicates: true
    });
    
    console.log('[USERS] Nuevos módulos asignados al usuario:', id, '- Cantidad:', moduleIds.length);
    res.json({ success: true });
    console.log('[USERS] --- FIN PUT /api/users/:id/modules (éxito) ---');
  } catch (error) {
    console.error('[USERS] Error al actualizar módulos del usuario:', error);
    res.status(500).json({ error: 'Error al actualizar módulos del usuario' });
    console.log('[USERS] --- FIN PUT /api/users/:id/modules (error) ---');
  }
});

export default router; 