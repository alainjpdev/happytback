const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixPasswords() {
  try {
    console.log('🔧 Corrigiendo contraseñas en Heroku...\n');

    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true
      }
    });

    console.log(`📊 Total usuarios: ${users.length}`);

    // Corregir contraseñas
    for (const user of users) {
      // Verificar si la contraseña ya está hasheada
      const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
      
      if (!isHashed) {
        console.log(`🔧 Corrigiendo contraseña para: ${user.firstName} ${user.lastName}`);
        const hashedPassword = await bcrypt.hash('happytribe123', 10);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
        
        console.log(`✅ Contraseña corregida para: ${user.email}`);
      } else {
        console.log(`⏭️  Contraseña ya está hasheada para: ${user.email}`);
      }
    }

    // Verificar que el admin funciona
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@happytribe.com' }
    });

    if (admin) {
      const isValid = await bcrypt.compare('happytribe123', admin.password);
      console.log(`\n✅ Login del admin funciona: ${isValid}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPasswords();
