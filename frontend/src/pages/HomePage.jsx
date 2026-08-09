import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapComponent from '../components/MapComponent';
import PlaceCard from '../components/PlaceCard';

export default function HomePage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/places/')
      .then(res => {
        setPlaces(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching places:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="animate-fade-in" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Discover Places Near You</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Find the best spots, hidden gems, and local favorites in your area.</p>
      </div>
      
      <div style={{ marginBottom: '3rem', animationDelay: '0.2s' }} className="animate-fade-in">
        <MapComponent places={places} />
      </div>
      
      <h2 style={{ marginBottom: '1.5rem' }}>Popular Places</h2>
      {loading ? (
        <p>Loading places...</p>
      ) : (
        <div className="grid-cards">
          {places.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
          {places.length === 0 && <p>No places found. Try suggesting one!</p>}
        </div>
      )}
    </div>
  );
}
