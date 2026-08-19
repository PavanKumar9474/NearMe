import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function SearchBar({ onSearch, showDistanceSort }) {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [radius, setRadius] = useState('');
  const [openNow, setOpenNow] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));

    if (token) {
      axios.get('http://127.0.0.1:8000/api/search-history/', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setHistory(res.data.slice(0, 5)))
        .catch(err => console.error("Error fetching history:", err));
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token && query.trim()) {
      axios.post('http://127.0.0.1:8000/api/search-history/', { query }, { headers: { Authorization: `Bearer ${token}` } })
        .catch(err => console.error("Error saving search history:", err));
    }
    setShowHistory(false);
    onSearch({ query, category, minRating, sortBy, radius });
  };

  const handleHistoryClick = (histQuery) => {
    setQuery(histQuery);
    setShowHistory(false);
  };

  const inputStyle = {
    padding: '0.75rem 1rem', 
    borderRadius: '0.5rem', 
    border: '1px solid var(--border-glass)', 
    background: 'rgba(0,0,0,0.2)', 
    color: 'white', 
    minWidth: '150px'
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1', minWidth: '200px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0 1rem', border: '1px solid var(--border-glass)', position: 'relative' }}>
          <Search size={20} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search places..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
          />
          {showHistory && history.length > 0 && (
            <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', zIndex: 10, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              {history.map((h, i) => (
                <div 
                  key={i} 
                  onClick={() => handleHistoryClick(h.query)}
                  style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: i < history.length - 1 ? '1px solid var(--border-glass)' : 'none', color: 'var(--text-secondary)' }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <Search size={14} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
                  <span style={{ verticalAlign: 'middle' }}>{h.query}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button 
          type="button" 
          onClick={() => setShowAdvanced(!showAdvanced)} 
          style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: 'auto' }}
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>

        <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Search</button>
      </div>

      {showAdvanced && (
        <div className="animate-fade-in" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.slug} style={{ color: 'black' }}>{c.name}</option>)}
          </select>

          <select value={minRating} onChange={(e) => setMinRating(e.target.value)} style={inputStyle}>
            <option value="">Any Rating</option>
            <option value="3" style={{ color: 'black' }}>3+ Stars</option>
            <option value="4" style={{ color: 'black' }}>4+ Stars</option>
            <option value="4.5" style={{ color: 'black' }}>4.5+ Stars</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={inputStyle}>
            <option value="">Sort By (Default)</option>
            <option value="rating" style={{ color: 'black' }}>Highest Rated</option>
            {showDistanceSort && <option value="distance" style={{ color: 'black' }}>Nearest</option>}
          </select>

          {showDistanceSort && (
            <select value={radius} onChange={(e) => setRadius(e.target.value)} style={inputStyle}>
              <option value="">Any Distance</option>
              <option value="5" style={{ color: 'black' }}>Within 5 km</option>
              <option value="10" style={{ color: 'black' }}>Within 10 km</option>
              <option value="25" style={{ color: 'black' }}>Within 25 km</option>
            </select>
          )}

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={openNow} onChange={(e) => setOpenNow(e.target.checked)} style={{ width: '1.2rem', height: '1.2rem' }} />
            Open Now
          </label>
        </div>
      )}
    </form>
  );
}
