import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:10000';

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
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>📚 Content Library</h2>
        <button onClick={fetchPosts} className="btn btn-secondary" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Loading...
            </>
          ) : (
            <>
              🔄 Refresh
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <span className="loading-spinner" style={{ width: '40px', height: '40px' }}></span>
          <p style={{ marginTop: '16px', color: '#718096' }}>Loading your content...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No content yet</h3>
          <p>Start by creating your first piece of content!</p>
        </div>
      ) : (
        <div>
          <p style={{ color: '#718096', marginBottom: '20px' }}>
            📊 Showing {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h3 className="post-title">{post.title}</h3>
              <div className="post-date">
                🕒 {formatDate(post.created_at)}
              </div>
              <p className="post-body">{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}