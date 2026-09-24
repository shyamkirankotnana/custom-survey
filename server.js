import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Serve static assets from production React build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Healthcheck API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Banking Feedback Survey Node.js Service' });
});

// Fallback to React app index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Node.js Server running on http://localhost:${PORT}`);
});
