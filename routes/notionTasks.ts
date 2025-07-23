import { Router } from 'express';
import axios from 'axios';

const router = Router();

// GET /api/notion/tasks
router.get('/', async (_req, res) => {
  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionToken || !databaseId) {
    return res.status(500).json({ error: 'Faltan variables de entorno NOTION_TOKEN o NOTION_DATABASE_ID' });
  }

  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al consultar Notion', details: error?.response?.data || error.message });
  }
});

// GET /api/notion/tasks/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    return res.status(500).json({ error: 'Falta NOTION_TOKEN' });
  }
  try {
    const response = await axios.get(
      `https://api.notion.com/v1/pages/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
        },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al consultar tarea de Notion', details: error?.response?.data || error.message });
  }
});

export default router; 