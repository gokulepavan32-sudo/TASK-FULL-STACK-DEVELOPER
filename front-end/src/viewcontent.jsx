import React, { useEffect, useState } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function ViewContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>View content</h2>
      {loading ? <p>Loading...</p> : posts.length === 0 ? <p>No content yet.</p> : (
        <div>
          {posts.map(p => (
            <div key={p.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>{p.title}</h3>
              <small>{new Date(p.created_at).toLocaleString()}</small>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      )}
      <button onClick={fetchPosts}>Refresh</button>
    </div>
  );
}
