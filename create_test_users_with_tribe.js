// Crear usuarios de prueba con el campo tribe
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    console.log('👥 Creando usuarios de prueba con campo tribe...');
    
    // Crear admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@happytribe.com',
        password: 'happytribe123',
        firstName: 'María',
        lastName: 'López',
        role: 'admin',
        status: 'active',
        tribe: 'Tribu 1'
      }
    });
    console.log('✅ Admin creado:', admin.firstName, admin.lastName, '- Tribu:', admin.tribe);
    
    // Crear teacher
    const teacher = await prisma.user.create({
      data: {
        email: 'teacher@happytribe.com',
        password: 'happytribe123',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        role: 'teacher',
        status: 'active',
        tribe: 'Tribu 2'
      }
    });
    console.log('✅ Teacher creado:', teacher.firstName, teacher.lastName, '- Tribu:', teacher.tribe);
    
    // Crear estudiantes
    const students = [
      { firstName: 'Ana', lastName: 'García', email: 'student@happytribe.com', tribe: 'Tribu 3' },
      { firstName: 'Luis', lastName: 'Martínez', email: 'luis@happytribe.com', tribe: 'Tribu 3' },
      { firstName: 'Sofia', lastName: 'Hernández', email: 'sofia@happytribe.com', tribe: 'Tribu 4' },
      { firstName: 'Diego', lastName: 'González', email: 'diego@happytribe.com', tribe: 'Tribu 4' },
      { firstName: 'Elena', lastName: 'Pérez', email: 'elena@happytribe.com', tribe: null }, // Sin tribu
    ];
    
    for (const studentData of students) {
      const student = await prisma.user.create({
        data: {
          ...studentData,
          password: 'happytribe123',
          role: 'student',
          status: 'active'
        }
      });
      console.log(`✅ Estudiante creado: ${student.firstName} ${student.lastName} - Tribu: ${student.tribe || 'Sin tribu'}`);
    }
    
    console.log('\n🎉 Usuarios de prueba creados exitosamente!');
    
    // Verificar que el campo tribe funciona
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        tribe: true,
        status: true
      }
    });
    
    console.log('\n📊 Resumen de usuarios creados:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   Rol: ${user.role} | Tribu: ${user.tribe || 'Sin tribu'} | Estado: ${user.status}`);
    });
    
    // Contar usuarios por tribu
    const usersByTribe = allUsers.reduce((acc, user) => {
      const tribe = user.tribe || 'Sin tribu';
      acc[tribe] = (acc[tribe] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📈 Distribución por tribu:');
    Object.entries(usersByTribe).forEach(([tribe, count]) => {
      console.log(`   ${tribe}: ${count} usuarios`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
