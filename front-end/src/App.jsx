import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import AddContent from './addcontent';
import ViewContent from './viewcontent';
import './styles.css';

function Navigation() {
  const location = useLocation();
  
  return (
    <div className="header">
      <h1>📝 Content Manager</h1>
      <nav className="nav">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          ✏️ Add Content
        </Link>
        <Link 
          to="/view" 
          className={`nav-link ${location.pathname === '/view' ? 'active' : ''}`}
        >
          👁️ View Content
        </Link>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Navigation />
        <div className="content-card">
          <Routes>
            <Route path="/" element={<AddContent />} />
            <Route path="/view" element={<ViewContent />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
