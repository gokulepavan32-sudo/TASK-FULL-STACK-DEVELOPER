const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 10000;
const DB_FILE = path.join(__dirname, 'posts.json');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize JSON database
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

const readPosts = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return [];
  }
};

const writePosts = (posts) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(posts, null, 2));
};

// Routes
app.get('/api/posts', (req, res) => {
  const posts = readPosts();
  res.json(posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

app.post('/api/posts', (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });

  const posts = readPosts();
  const newPost = {
    id: Date.now(),
    title,
    body,
    created_at: new Date().toISOString()
  };
  
  posts.push(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
});

app.get('/', (req, res) => res.json({ message: 'Content backend is running', status: 'ok' }));
app.get('/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString() }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});