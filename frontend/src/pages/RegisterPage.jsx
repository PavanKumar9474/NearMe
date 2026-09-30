import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Type, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 6) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const getStrengthColor = (s) => {
    if (s === 0) return 'transparent';
    if (s <= 25) return '#ef4444'; // red
    if (s <= 50) return '#f59e0b'; // orange
    if (s <= 75) return '#eab308'; // yellow
    return '#10b981'; // green
  };

  const strength = getPasswordStrength(formData.password);

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                className="input-glass"
                style={{ paddingLeft: '2.75rem' }} 
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
                className="input-glass"
                style={{ paddingLeft: '2.75rem' }} 
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
              className="input-glass"
              style={{ paddingLeft: '3rem' }} 
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
              className="input-glass"
              style={{ paddingLeft: '3rem' }} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Lock size={20} />
            </div>
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password" 
              placeholder="Password"
              required 
              value={formData.password} 
              onChange={handleChange} 
              className="input-glass"
              style={{ paddingLeft: '3rem', paddingRight: '3.5rem' }} 
            />
            <div 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: '0.2rem' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password.length > 0 && (
            <div style={{ marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ height: '100%', width: `${strength}%`, background: getStrengthColor(strength), transition: 'all 0.3s ease' }}></div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', textAlign: 'right' }}>
                {strength <= 25 && 'Weak'}
                {strength === 50 && 'Fair'}
                {strength === 75 && 'Good'}
                {strength === 100 && 'Strong'}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem', padding: '1.25rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? (
              <div className="spinner" style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
            ) : (
              <>Sign Up <ArrowRight size={20} /></>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }}></div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Or sign up with</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={() => {}} style={{ flex: 1, padding: '0.875rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '0.75rem', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', transition: 'var(--transition-smooth)', fontWeight: 500 }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" onClick={() => {}} style={{ flex: 1, padding: '0.875rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '0.75rem', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', transition: 'var(--transition-smooth)', fontWeight: 500 }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
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
