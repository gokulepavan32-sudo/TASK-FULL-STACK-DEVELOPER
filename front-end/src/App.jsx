import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AddContent from './addcontent';
import ViewContent from './viewcontent';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
        <h1>Content App</h1>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Add Content</Link>
          <Link to="/view" style={{ textDecoration: 'none', color: '#007bff' }}>View Content</Link>
        </nav>
        <Routes>
          <Route path="/" element={<AddContent />} />
          <Route path="/view" element={<ViewContent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
