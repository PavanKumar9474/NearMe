import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Navigation } from 'lucide-react';

export default function PlaceCard({ place }) {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {place.image && (
        <img 
          src={`http://127.0.0.1:8000${place.image}`} 
          alt={place.name} 
          style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem' }}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{place.name}</h3>
        {place.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
            <Star size={16} fill="currentColor" />
            <span style={{ fontWeight: 600 }}>{place.rating}</span>
          </div>
        )}
      </div>
      <p style={{ margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <MapPin size={16} style={{ flexShrink: 0, marginTop: '0.2rem' }} />
        <span style={{ fontSize: '0.875rem' }}>{place.address}</span>
      </p>
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
        <Link to={`/place/${place.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          View Details
        </Link>
      </div>
    </div>
  );
}
