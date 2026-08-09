import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, PlusCircle, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="glass-navbar" style={{ padding: '1rem 2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'white' }}>
          <MapPin size={32} color="var(--accent-primary)" />
          <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>NearMe</span>
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/add" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <PlusCircle size={20} />
            Suggest Place
          </Link>
        </div>
      </div>
    </nav>
  );
}
