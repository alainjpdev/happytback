import express from 'express';
import cors from 'cors';
import modulesRouter from './routes/modules';
import classesRouter from './routes/classes';
import assignmentsRouter from './routes/assignments';
import usersRouter from './routes/users';
import materialsRouter from './routes/materials';
import studentClassesRouter from './routes/studentclasses';
import authRouter from './routes/auth';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/modules', modulesRouter);
app.use('/api/classes', classesRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/users', usersRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/studentclasses', studentClassesRouter);
app.use('/api', authRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app; 