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
  console.log('[USERS] ===========================================');
  console.log('[USERS] --- INICIO GET /api/users ---');
  console.log('[USERS] Timestamp:', new Date().toISOString());
  console.log('[USERS] Environment:', process.env.NODE_ENV);
  console.log('[USERS] ===========================================');
  
  try {
    console.log('[USERS] Paso 1: Verificando conexión a Prisma...');
    await prisma.$connect();
    console.log('[USERS] ✅ Conexión a Prisma exitosa');
    
    console.log('[USERS] Paso 2: Preparando consulta...');
    const queryConfig = {
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        createdAt: true,
        status: true,
        notes: true,
        hours: true,
        tribe: true,
        group_name: true
      }
    };
    console.log('[USERS] Configuración de consulta:', JSON.stringify(queryConfig, null, 2));
    
    console.log('[USERS] Paso 3: Ejecutando consulta findMany...');
    const users = await prisma.user.findMany(queryConfig);
    console.log('[USERS] ✅ Consulta ejecutada exitosamente');
    
    console.log('[USERS] Paso 4: Analizando resultados...');
    console.log('[USERS] Total usuarios encontrados:', users.length);
    
    if (users.length > 0) {
      console.log('[USERS] Primer usuario (completo):', JSON.stringify(users[0], null, 2));
      console.log('[USERS] Primer usuario - tribe:', users[0]?.tribe);
      console.log('[USERS] Primer usuario - group_name:', users[0]?.group_name);
    }
    
    // Verificar que el campo tribe esté presente
    const usersWithTribe = users.filter((user: any) => user.tribe !== null);
    const usersWithGroupName = users.filter((user: any) => user.group_name !== null);
    console.log('[USERS] Usuarios con tribu:', usersWithTribe.length);
    console.log('[USERS] Usuarios con group_name:', usersWithGroupName.length);
    
    console.log('[USERS] Paso 5: Preparando respuesta...');
    const response = {
      success: true,
      count: users.length,
      users: users,
      debug: {
        usersWithTribe: usersWithTribe.length,
        usersWithGroupName: usersWithGroupName.length,
        firstUserTribe: users[0]?.tribe,
        firstUserGroupName: users[0]?.group_name
      }
    };
    
    console.log('[USERS] Respuesta preparada, enviando...');
    res.json(response);
    console.log('[USERS] ✅ Respuesta enviada exitosamente');
    console.log('[USERS] --- FIN GET /api/users (éxito) ---');
    console.log('[USERS] ===========================================');
    
  } catch (error: any) {
    console.error('[USERS] ❌ ERROR DETECTADO:');
    console.error('[USERS] Error type:', error.constructor.name);
    console.error('[USERS] Error message:', error.message);
    console.error('[USERS] Error code:', error.code);
    console.error('[USERS] Error stack:', error.stack);
    console.error('[USERS] Error details:', JSON.stringify(error, null, 2));
    
    res.status(500).json({ 
      error: 'Error al obtener usuarios',
      details: error.message,
      type: error.constructor.name,
      code: error.code
    });
    console.log('[USERS] --- FIN GET /api/users (error) ---');
    console.log('[USERS] ===========================================');
  }
});

// GET /api/users/test - endpoint simple para debug (solo admin)
router.get('/test', authenticateToken, requireRole(['admin']), async (_req: Request, res: Response) => {
  console.log('[USERS TEST] --- INICIO GET /api/users/test ---');
  try {
    res.json({ 
      message: 'Test endpoint funciona',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
    console.log('[USERS TEST] --- FIN GET /api/users/test (éxito) ---');
  } catch (error) {
    console.error('[USERS TEST] Error en test:', error);
    res.status(500).json({ error: 'Error en test' });
    console.log('[USERS TEST] --- FIN GET /api/users/test (error) ---');
  }
});

// GET /api/users/prisma-test - endpoint para probar Prisma paso a paso (solo admin)
router.get('/prisma-test', authenticateToken, requireRole(['admin']), async (_req: Request, res: Response) => {
  console.log('[USERS PRISMA] --- INICIO GET /api/users/prisma-test ---');
  try {
    // Paso 1: Verificar conexión
    console.log('[USERS PRISMA] Paso 1: Verificando conexión...');
    await prisma.$connect();
    console.log('[USERS PRISMA] ✅ Conexión exitosa');

    // Paso 2: Consulta simple
    console.log('[USERS PRISMA] Paso 2: Consulta simple...');
    const simpleQuery = await prisma.user.findFirst({
      select: { id: true, firstName: true, tribe: true, group_name: true }
    });
    console.log('[USERS PRISMA] ✅ Consulta simple exitosa:', simpleQuery);

    // Paso 3: Consulta con todos los campos
    console.log('[USERS PRISMA] Paso 3: Consulta con todos los campos...');
    const fullQuery = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        createdAt: true,
        status: true,
        notes: true,
        hours: true,
        tribe: true,
        group_name: true
      },
      take: 2
    });
    console.log('[USERS PRISMA] ✅ Consulta completa exitosa, usuarios:', fullQuery.length);

    res.json({
      message: 'Prisma test exitoso',
      simpleQuery,
      fullQuery,
      timestamp: new Date().toISOString()
    });
    console.log('[USERS PRISMA] --- FIN GET /api/users/prisma-test (éxito) ---');
  } catch (error: any) {
    console.error('[USERS PRISMA] Error en prisma test:', error);
    console.error('[USERS PRISMA] Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Error en prisma test', 
      details: error.message,
      stack: error.stack
    });
    console.log('[USERS PRISMA] --- FIN GET /api/users/prisma-test (error) ---');
  }
});

