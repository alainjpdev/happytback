const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkHerokuTribes() {
  try {
    console.log('🔍 Verificando tribus en Heroku...\n');

    const users = await prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        email: true,
        tribe: true,
        role: true
      },
      orderBy: { firstName: 'asc' }
    });

    console.log(`📊 Total de usuarios: ${users.length}`);
    
    const usersWithTribe = users.filter(user => user.tribe);
    console.log(`🏹 Usuarios con tribu: ${usersWithTribe.length}`);
    
    if (usersWithTribe.length > 0) {
      console.log('\n✅ Usuarios con tribu asignada:');
      usersWithTribe.forEach(user => {
        console.log(`   - ${user.firstName} ${user.lastName}: ${user.tribe}`);
      });
    }

    const usersWithoutTribe = users.filter(user => !user.tribe);
    console.log(`\n❌ Usuarios sin tribu: ${usersWithoutTribe.length}`);
    
    if (usersWithoutTribe.length > 0) {
      console.log('\nUsuarios sin tribu:');
      usersWithoutTribe.forEach(user => {
        console.log(`   - ${user.firstName} ${user.lastName}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHerokuTribes();
