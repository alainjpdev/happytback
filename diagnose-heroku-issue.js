const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function diagnoseIssue() {
  try {
    console.log('🔍 Diagnosticando problema en Heroku...\n');

    // 1. Verificar versión de Prisma
    console.log('1. Verificando versión de Prisma:');
    const prismaVersion = require('@prisma/client/package.json').version;
    console.log(`   Prisma Client: ${prismaVersion}`);

    // 2. Verificar conexión a la base de datos
    console.log('\n2. Verificando conexión a la base de datos:');
    try {
      await prisma.$connect();
      console.log('   ✅ Conexión exitosa');
    } catch (error) {
      console.log('   ❌ Error de conexión:', error.message);
    }

    // 3. Verificar esquema de la base de datos
    console.log('\n3. Verificando esquema de la base de datos:');
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      AND column_name IN ('tribe', 'group_name')
      ORDER BY column_name
    `;
    
    console.log('   Columnas encontradas:');
    tableInfo.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // 4. Probar consulta simple
    console.log('\n4. Probando consulta simple:');
    const simpleQuery = await prisma.user.findFirst({
      select: {
        id: true,
        firstName: true,
        tribe: true,
        group_name: true
      }
    });
    console.log('   Resultado:', simpleQuery);

    // 5. Probar consulta completa (como en el endpoint)
    console.log('\n5. Probando consulta completa (como en el endpoint):');
    const fullQuery = await prisma.user.findMany({
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
      },
      take: 2
    });
    
    console.log('   Resultado consulta completa:');
    fullQuery.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`      tribe: ${user.tribe}`);
      console.log(`      group_name: ${user.group_name}`);
    });

    // 6. Verificar si hay problemas de cache
    console.log('\n6. Verificando cache de Prisma:');
    console.log('   Intentando limpiar cache...');
    await prisma.$disconnect();
    await prisma.$connect();
    console.log('   ✅ Cache limpiado');

    // 7. Probar consulta después de limpiar cache
    console.log('\n7. Probando consulta después de limpiar cache:');
    const afterCacheQuery = await prisma.user.findFirst({
      select: {
        id: true,
        firstName: true,
        tribe: true,
        group_name: true
      }
    });
    console.log('   Resultado después de limpiar cache:', afterCacheQuery);

  } catch (error) {
    console.error('❌ Error durante diagnóstico:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseIssue();
