const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedHeroku() {
  try {
    console.log('🌱 Poblando base de datos en Heroku...\n');

    // Crear usuarios con tribus
    const hashedPassword = await bcrypt.hash('happytribe123', 10);

    const student = await prisma.user.upsert({
      where: { email: 'student@happytribe.com' },
      update: {},
      create: {
        email: 'student@happytribe.com',
        password: hashedPassword,
        firstName: 'Ana',
        lastName: 'García',
        role: 'student',
        status: 'active',
        hours: 20,
        tribe: 'Tigres',
      },
    });

    const teacher = await prisma.user.upsert({
      where: { email: 'teacher@happytribe.com' },
      update: {},
      create: {
        email: 'teacher@happytribe.com',
        password: hashedPassword,
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        role: 'teacher',
        status: 'active',
        hours: 40,
        tribe: 'Leones',
      },
    });

    const admin = await prisma.user.upsert({
      where: { email: 'admin@happytribe.com' },
      update: {},
      create: {
        email: 'admin@happytribe.com',
        password: hashedPassword,
        firstName: 'María',
        lastName: 'López',
        role: 'admin',
        status: 'active',
        hours: 50,
        tribe: 'Águilas',
      },
    });

    console.log('✅ Usuarios creados:');
    console.log(`👨‍🎓 Estudiante: ${student.email} - Tribu: ${student.tribe}`);
    console.log(`👨‍🏫 Profesor: ${teacher.email} - Tribu: ${teacher.tribe}`);
    console.log(`👨‍💼 Admin: ${admin.email} - Tribu: ${admin.tribe}`);

    // Verificar que se crearon correctamente
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        tribe: true,
        role: true
      }
    });

    console.log(`\n📊 Total usuarios en la base de datos: ${users.length}`);
    console.log('🔍 Usuarios con tribus:');
    users.forEach(user => {
      console.log(`   - ${user.firstName} ${user.lastName} (${user.role}): ${user.tribe}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedHeroku();
