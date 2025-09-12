const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugTribes() {
  try {
    console.log('🔍 Debugging tribes issue...\n');

    // Probar consulta directa con select específico
    console.log('1. Probando consulta con select específico:');
    const usersWithSelect = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        tribe: true
      },
      take: 3
    });
    
    console.log('Resultado con select:');
    usersWithSelect.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName}: tribe = ${user.tribe}`);
    });

    // Probar consulta sin select (todos los campos)
    console.log('\n2. Probando consulta sin select:');
    const usersWithoutSelect = await prisma.user.findMany({
      take: 3
    });
    
    console.log('Resultado sin select:');
    usersWithoutSelect.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName}: tribe = ${user.tribe}`);
    });

    // Verificar si el campo existe en el schema
    console.log('\n3. Verificando schema:');
    const sampleUser = await prisma.user.findFirst();
    console.log('Campos disponibles en el modelo User:');
    console.log(Object.keys(sampleUser));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugTribes();
