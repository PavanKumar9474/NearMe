import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MapComponent from '../components/MapComponent';
import PlaceCard from '../components/PlaceCard';
import SearchBar from '../components/SearchBar';

export default function HomePage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  const fetchPlaces = useCallback((searchParams = {}) => {
    setLoading(true);
    let url = 'http://127.0.0.1:8000/api/places/';
    const params = new URLSearchParams();
    
    if (searchParams.category) {
      params.append('category', searchParams.category);
    }
    if (searchParams.query) {
      params.append('search', searchParams.query);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    axios.get(url)
      .then(res => {
        setPlaces(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching places:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchPlaces();
    
    // Request user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.log("Location access denied or error:", err),
        { timeout: 10000 }
      );
    }
  }, [fetchPlaces]);

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="animate-fade-in" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Discover Places Near You</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Find the best spots, hidden gems, and local favorites in your area.</p>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <SearchBar onSearch={fetchPlaces} />
      </div>
      
      <div style={{ marginBottom: '3rem', animationDelay: '0.2s' }} className="animate-fade-in">
        <MapComponent places={places} userLocation={userLocation} />
      </div>
      
      <h2 style={{ marginBottom: '1.5rem' }}>Popular Places</h2>
      {loading ? (
        <p>Loading places...</p>
      ) : (
        <div className="grid-cards">
          {places.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
          {places.length === 0 && <p>No places found matching your search. Try suggesting one!</p>}
        </div>
      )}
    </div>
  );
}
