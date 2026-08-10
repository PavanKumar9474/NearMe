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
    <nav className="glass-navbar" style={{ padding: '1rem 2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'white' }}>
          <MapPin size={32} color="var(--accent-primary)" />
          <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>NearMe</span>
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/add" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <PlusCircle size={20} />
            Suggest Place
          </Link>
          
          {token ? (
            <>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)', marginLeft: '1rem' }}>
                <User size={20} /> Profile
              </Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)', marginLeft: '1rem' }}>
              <LogIn size={20} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
