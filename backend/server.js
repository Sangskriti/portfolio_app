// server.js
const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const path = require('path');
const fs = require('fs').promises;

const app = express();
app.use(cors());

// Increase body size limits to allow base64 images in request payloads.
// 50mb should be more than enough for a few photos. Lower in production.
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb', parameterLimit: 50000 }));

const DB_FILE = path.join(__dirname, 'db.json');

// Helper: read DB (returns object with portfolios array)
async function readDB() {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf8');
    const data = JSON.parse(raw || '{}');
    if (!data.portfolios) data.portfolios = [];
    return data;
  } catch (err) {
    // If file doesn't exist or parse error, return default
    return { portfolios: [] };
  }
}

// Helper: write DB (atomic-ish write via temp file then rename)
async function writeDB(data) {
  const tmp = DB_FILE + '.tmp';
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(tmp, json, 'utf8');
  await fs.rename(tmp, DB_FILE);
}

// Ensure DB file exists with initial structure (non-blocking)
async function initDB() {
  try {
    const data = await readDB();
    if (!data.portfolios) data.portfolios = [];
    await writeDB(data);
  } catch (err) {
    console.error('Failed to initialize DB:', err);
    // Don't crash — server can continue and attempts to write will create file
  }
}
initDB();

// Get all portfolios, optional filter by skill or role (query)
app.get('/api/portfolios', async (req, res) => {
  try {
    const db = await readDB();
    let items = db.portfolios || [];
    const { skill, role, q } = req.query;

    if (skill) {
      const skillLower = skill.toLowerCase();
      items = items.filter(p => (p.skills || []).some(s => String(s).toLowerCase() === skillLower));
    }
    if (role) {
      const roleLower = role.toLowerCase();
      items = items.filter(p => (p.title || '').toLowerCase().includes(roleLower));
    }
    if (q) {
      const ql = q.toLowerCase();
      items = items.filter(p => ((p.name || '') + ' ' + (p.bio || '') + ' ' + (p.title || '')).toLowerCase().includes(ql));
    }

    res.json(items);
  } catch (err) {
    console.error('GET /api/portfolios error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single portfolio
app.get('/api/portfolios/:id', async (req, res) => {
  try {
    const db = await readDB();
    const p = (db.portfolios || []).find(x => x.id === req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) {
    console.error('GET /api/portfolios/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new portfolio
app.post('/api/portfolios', async (req, res) => {
  try {
    const payload = req.body || {};
    // Basic server-side guard: reject if payload obviously too large
    // (optional; you can tune the threshold).
    const estimateSize = JSON.stringify(payload).length;
    if (estimateSize > 50 * 1024 * 1024) { // 50MB
      return res.status(413).json({ error: 'Payload too large' });
    }

    const db = await readDB();
    const newItem = { id: nanoid(10), createdAt: Date.now(), ...payload };
    db.portfolios.push(newItem);
    await writeDB(db);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('POST /api/portfolios error:', err);
    // If the body parser rejected the request due to size, Express would already have responded.
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update portfolio (edit)
app.put('/api/portfolios/:id', async (req, res) => {
  try {
    const db = await readDB();
    const idx = (db.portfolios || []).findIndex(x => x.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    const updated = { ...db.portfolios[idx], ...req.body, updatedAt: Date.now() };
    db.portfolios[idx] = updated;
    await writeDB(db);
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/portfolios/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Portfolio API server listening on port', PORT);
});
