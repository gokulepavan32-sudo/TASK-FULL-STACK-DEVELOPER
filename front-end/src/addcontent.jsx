import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:10000';

export default function AddContent() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setStatus({ type: 'error', message: 'Please fill in both title and content fields.' });
      return;
    }
    
    setIsLoading(true);
    setStatus({ type: 'loading', message: 'Saving your content...' });
    
    try {
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim() })
      });
      
      if (!res.ok) throw new Error('Failed to save content');
      
      setStatus({ type: 'success', message: '✅ Content saved successfully!' });
      setTitle('');
      setBody('');
      
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: '❌ Error saving content. Please try again.' });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '1.8rem', fontWeight: '700' }}>✨ Create New Content</h2>
      
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">📝 Title</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Enter an engaging title..." 
            className="form-input"
            maxLength={100}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">📄 Content</label>
          <textarea 
            value={body} 
            onChange={e => setBody(e.target.value)} 
            placeholder="Write your content here..." 
            rows={6} 
            className="form-textarea"
            maxLength={2000}
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Saving...
            </>
          ) : (
            <>
              💾 Save Content
            </>
          )}
        </button>
      </form>
      
      {status && (
        <div className={`status-message status-${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}