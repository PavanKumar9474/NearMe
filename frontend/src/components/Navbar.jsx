import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, PlusCircle, User, LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="glass-navbar" style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-glass)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'white' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>NearMe</span>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/add" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.6rem 1.25rem' }}>
            <PlusCircle size={18} />
            Suggest Place
          </Link>
          
          {token ? (
            <>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-secondary)', transition: 'color 0.2s', fontWeight: 500 }}
                onMouseOver={e => e.currentTarget.style.color = 'white'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <User size={20} /> Profile
              </Link>
              <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', transition: 'all 0.2s', fontWeight: 500 }}
                onMouseOver={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)'; }}
                onMouseOut={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--border-glass)'; }}
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-secondary)', transition: 'color 0.2s', fontWeight: 500 }}
              onMouseOver={e => e.currentTarget.style.color = 'white'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <LogIn size={20} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
