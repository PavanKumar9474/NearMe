import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

export default function PlaceCard({ place }) {
  return (
    <div className="glass-panel animate-fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      {place.image ? (
        <div style={{ overflow: 'hidden', height: '200px' }}>
          <img 
            src={`http://127.0.0.1:8000${place.image}`} 
            alt={place.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
      ) : (
        <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MapPin size={48} color="var(--border-glass-hover)" />
        </div>
      )}
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {place.name}
          </h3>
          {place.rating && (
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', 
              background: 'rgba(0,0,0,0.4)', padding: '0.25rem 0.5rem', borderRadius: '1rem' 
            }}>
              <Star size={14} fill="currentColor" />
              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{place.rating}</span>
            </div>
          )}
        </div>
        
        {place.category_name && (
          <span style={{ 
            alignSelf: 'flex-start', background: 'var(--accent-primary)', color: 'white', 
            padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' 
          }}>
            {place.category_name}
          </span>
        )}
        
        <p style={{ margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <MapPin size={16} style={{ flexShrink: 0, marginTop: '0.2rem' }} />
          <span style={{ fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {place.address}
          </span>
        </p>
        
        <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
          <Link to={`/place/${place.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
