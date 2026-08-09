import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddPlacePage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '', category: '', address: '', latitude: '', longitude: '',
    phone: '', website: '', description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/suggestions/', formData)
      .then(() => {
        alert("Suggestion submitted successfully!");
        navigate('/');
      })
      .catch(err => {
        console.error("Error submitting:", err);
        alert("Error submitting suggestion.");
      });
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Suggest a Place</h1>
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Category</label>
            <select name="category" required value={formData.category} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
              <option value="">Select a category</option>
              {categories.map(c => <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
            <label style={{ fontWeight: 600 }}>Address</label>
            <input type="text" name="address" required value={formData.address} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Latitude</label>
            <input type="number" step="any" name="latitude" required value={formData.latitude} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Longitude</label>
            <input type="number" step="any" name="longitude" required value={formData.longitude} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Website</label>
            <input type="url" name="website" value={formData.website} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
            <label style={{ fontWeight: 600 }}>Description</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }}></textarea>
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>Submit Suggestion</button>
      </form>
    </div>
  );
}
