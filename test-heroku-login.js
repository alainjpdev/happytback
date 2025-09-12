const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Probando login en Heroku...\n');

    // Verificar usuarios existentes
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        tribe: true
      }
    });

    console.log(`📊 Total usuarios: ${users.length}`);
    
    // Probar login con admin
    const admin = users.find(u => u.email === 'admin@happytribe.com');
    if (admin) {
      console.log(`\n👤 Usuario admin encontrado: ${admin.firstName} ${admin.lastName}`);
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🔑 Password hash: ${admin.password.substring(0, 20)}...`);
      console.log(`🏷️  Tribu: ${admin.tribe}`);
      
      // Verificar contraseña
      const isValid = await bcrypt.compare('happytribe123', admin.password);
      console.log(`✅ Contraseña válida: ${isValid}`);
    } else {
      console.log('❌ Usuario admin no encontrado');
    }

    // Crear un usuario de prueba si no existe
    if (!admin) {
      console.log('\n🔧 Creando usuario admin...');
      const hashedPassword = await bcrypt.hash('happytribe123', 10);
      
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@happytribe.com',
          password: hashedPassword,
          firstName: 'María',
          lastName: 'López',
          role: 'admin',
          status: 'active',
          hours: 50,
          tribe: 'Águilas',
        }
      });
      
      console.log('✅ Usuario admin creado:', newAdmin.email);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
