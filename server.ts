import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Planet Metadata API
  app.get('/api/planets', (req, res) => {
    res.json({
      message: "Welcome to the Solaris API",
      data: [
        { name: "Mercury", fact: "Closest to the Sun" },
        { name: "Venus", fact: "Hottest planet" },
        { name: "Earth", fact: "Only known life" },
        { name: "Mars", fact: "The Red Planet" },
        { name: "Jupiter", fact: "Largest planet" },
        { name: "Saturn", fact: "Has rings" },
        { name: "Uranus", fact: "Rotates on its side" },
        { name: "Neptune", fact: "Windiest planet" }
      ]
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
