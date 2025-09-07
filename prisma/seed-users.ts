import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creando usuarios de HappyTribe...');

  // Crear usuarios de ejemplo para HappyTribe
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
    },
  });

  console.log('✅ Usuarios creados:');
  console.log(`👨‍🎓 Estudiante: ${student.email}`);
  console.log(`👨‍🏫 Profesor: ${teacher.email}`);
  console.log(`👨‍💼 Admin: ${admin.email}`);
  console.log('🔑 Contraseña para todos: happytribe123');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
