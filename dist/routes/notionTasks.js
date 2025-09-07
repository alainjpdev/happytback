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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
// GET /api/notion/tasks
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const notionToken = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!notionToken || !databaseId) {
        return res.status(500).json({ error: 'Faltan variables de entorno NOTION_TOKEN o NOTION_DATABASE_ID' });
    }
    try {
        const response = yield axios_1.default.post(`https://api.notion.com/v1/databases/${databaseId}/query`, {}, {
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al consultar Notion', details: ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message });
    }
}));
// GET /api/notion/tasks/properties
router.get('/properties', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const notionToken = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!notionToken || !databaseId) {
        return res.status(500).json({ error: 'Faltan variables de entorno NOTION_TOKEN o NOTION_DATABASE_ID' });
    }
    try {
        const response = yield axios_1.default.get(`https://api.notion.com/v1/databases/${databaseId}`, {
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
        });
        res.json({ properties: response.data.properties });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al consultar propiedades de Notion', details: ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message });
    }
}));
// GET /api/notion/tasks/:id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const notionToken = process.env.NOTION_TOKEN;
    if (!notionToken) {
        return res.status(500).json({ error: 'Falta NOTION_TOKEN' });
    }
    try {
        const response = yield axios_1.default.get(`https://api.notion.com/v1/pages/${id}`, {
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al consultar tarea de Notion', details: ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message });
    }
}));
// POST /api/notion/tasks
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const response = yield axios_1.default.post('https://api.notion.com/v1/pages', {
            parent: { database_id: databaseId },
            properties: Object.assign(Object.assign(Object.assign(Object.assign({ 'Task name': {
                    title: [
                        {
                            text: {
                                content: taskName,
                            },
                        },
                    ],
                } }, (Description && {
                Description: {
                    rich_text: [
                        {
                            text: {
                                content: Description,
                            },
                        },
                    ],
                },
            })), (Status && {
                Status: {
                    status: { name: Status },
                },
            })), (Priority && {
                Priority: {
                    select: { name: Priority },
                },
            })), (DueDate && {
                'Due date': {
                    date: { start: DueDate },
                },
            })),
        }, {
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear tarea en Notion', details: ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message });
    }
}));
// PATCH /api/notion/tasks/:id
router.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const notionToken = process.env.NOTION_TOKEN;
    if (!notionToken) {
        return res.status(500).json({ error: 'Falta NOTION_TOKEN' });
    }
    // Recibe las propiedades a actualizar desde el body
    const { Status, Priority, Description, "Due date": DueDate } = req.body;
    const taskName = req.body["Task name"];
    const properties = {};
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
    if (typeof taskName === 'string') {
        if (!taskName.trim()) {
            return res.status(400).json({ error: 'El nombre de la tarea (Task name) no puede ser vacío' });
        }
        properties["Task name"] = { title: [{ text: { content: taskName } }] };
    }
    try {
        const response = yield axios_1.default.patch(`https://api.notion.com/v1/pages/${id}`, { properties }, {
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar tarea de Notion', details: ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message });
    }
}));
// DELETE /api/notion/tasks/:id
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const notionToken = process.env.NOTION_TOKEN;
    if (!notionToken) {
        return res.status(500).json({ error: 'Falta NOTION_TOKEN' });
    }
    try {
        yield axios_1.default.patch(`https://api.notion.com/v1/pages/${id}`, { archived: true }, {
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
        });
        res.json({ success: true, message: 'Tarea archivada (eliminada) correctamente en Notion.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al archivar tarea de Notion', details: ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message });
    }
}));
exports.default = router;
