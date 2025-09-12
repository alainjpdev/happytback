const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTribes() {
  try {
    console.log('🔍 Verificando tribus en la base de datos...');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        tribe: true,
        role: true
      },
      orderBy: { firstName: 'asc' }
    });

    console.log(`\n📊 Total de usuarios: ${users.length}`);
    console.log('\n🏹 Usuarios con tribu asignada:');
    
    const usersWithTribe = users.filter(user => user.tribe);
    console.log(`Total con tribu: ${usersWithTribe.length}`);
    
    usersWithTribe.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Tribu: ${user.tribe}`);
    });

    console.log('\n❌ Usuarios sin tribu:');
    const usersWithoutTribe = users.filter(user => !user.tribe);
    console.log(`Total sin tribu: ${usersWithoutTribe.length}`);
    
    usersWithoutTribe.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Rol: ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTribes();
