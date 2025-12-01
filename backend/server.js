const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const PORT = process.env.PORT || 10000;
const DB_PATH = path.join(__dirname, 'db.sqlite');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('DB open error', err);
    process.exit(1);
  }
  console.log('Connected to SQLite DB at', DB_PATH);
});

// Create table if not exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Routes
app.get('/api/posts', (req, res) => {
  db.all(`SELECT * FROM posts ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/posts', (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });

  const stmt = db.prepare(`INSERT INTO posts (title, body) VALUES (?, ?)`);
  stmt.run([title, body], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    const insertedId = this.lastID;
    db.get(`SELECT * FROM posts WHERE id = ?`, [insertedId], (err2, row) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(row);
    });
  });
});

app.get('/', (req, res) => res.json({ message: 'Content backend is running', status: 'ok' }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing DB');
  db.close(()=>process.exit(0));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

// Handle server startup timeout
server.timeout = 30000;