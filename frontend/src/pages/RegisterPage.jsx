import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/register/', formData)
      .then(() => {
        // Automatically log them in after registration
        return axios.post('http://127.0.0.1:8000/api/token/', {
          username: formData.username,
          password: formData.password
        });
      })
      .then(res => {
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        navigate('/');
        window.location.reload();
      })
      .catch(err => {
        console.error("Registration error:", err);
        setError('Error registering. Please try another username.');
      });
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '500px', marginTop: '4rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create an Account</h1>
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>First Name</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Last Name</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Email</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Username</label>
          <input type="text" name="username" required value={formData.username} onChange={handleChange} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
          <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }} />
        </div>
        
        <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1.25rem', fontSize: '1.1rem' }}>Sign Up</button>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
        </p>
      </form>
    </div>
  );
}
