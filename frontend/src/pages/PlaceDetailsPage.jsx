import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Globe, Phone, Clock, Star, ArrowLeft, Heart, AlertTriangle } from 'lucide-react';
import ReportModal from '../components/ReportModal';

export default function PlaceDetailsPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchPlace = axios.get(`http://127.0.0.1:8000/api/places/${id}/`);
    const fetchFavorites = token ? axios.get('http://127.0.0.1:8000/api/favorites/', { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve({ data: [] });

    Promise.all([fetchPlace, fetchFavorites])
      .then(([placeRes, favRes]) => {
        setPlace(placeRes.data);
        const favs = favRes.data;
        if (favs.some(f => f.place === parseInt(id))) {
          setIsFavorite(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [id, token]);

  const toggleFavorite = () => {
    if (!token) return alert('Please login to favorite places.');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    if (isFavorite) {
      // Find the favorite ID to delete. For simplicity, just fetch again or assume the backend handles it.
      // A more robust implementation would store the favorite ID.
      axios.get('http://127.0.0.1:8000/api/favorites/', config).then(res => {
        const fav = res.data.find(f => f.place === parseInt(id));
        if (fav) {
          axios.delete(`http://127.0.0.1:8000/api/favorites/${fav.id}/`, config).then(() => setIsFavorite(false));
        }
      });
    } else {
      axios.post('http://127.0.0.1:8000/api/favorites/', { place: id }, config)
        .then(() => setIsFavorite(true))
        .catch(err => console.error("Error favoriting:", err));
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!place) return <div className="container">Place not found.</div>;

  return (
    <div className="container animate-fade-in">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', textDecoration: 'none', marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Back to Map
      </Link>
      
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {place.image && (
          <img 
            src={`http://127.0.0.1:8000${place.image}`} 
            alt={place.name} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '0.75rem' }}
          />
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h1 style={{ margin: 0 }}>{place.name}</h1>
              <button onClick={toggleFavorite} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFavorite ? '#ef4444' : 'var(--text-secondary)' }}>
                <Heart size={28} fill={isFavorite ? '#ef4444' : 'none'} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
              {place.category && <span style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem' }}>{place.category.name}</span>}
              {place.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                  <Star size={18} fill="currentColor" />
                  <span style={{ fontWeight: 600 }}>{place.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>About</h3>
            <p style={{ lineHeight: 1.7 }}>{place.description || "No description provided."}</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Contact Info</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <MapPin size={20} style={{ color: 'var(--accent-primary)', marginTop: '0.1rem' }} />
              <span>{place.address}</span>
            </div>
            {place.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={20} style={{ color: 'var(--accent-primary)' }} />
                <span>{place.phone}</span>
              </div>
            )}
            {place.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Globe size={20} style={{ color: 'var(--accent-primary)' }} />
                <a href={place.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)' }}>{place.website}</a>
              </div>
            )}
            {place.opening_hours && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Clock size={20} style={{ color: 'var(--accent-primary)', marginTop: '0.1rem' }} />
                <span>{place.opening_hours}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button 
            onClick={() => setShowReport(true)} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'none'; }}
          >
            <AlertTriangle size={16} /> Report Issue
          </button>
        </div>
      </div>
      
      {showReport && <ReportModal placeId={place.id} onClose={() => setShowReport(false)} />}
    </div>
  );
}
