import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LocationPickerMap from '../components/LocationPickerMap';
export default function AddPlacePage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '', category: '', address: '', latitude: '', longitude: '',
    phone: '', website: '', description: '', opening_hours: ''
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
    const token = localStorage.getItem('access_token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    axios.post('http://127.0.0.1:8000/api/suggestions/', formData, config)
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
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Name</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }} placeholder="e.g. Central Park" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
          <select name="category" required value={formData.category} onChange={handleChange} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }}>
            <option value="" style={{ color: 'black' }}>Select a category</option>
            {categories.map(c => <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', gridColumn: '1 / -1' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Address</label>
          <input type="text" name="address" required value={formData.address} onChange={handleChange} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }} placeholder="123 Main St" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <LocationPickerMap 
            position={formData.latitude && formData.longitude ? [parseFloat(formData.latitude), parseFloat(formData.longitude)] : null}
            setPosition={(pos) => setFormData({ ...formData, latitude: pos[0].toFixed(6), longitude: pos[1].toFixed(6) })}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }} placeholder="(555) 123-4567" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Website</label>
          <input type="url" name="website" value={formData.website} onChange={handleChange} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }} placeholder="https://example.com" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', gridColumn: '1 / -1' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Opening Hours</label>
          <input type="text" name="opening_hours" value={formData.opening_hours} onChange={handleChange} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }} placeholder="e.g. Mon-Fri 9AM-5PM" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', gridColumn: '1 / -1' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem', resize: 'vertical' }} placeholder="Tell us more about this place..."></textarea>
        </div>
        
        <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', padding: '1.25rem', fontSize: '1.1rem', marginTop: '1rem' }}>Submit Suggestion</button>
      </form>
    </div>
  );
}
