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
      tribe: 'Tigres',
      group_name: 'Grupo A',
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
      group_name: 'Grupo B',
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
      group_name: 'Grupo C',
    },
  });

  console.log('✅ Usuarios creados:');
  console.log(`👨‍🎓 Estudiante: ${student.email} - Tribu: ${student.tribe}`);
  console.log(`👨‍🏫 Profesor: ${teacher.email} - Tribu: ${teacher.tribe}`);
  console.log(`👨‍💼 Admin: ${admin.email} - Tribu: ${admin.tribe}`);
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
