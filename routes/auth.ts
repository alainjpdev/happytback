import { Router } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// POST /api/login
router.post('/login', async (req, res) => {
  console.log('[LOGIN] --- INICIO ---');
  const { email, password } = req.body;
  console.log('[LOGIN] Email recibido:', email);
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('[LOGIN] Usuario encontrado:', user);
    if (!user) {
      console.log('[LOGIN] Usuario no encontrado');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const valid = await bcrypt.compare(password, user.password);
    console.log('[LOGIN] Contraseña válida:', valid);
    if (!valid) {
      console.log('[LOGIN] Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userData } = user;
    console.log('[LOGIN] Login exitoso para:', email);
    res.json({ user: userData, token });
    console.log('[LOGIN] --- FIN (éxito) ---');
  } catch (error) {
    console.error('[LOGIN] Error:', error);
    res.status(500).json({ error: 'Error en login' });
    console.log('[LOGIN] --- FIN (error) ---');
  }
});

// POST /api/register
router.post('/register', async (req, res) => {
  console.log('[REGISTER] --- INICIO ---');
  const { email, password, firstName, lastName, role } = req.body;
  console.log('[REGISTER] Incoming data:', { email, firstName, lastName, role });
  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    console.log('[REGISTER] User exists?', !!exists);
    if (exists) {
      console.log('[REGISTER] Email already registered:', email);
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    const hashed = await bcrypt.hash(password, 10);
    console.log('[REGISTER] Password hashed');
    const user = await prisma.user.create({
      data: { email, password: hashed, firstName, lastName, role }
    });
    console.log('[REGISTER] User created:', user);
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userData } = user;
    res.json({ user: userData, token });
    console.log('[REGISTER] Registration successful, response sent');
    console.log('[REGISTER] --- FIN (éxito) ---');
  } catch (error) {
    console.error('[REGISTER] Error in registration:', error);
    res.status(500).json({ error: 'Error en registro' });
    console.log('[REGISTER] --- FIN (error) ---');
  }
});

export default router; 