const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkColumnNames() {
  try {
    console.log('🔍 Verificando nombres de columnas en la tabla User...\n');

    // Verificar todas las columnas de la tabla User
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Todas las columnas de la tabla User:');
    columns.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // Verificar específicamente si existe 'tribe' o 'tribu'
    const tribeColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      AND (column_name = 'tribe' OR column_name = 'tribu')
    `;
    
    console.log('\n🔍 Columnas relacionadas con tribu:');
    if (tribeColumns.length > 0) {
      tribeColumns.forEach(col => {
        console.log(`   ✅ ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    } else {
      console.log('   ❌ No se encontraron columnas "tribe" o "tribu"');
    }

    // Probar consulta directa con diferentes nombres
    console.log('\n🔍 Probando consultas directas:');
    
    try {
      const result1 = await prisma.$queryRaw`SELECT id, "firstName", "lastName", tribe FROM "User" LIMIT 1`;
      console.log('   ✅ Consulta con "tribe":', result1[0]);
    } catch (error) {
      console.log('   ❌ Error con "tribe":', error.message);
    }

    try {
      const result2 = await prisma.$queryRaw`SELECT id, "firstName", "lastName", tribu FROM "User" LIMIT 1`;
      console.log('   ✅ Consulta con "tribu":', result2[0]);
    } catch (error) {
      console.log('   ❌ Error con "tribu":', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkColumnNames();