// GET /api/users/debug - endpoint específico para debug (solo admin)
router.get('/debug', authenticateToken, requireRole(['admin']), async (_req: Request, res: Response) => {
  console.log('[USERS] --- INICIO GET /api/users/debug ---');
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
        status: true,
        notes: true,
        hours: true,
        tribe: true,
        group_name: true
      }
    });
    
    console.log('[USERS DEBUG] Total usuarios:', users.length);
    console.log('[USERS DEBUG] Primer usuario:', users[0]);
    
    res.json({
      total: users.length,
      users: users,
      debug: {
        firstUserTribe: users[0]?.tribe,
        usersWithTribe: users.filter((u: any) => u.tribe !== null).length,
        usersWithNullTribe: users.filter((u: any) => u.tribe === null).length
      }
    });
    console.log('[USERS] --- FIN GET /api/users/debug (éxito) ---');
  } catch (error) {
    console.error('[USERS] Error en debug:', error);
    res.status(500).json({ error: 'Error en debug', details: error });
    console.log('[USERS] --- FIN GET /api/users/debug (error) ---');
  }
});

// GET /api/users/:id - obtener perfil específico (solo el propio usuario o admin)
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  console.log('[USERS_ID] ===========================================');
  console.log('[USERS_ID] --- INICIO GET /api/users/:id ---');
  console.log('[USERS_ID] Timestamp:', new Date().toISOString());
  console.log('[USERS_ID] Environment:', process.env.NODE_ENV);
  console.log('[USERS_ID] Requested ID:', req.params.id);
  console.log('[USERS_ID] User ID from token:', req.user?.id);
  console.log('[USERS_ID] User role from token:', req.user?.role);
  console.log('[USERS_ID] ===========================================');

  const { id } = req.params;
  const userId = req.user?.id;

  try {
    console.log('[USERS_ID] Paso 1: Verificando permisos...');
    // Verificar permisos
    if (userId !== id && req.user?.role !== 'admin') {
      console.log('[USERS_ID] ❌ Permiso denegado para ver perfil', id);
      console.log('[USERS_ID] User ID:', userId, 'Requested ID:', id, 'Role:', req.user?.role);
      return res.status(403).json({ error: 'No tienes permisos para ver este perfil' });
    }
    console.log('[USERS_ID] ✅ Permisos verificados correctamente');

    console.log('[USERS_ID] Paso 2: Verificando conexión a Prisma...');
    await prisma.$connect();
    console.log('[USERS_ID] ✅ Conexión a Prisma exitosa');

    console.log('[USERS_ID] Paso 3: Preparando consulta findUnique...');
    const queryConfig = {
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        createdAt: true,
        status: true,
        notes: true,
        hours: true,
        tribe: true,
        group_name: true
      }
    };
    console.log('[USERS_ID] Configuración de consulta:', JSON.stringify(queryConfig, null, 2));

    console.log('[USERS_ID] Paso 4: Ejecutando consulta findUnique...');
    const user = await prisma.user.findUnique(queryConfig);
    console.log('[USERS_ID] ✅ Consulta ejecutada exitosamente');

    console.log('[USERS_ID] Paso 5: Analizando resultado...');
    if (!user) {
      console.log('[USERS_ID] ❌ Usuario no encontrado con ID:', id);
      console.log('[USERS_ID] --- FIN GET /api/users/:id (no encontrado) ---');
      console.log('[USERS_ID] ===========================================');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('[USERS_ID] ✅ Usuario encontrado:');
    console.log('[USERS_ID] Email:', user.email);
    console.log('[USERS_ID] Nombre:', user.firstName, user.lastName);
    console.log('[USERS_ID] Tribe:', user.tribe);
    console.log('[USERS_ID] Group name:', user.group_name);
    console.log('[USERS_ID] Usuario completo:', JSON.stringify(user, null, 2));

    console.log('[USERS_ID] Paso 6: Enviando respuesta...');
    res.json(user);
    console.log('[USERS_ID] ✅ Respuesta enviada exitosamente');
    console.log('[USERS_ID] --- FIN GET /api/users/:id (éxito) ---');
    console.log('[USERS_ID] ===========================================');

  } catch (error: any) {
    console.error('[USERS_ID] ❌ ERROR DETECTADO:');
    console.error('[USERS_ID] Error type:', error.constructor.name);
    console.error('[USERS_ID] Error message:', error.message);
    console.error('[USERS_ID] Error code:', error.code);
    console.error('[USERS_ID] Error stack:', error.stack);
    console.error('[USERS_ID] Error details:', JSON.stringify(error, null, 2));
    
    res.status(500).json({ 
      error: 'Error al obtener usuario',
      details: error.message,
      type: error.constructor.name,
      code: error.code
    });
    console.log('[USERS_ID] --- FIN GET /api/users/:id (error) ---');
    console.log('[USERS_ID] ===========================================');
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
        tribe: true,
        group_name: true   // <-- incluir tribe
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