import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlaceCard from '../components/PlaceCard';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch user details
    axios.get('http://127.0.0.1:8000/api/users/', config)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setUser(res.data[0]);
        }
      })
      .catch(err => console.error("Error fetching user", err));

    // Fetch favorites
    axios.get('http://127.0.0.1:8000/api/favorites/', config)
      .then(res => {
        setFavorites(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching favorites:", err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div className="container">Loading profile...</div>;

  return (
    <div className="container animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>
      
      {user && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>{user.first_name} {user.last_name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>@{user.username}</p>
            <p style={{ marginTop: '0.5rem' }}>{user.email}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: 500 }}>
              <input type="checkbox" checked={pushEnabled} onChange={(e) => {
                setPushEnabled(e.target.checked);
                if (e.target.checked) alert('Push notifications enabled!');
              }} style={{ width: '1.2rem', height: '1.2rem' }} />
              Enable Push Notifications
            </label>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: '1.5rem' }}>My Favorites</h2>
      <div className="grid-cards">
        {favorites.map(fav => (
          <PlaceCard key={fav.id} place={fav.place_details} />
        ))}
        {favorites.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>You haven't added any favorites yet.</p>}
      </div>
    </div>
  );
}
