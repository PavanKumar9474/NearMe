import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';

export default function PlaceCard({ place }) {
  return (
    <div className="glass-panel animate-fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      position: 'relative',
      height: '100%',
      transition: 'var(--transition-bounce)'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      const img = e.currentTarget.querySelector('.card-image');
      if (img) img.style.transform = 'scale(1.08)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      const img = e.currentTarget.querySelector('.card-image');
      if (img) img.style.transform = 'scale(1)';
    }}>
      {place.image ? (
        <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
          <img 
            className="card-image"
            src={`http://127.0.0.1:8000${place.image}`} 
            alt={place.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
          {/* Gradient Overlay for better text readability and premium look */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.4) 50%, transparent 100%)', pointerEvents: 'none' }}></div>
          
          <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {place.category_name && (
              <span style={{ 
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', 
                padding: '0.35rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(255,255,255,0.2)'
              }}>
                {place.category_name}
              </span>
            )}
            
            {place.rating && (
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', 
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '0.35rem 0.75rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Star size={14} fill="currentColor" />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{place.rating}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', height: '220px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MapPin size={56} color="var(--accent-primary)" style={{ opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             {place.category_name && (
              <span style={{ 
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', 
                padding: '0.35rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(255,255,255,0.2)'
              }}>
                {place.category_name}
              </span>
            )}
          </div>
        </div>
      )}
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: '1.35rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 700, lineHeight: 1.3 }}>
          {place.name}
        </h3>
        
        <p style={{ margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
          <MapPin size={16} style={{ flexShrink: 0, marginTop: '0.2rem', color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
            {place.address}
          </span>
        </p>
        
        <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
          <Link 
            to={`/place/${place.id}`} 
            style={{ 
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', 
              textDecoration: 'none', background: 'rgba(255,255,255,0.05)', color: 'white',
              padding: '0.875rem', borderRadius: '0.75rem', fontWeight: 600, transition: 'all 0.3s ease',
              border: '1px solid var(--border-glass)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--accent-gradient)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'var(--border-glass)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            View Details <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
