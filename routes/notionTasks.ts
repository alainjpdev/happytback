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

// GET /api/notion/tasks/properties
router.get('/properties', async (_req, res) => {
  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!notionToken || !databaseId) {
    return res.status(500).json({ error: 'Faltan variables de entorno NOTION_TOKEN o NOTION_DATABASE_ID' });
  }
  try {
    const response = await axios.get(
      `https://api.notion.com/v1/databases/${databaseId}`,
      {
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ properties: response.data.properties });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al consultar propiedades de Notion', details: error?.response?.data || error.message });
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

// POST /api/notion/tasks
router.post('/', async (req, res) => {
  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!notionToken || !databaseId) {
    return res.status(500).json({ error: 'Faltan variables de entorno NOTION_TOKEN o NOTION_DATABASE_ID' });
  }
  const taskName = req.body["Task name"];
  if (!taskName || !taskName.trim()) {
    return res.status(400).json({ error: 'El nombre de la tarea (Task name) es obligatorio' });
  }
  const { Description, Status, Priority, "Due date": DueDate } = req.body;
  try {
    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      {
        parent: { database_id: databaseId },
        properties: {
          'Task name': {
            title: [
              {
                text: {
                  content: taskName,
                },
              },
            ],
          },
          ...(Description && {
            Description: {
              rich_text: [
                {
                  text: {
                    content: Description,
                  },
                },
              ],
            },
          }),
          ...(Status && {
            Status: {
              status: { name: Status },
            },
          }),
          ...(Priority && {
            Priority: {
              select: { name: Priority },
            },
          }),
          ...(DueDate && {
            'Due date': {
              date: { start: DueDate },
            },
          }),
        },
      },
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
    res.status(500).json({ error: 'Error al crear tarea en Notion', details: error?.response?.data || error.message });
  }
});

// PATCH /api/notion/tasks/:id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    return res.status(500).json({ error: 'Falta NOTION_TOKEN' });
  }
  // Recibe las propiedades a actualizar desde el body
  const { Status, Priority, Description, DueDate, TaskName } = req.body;
  const properties: any = {};
  if (Status) {
    properties.Status = { status: { name: Status } };
  }
  if (Priority) {
    properties.Priority = { select: { name: Priority } };
  }
  if (Description) {
    properties.Description = { rich_text: [{ text: { content: Description } }] };
  }
  if (DueDate) {
    properties["Due date"] = { date: { start: DueDate } };
  }
  if (TaskName) {
    properties["Task name"] = { title: [{ text: { content: TaskName } }] };
  }
  try {
    const response = await axios.patch(
      `https://api.notion.com/v1/pages/${id}`,
      { properties },
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
    res.status(500).json({ error: 'Error al actualizar tarea de Notion', details: error?.response?.data || error.message });
  }
});

// DELETE /api/notion/tasks/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    return res.status(500).json({ error: 'Falta NOTION_TOKEN' });
  }
  try {
    await axios.patch(
      `https://api.notion.com/v1/pages/${id}`,
      { archived: true },
      {
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ success: true, message: 'Tarea archivada (eliminada) correctamente en Notion.' });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al archivar tarea de Notion', details: error?.response?.data || error.message });
  }
});

export default router; 