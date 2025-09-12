const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUsersQuery() {
  try {
    console.log('🔍 Probando consulta exacta del endpoint /api/users...\n');

    // Usar la misma consulta que el endpoint de usuarios
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
        tribe: true
      }
    });

    console.log(`📊 Total de usuarios encontrados: ${users.length}`);
    console.log('\n🔍 Primeros 3 usuarios:');
    
    users.slice(0, 3).forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Tribu: ${user.tribe}`);
      console.log(`   Estado: ${user.status}`);
      console.log(`   Horas: ${user.hours}`);
    });

    // Verificar usuarios con tribu
    const usersWithTribe = users.filter(user => user.tribe);
    console.log(`\n🏹 Usuarios con tribu: ${usersWithTribe.length}`);
    
    const usersWithoutTribe = users.filter(user => !user.tribe);
    console.log(`❌ Usuarios sin tribu: ${usersWithoutTribe.length}`);

    if (usersWithoutTribe.length > 0) {
      console.log('\nUsuarios sin tribu:');
      usersWithoutTribe.forEach(user => {
        console.log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUsersQuery();
