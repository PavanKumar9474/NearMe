import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/token/', formData)
      .then(res => {
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        navigate('/');
        window.location.reload(); // Quick way to update navbar state
      })
      .catch(err => {
        console.error("Login error:", err);
        setError('Invalid username or password');
      });
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h1>
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center' }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 600 }}>Username</label>
          <input type="text" name="username" required value={formData.username} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 600 }}>Password</label>
          <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Login</button>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Sign up</Link>
        </p>
      </form>
    </div>
  );
}
