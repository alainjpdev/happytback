const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testHerokuFields() {
  try {
    console.log('🔍 Probando campos tribe y group_name en Heroku...\n');

    // Probar la consulta exacta del endpoint
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

    console.log(`📊 Total usuarios: ${users.length}`);
    console.log('\n🔍 Primeros 3 usuarios:');
    
    users.slice(0, 3).forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Tribu: ${user.tribe}`);
      console.log(`   Grupo: ${user.group_name}`);
      console.log('');
    });

    // Verificar estadísticas
    const usersWithTribe = users.filter(user => user.tribe !== null);
    const usersWithGroup = users.filter(user => user.group_name !== null);

    console.log(`📊 Estadísticas:`);
    console.log(`✅ Usuarios con tribu: ${usersWithTribe.length}`);
    console.log(`✅ Usuarios con grupo: ${usersWithGroup.length}`);

    // Probar consulta directa a la base de datos
    console.log('\n🔍 Probando consulta directa a la base de datos...');
    const directQuery = await prisma.$queryRaw`SELECT id, "firstName", "lastName", tribe, group_name FROM "User" LIMIT 3`;
    console.log('Resultado consulta directa:');
    directQuery.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} - Tribu: ${user.tribe} - Grupo: ${user.group_name}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testHerokuFields();
