import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Type } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
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
        setLoading(false);
      });
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '3.5rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Decorative background blur */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'var(--accent-primary)', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.3, zIndex: -1 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '150px', height: '150px', background: '#ec4899', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.3, zIndex: -1 }}></div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Join us to discover the best places around you.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {error && (
            <div style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center', fontWeight: 500, fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                <Type size={18} />
              </div>
              <input 
                type="text" 
                name="first_name" 
                placeholder="First Name"
                value={formData.first_name} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(255, 255, 255, 0.03)', color: 'white', fontSize: '0.95rem', transition: 'var(--transition-smooth)' }} 
                onFocus={(e) => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.borderColor = 'var(--accent-primary)'; }}
                onBlur={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.03)'; e.target.style.borderColor = 'var(--border-glass)'; }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                <Type size={18} />
              </div>
              <input 
                type="text" 
                name="last_name" 
                placeholder="Last Name"
                value={formData.last_name} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(255, 255, 255, 0.03)', color: 'white', fontSize: '0.95rem', transition: 'var(--transition-smooth)' }} 
                onFocus={(e) => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.borderColor = 'var(--accent-primary)'; }}
                onBlur={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.03)'; e.target.style.borderColor = 'var(--border-glass)'; }}
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Mail size={20} />
            </div>
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address"
              required 
              value={formData.email} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(255, 255, 255, 0.03)', color: 'white', fontSize: '1rem', transition: 'var(--transition-smooth)' }} 
              onFocus={(e) => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.borderColor = 'var(--accent-primary)'; }}
              onBlur={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.03)'; e.target.style.borderColor = 'var(--border-glass)'; }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <User size={20} />
            </div>
            <input 
              type="text" 
              name="username" 
              placeholder="Username"
              required 
              value={formData.username} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(255, 255, 255, 0.03)', color: 'white', fontSize: '1rem', transition: 'var(--transition-smooth)' }} 
              onFocus={(e) => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.borderColor = 'var(--accent-primary)'; }}
              onBlur={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.03)'; e.target.style.borderColor = 'var(--border-glass)'; }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              name="password" 
              placeholder="Password"
              required 
              value={formData.password} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(255, 255, 255, 0.03)', color: 'white', fontSize: '1rem', transition: 'var(--transition-smooth)' }} 
              onFocus={(e) => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.borderColor = 'var(--accent-primary)'; }}
              onBlur={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.03)'; e.target.style.borderColor = 'var(--border-glass)'; }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem', padding: '1.25rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Creating account...' : 'Sign Up'}
            {!loading && <ArrowRight size={20} />}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Already have an account?</span>
            <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, transition: 'var(--transition-smooth)' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-hover)'} onMouseOut={(e) => e.target.style.color = 'var(--accent-primary)'}>
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
