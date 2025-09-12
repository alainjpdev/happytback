const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testHerokuDirect() {
  try {
    console.log('🔍 Probando consulta directa en Heroku...\n');

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
        tribe: true
      },
      take: 3
    });

    console.log('📊 Resultado de la consulta:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Tribu: ${user.tribe}`);
      console.log('');
    });

    // Probar consulta SQL directa
    console.log('🔍 Probando consulta SQL directa:');
    const sqlResult = await prisma.$queryRaw`SELECT "firstName", "lastName", "tribe" FROM "User" LIMIT 3`;
    console.log('Resultado SQL:', sqlResult);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testHerokuDirect();
