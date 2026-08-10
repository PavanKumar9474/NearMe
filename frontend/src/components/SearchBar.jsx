import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, category });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={{ display: 'flex', gap: '1rem', padding: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flex: '1', minWidth: '200px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0 1rem', border: '1px solid var(--border-glass)' }}>
        <Search size={20} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder="Search places..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
        />
      </div>
      <select 
        value={category} 
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', minWidth: '150px' }}
      >
        <option value="">All Categories</option>
        {categories.map(c => <option key={c.id} value={c.slug} style={{ color: 'black' }}>{c.name}</option>)}
      </select>
      <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Search</button>
    </form>
  );
}
