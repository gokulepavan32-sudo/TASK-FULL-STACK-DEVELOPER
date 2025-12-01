import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function AddContent() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !body) return setStatus('Please fill both fields.');
    setStatus('Saving...');
    try {
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body })
      });
      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      setStatus('Saved ✔');
      setTitle(''); setBody('');
    } catch (err) {
      setStatus('Error saving');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add content</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 8 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Body" rows={4} style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit">Save</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
