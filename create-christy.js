const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creando usuario admin Christy Crawford...');

  const hashedPassword = await bcrypt.hash('happytribe123', 10);

  const christyAdmin = await prisma.user.upsert({
    where: { email: 'christy@happytribe.com' },
    update: {},
    create: {
      email: 'christy@happytribe.com',
      password: hashedPassword,
      firstName: 'Christy',
      lastName: 'Crawford',
      role: 'admin',
      status: 'active',
      hours: 50,
      tribe: 'Águilas',
      group_name: 'Grupo Administradores',
    },
  });

  console.log('✅ Usuario admin creado:');
  console.log(`👨‍💼 Admin: ${christyAdmin.email} - Nombre: ${christyAdmin.firstName} ${christyAdmin.lastName}`);
  console.log(`🏷️ Tribu: ${christyAdmin.tribe} - Grupo: ${christyAdmin.group_name}`);
  console.log('🔑 Contraseña: happytribe123');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
