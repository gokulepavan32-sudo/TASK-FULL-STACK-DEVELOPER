const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const PORT = process.env.PORT || 10000;
const DB_PATH = path.join(__dirname, 'db.sqlite');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB
const db = new Database(DB_PATH);

// Create table if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Prepare statements
const getAllPosts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
const insertPost = db.prepare('INSERT INTO posts (title, body) VALUES (?, ?)');
const getPostById = db.prepare('SELECT * FROM posts WHERE id = ?');

// Routes
app.get('/api/posts', (req, res) => {
  try {
    const rows = getAllPosts.all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts', (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });

  try {
    const result = insertPost.run(title, body);
    const newPost = getPostById.get(result.lastInsertRowid);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.json({ message: 'Content backend is running', status: 'ok' }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing DB');
  db.close();
  process.exit(0);
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

server.timeout = 30000;