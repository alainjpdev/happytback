const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMigrations() {
  try {
    console.log('🔍 Verificando migraciones aplicadas...\n');

    // Verificar migraciones en la base de datos
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at 
      FROM _prisma_migrations 
      ORDER BY finished_at
    `;
    
    console.log('📋 Migraciones aplicadas en la base de datos:');
    migrations.forEach((migration, index) => {
      console.log(`${index + 1}. ${migration.migration_name} - ${migration.finished_at}`);
    });

    // Verificar si los campos existen en la tabla User
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      AND column_name IN ('tribe', 'group_name')
      ORDER BY column_name
    `;
    
    console.log('\n📊 Campos en la tabla User:');
    tableInfo.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // Verificar datos de ejemplo
    const sampleUser = await prisma.user.findFirst({
      select: {
        id: true,
        firstName: true,
        tribe: true,
        group_name: true
      }
    });
    
    console.log('\n👤 Usuario de ejemplo:');
    console.log(sampleUser);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMigrations();
