import express from 'express';
import type { Request, Response } from 'express';
import next from 'next';
import cors from 'cors';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  server.use(cors());
  server.use(express.json());

  // === EXPRESS CUSTOM API ROUTES ===
  server.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Next.js + Express unified server is running' });
  });

  // === NEXT.JS CATCH-ALL ROUTE ===
  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
