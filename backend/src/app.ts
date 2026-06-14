import express, { Request, Response } from 'express';
import cors from 'cors';
import { getDb } from './db';

export const app = express();

app.use(cors());
app.use(express.json());

// Root path
app.get('/', (req: Request, res: Response) => {
  res.send('✅ BioDapt API Backend is running! Please access the frontend UI at port 5178.');
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Materials list from SQLite
app.get('/api/materials', async (req: Request, res: Response) => {
  const db = await getDb();
  const rows = await db.all('SELECT id, name, description FROM materials');
  res.json({ materials: rows });
});

// Material detail
app.get('/api/material/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const db = await getDb();
  const material = await db.get('SELECT id, name, description FROM materials WHERE id = ?', id);
  if (material) res.json({ material });
  else res.status(404).json({ error: 'Material not found' });
});

// Mock recommendation endpoint (still placeholder)
app.post('/api/recommend', (req: Request, res: Response) => {
  const { query } = req.body as { query?: string };
  const recommendations = [
    { material: { id: 'pla', name: 'PLA' }, score: 0.85, match: 'high' },
    { material: { id: 'pha', name: 'PHA' }, score: 0.78, match: 'medium' },
    { material: { id: 'cellulose', name: 'Cellulose' }, score: 0.65, match: 'low' },
  ];
  res.json({ query: query ?? '', recommendations });
});

// Mock compare endpoint
app.post('/api/compare', (req: Request, res: Response) => {
  const { ids } = req.body as { ids?: string[] };
  const scores = (ids || []).map((id) => ({ id, score: Math.round(Math.random() * 100) }));
  res.json({ scores });
});

// Mock trace endpoint
app.post('/api/trace', (req: Request, res: Response) => {
  const { query } = req.body as { query?: string };
  const trace = `Trace for query: ${query ?? ''}`;
  res.json({ trace });
});
