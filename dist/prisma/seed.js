"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Usuarios de muestra para HappyTribe
        const student = yield prisma.user.findUnique({ where: { email: 'student@happytribe.com' } });
        const teacher = yield prisma.user.findUnique({ where: { email: 'teacher@happytribe.com' } });
        const admin = yield prisma.user.findUnique({ where: { email: 'admin@happytribe.com' } });
        if (!student || !teacher || !admin) {
            throw new Error('Usuarios de muestra no encontrados. Ejecuta primero el seed de usuarios.');
        }
        // Módulos
        const module1 = yield prisma.module.create({
            data: {
                title: 'Fundamentos de Programación',
                description: 'Aprende los conceptos básicos de la programación',
                createdById: teacher.id,
            },
        });
        const module2 = yield prisma.module.create({
            data: {
                title: 'Desarrollo Web',
                description: 'Crea páginas web con HTML, CSS y JavaScript',
                createdById: teacher.id,
            },
        });
        // Clases
        const class1 = yield prisma.class.create({
            data: {
                title: 'JavaScript Avanzado',
                description: 'Profundiza en JavaScript moderno',
                schedule: 'Lun, Mié, Vie 15:00-16:30',
                maxStudents: 30,
                teacherId: teacher.id,
                moduleId: module1.id,
            },
        });
        const class2 = yield prisma.class.create({
            data: {
                title: 'Fundamentos de Programación',
                description: 'Clase introductoria a la programación',
                schedule: 'Mar, Jue 10:00-11:30',
                maxStudents: 30,
                teacherId: teacher.id,
                moduleId: module1.id,
            },
        });
        const class3 = yield prisma.class.create({
            data: {
                title: 'Desarrollo Web Frontend',
                description: 'HTML, CSS y JavaScript para la web',
                schedule: 'Sáb 9:00-12:00',
                maxStudents: 25,
                teacherId: teacher.id,
                moduleId: module2.id,
            },
        });
        // Inscribir al estudiante en las clases
        yield prisma.studentClass.createMany({
            data: [
                { studentId: student.id, classId: class1.id, status: 'active' },
                { studentId: student.id, classId: class2.id, status: 'active' },
                { studentId: student.id, classId: class3.id, status: 'active' },
            ],
            skipDuplicates: true,
        });
        // Tareas (Assignments)
        yield prisma.assignment.createMany({
            data: [
                {
                    title: 'Crear una calculadora en JavaScript',
                    description: 'Implementa una calculadora básica usando JS',
                    dueDate: new Date('2024-12-28'),
                    status: 'pending',
                    classId: class1.id,
                },
                {
                    title: 'Proyecto final - Página web personal',
                    description: 'Crea tu propia página web usando HTML, CSS y JS',
                    dueDate: new Date('2024-12-30'),
                    status: 'pending',
                    classId: class3.id,
                },
                {
                    title: 'Algoritmo de ordenamiento',
                    description: 'Implementa un algoritmo de ordenamiento',
                    dueDate: new Date('2024-12-25'),
                    status: 'completed',
                    classId: class2.id,
                },
            ],
            skipDuplicates: true,
        });
        // Materiales
        yield prisma.material.createMany({
            data: [
                {
                    title: 'Guía de JavaScript',
                    url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Guide',
                    classId: class1.id,
                },
                {
                    title: 'Recursos de HTML y CSS',
                    url: 'https://developer.mozilla.org/es/docs/Learn',
                    classId: class3.id,
                },
            ],
            skipDuplicates: true,
        });
        // Módulos personalizados
        const n8nModule = yield prisma.module.create({
            data: {
                title: 'Módulo 1: n8n',
                description: 'Automatización de flujos con n8n.',
                createdById: teacher.id,
            },
        });
        const viteModule = yield prisma.module.create({
            data: {
                title: 'Módulo 2: Vite + React',
                description: 'Desarrollo frontend moderno con Vite y React.',
                createdById: teacher.id,
            },
        });
        const openaiModule = yield prisma.module.create({
            data: {
                title: 'Módulo 3: OpenAI VAPI',
                description: 'Integración de IA con OpenAI y Voice API.',
                createdById: teacher.id,
            },
        });
        const supabaseModule = yield prisma.module.create({
            data: {
                title: 'Módulo 4: Supabase',
                description: 'Backend as a Service y bases de datos en tiempo real.',
                createdById: teacher.id,
            },
        });
        const mcpModule = yield prisma.module.create({
            data: {
                title: 'Módulo 5: MCP',
                description: 'Microservicios y Cloud Platforms.',
                createdById: teacher.id,
            },
        });
        // Clases asociadas a cada módulo
        yield prisma.class.create({
            data: {
                title: 'Clase n8n',
                description: 'Automatización de procesos con n8n.',
                schedule: 'Lunes 10:00-12:00',
                maxStudents: 30,
                teacherId: teacher.id,
                moduleId: n8nModule.id,
            },
        });
        yield prisma.class.create({
            data: {
                title: 'Clase Vite + React',
                description: 'Desarrollo de apps con Vite y React.',
                schedule: 'Martes 10:00-12:00',
                maxStudents: 30,
                teacherId: teacher.id,
                moduleId: viteModule.id,
            },
        });
        yield prisma.class.create({
            data: {
                title: 'Clase OpenAI VAPI',
                description: 'Integración de IA y voz.',
                schedule: 'Miércoles 10:00-12:00',
                maxStudents: 30,
                teacherId: teacher.id,
                moduleId: openaiModule.id,
            },
        });
        yield prisma.class.create({
            data: {
                title: 'Clase Supabase',
                description: 'Bases de datos y backend en tiempo real.',
                schedule: 'Jueves 10:00-12:00',
                maxStudents: 30,
                teacherId: teacher.id,
                moduleId: supabaseModule.id,
            },
        });
        yield prisma.class.create({
            data: {
                title: 'Clase MCP',
                description: 'Microservicios y cloud platforms.',
                schedule: 'Viernes 10:00-12:00',
                maxStudents: 30,
                teacherId: teacher.id,
                moduleId: mcpModule.id,
            },
        });
        // Crear profesores dummy
        const jeanPaul = yield prisma.user.upsert({
            where: { email: 'jeanpaul@algoschool.com' },
            update: {},
            create: {
                email: 'jeanpaul@algoschool.com',
                password: 'algoschool123',
                firstName: 'Jean Paul',
                lastName: 'Raimond',
                role: 'teacher',
                tribe: 'Leones',
                group_name: 'Grupo Profesores',
            },
        });
        const federico = yield prisma.user.upsert({
            where: { email: 'federico@algoschool.com' },
            update: {},
            create: {
                email: 'federico@algoschool.com',
                password: 'algoschool123',
                firstName: 'Federico',
                lastName: 'Peña',
                role: 'teacher',
                tribe: 'Leones',
                group_name: 'Grupo Profesores',
            },
        });
        const maria = yield prisma.user.upsert({
            where: { email: 'maria@algoschool.com' },
            update: {},
            create: {
                email: 'maria@algoschool.com',
                password: 'algoschool123',
                firstName: 'María',
                lastName: 'García',
                role: 'teacher',
                tribe: 'Leones',
                group_name: 'Grupo Profesores',
            },
        });
        // Crear módulos dummy
        const moduloJeanPaul = yield prisma.module.create({
            data: {
                title: 'Automatización con n8n',
                description: 'Flujos de trabajo automáticos con n8n.',
                createdById: jeanPaul.id,
            },
        });
        const moduloFederico = yield prisma.module.create({
            data: {
                title: 'React para principiantes',
                description: 'Introducción a React y componentes.',
                createdById: federico.id,
            },
        });
        const moduloMaria = yield prisma.module.create({
            data: {
                title: 'Bases de datos con Supabase',
                description: 'Gestión de datos en la nube con Supabase.',
                createdById: maria.id,
            },
        });
        // Crear clases dummy
        const claseJeanPaul = yield prisma.class.create({
            data: {
                title: 'Workflows con n8n',
                description: 'Automatiza tareas repetitivas.',
                schedule: 'Lunes 14:00-16:00',
                maxStudents: 20,
                teacherId: jeanPaul.id,
                moduleId: moduloJeanPaul.id,
            },
        });
        const claseFederico = yield prisma.class.create({
            data: {
                title: 'Componentes en React',
                description: 'Crea y reutiliza componentes.',
                schedule: 'Miércoles 10:00-12:00',
                maxStudents: 25,
                teacherId: federico.id,
                moduleId: moduloFederico.id,
            },
        });
        const claseMaria = yield prisma.class.create({
            data: {
                title: 'Consultas SQL básicas',
                description: 'Aprende a consultar datos en Supabase.',
                schedule: 'Viernes 09:00-11:00',
                maxStudents: 15,
                teacherId: maria.id,
                moduleId: moduloMaria.id,
            },
        });
        // Crear tareas dummy
        yield prisma.assignment.createMany({
            data: [
                {
                    title: 'Automatiza un flujo simple',
                    description: 'Crea un flujo en n8n que envíe un email.',
                    dueDate: new Date('2024-12-10'),
                    status: 'pending',
                    classId: claseJeanPaul.id,
                },
                {
                    title: 'Crea un componente funcional',
                    description: 'Haz un botón personalizado en React.',
                    dueDate: new Date('2024-12-12'),
                    status: 'pending',
                    classId: claseFederico.id,
                },
                {
                    title: 'Consulta datos de una tabla',
                    description: 'Haz una consulta SELECT en Supabase.',
                    dueDate: new Date('2024-12-15'),
                    status: 'pending',
                    classId: claseMaria.id,
                },
            ],
            skipDuplicates: true,
        });
        // Crear materiales dummy
        yield prisma.material.createMany({
            data: [
                {
                    title: 'Documentación oficial n8n',
                    url: 'https://docs.n8n.io/',
                    classId: claseJeanPaul.id,
                },
                {
                    title: 'Tutorial de React',
                    url: 'https://react.dev/learn',
                    classId: claseFederico.id,
                },
                {
                    title: 'Guía de Supabase',
                    url: 'https://supabase.com/docs',
                    classId: claseMaria.id,
                },
            ],
            skipDuplicates: true,
        });
        // Inscribir al estudiante de ejemplo en las nuevas clases dummy
        yield prisma.studentClass.createMany({
            data: [
                { studentId: student.id, classId: claseJeanPaul.id, status: 'active' },
                { studentId: student.id, classId: claseFederico.id, status: 'active' },
                { studentId: student.id, classId: claseMaria.id, status: 'active' },
            ],
            skipDuplicates: true,
        });
        console.log('Seed de datos de ejemplo completado.');
    });
}
main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(() => prisma.$disconnect());
