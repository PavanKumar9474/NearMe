import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MapComponent from '../components/MapComponent';
import PlaceCard from '../components/PlaceCard';
import SearchBar from '../components/SearchBar';

export default function HomePage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaces = useCallback((searchParams = {}) => {
    setLoading(true);
    let url = 'http://127.0.0.1:8000/api/places/';
    const params = new URLSearchParams();
    
    if (searchParams.category) {
      params.append('category', searchParams.category);
    }
    if (searchParams.query) {
      params.append('search', searchParams.query); // Requires backend search filter setup
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    axios.get(url)
      .then(res => {
        // Simple client-side filtering if backend search is not configured
        let data = res.data;
        if (searchParams.query) {
          const q = searchParams.query.toLowerCase();
          data = data.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
        }
        setPlaces(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching places:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchPlaces();
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
          {places.length === 0 && <p>No places found matching your search. Try suggesting one!</p>}
        </div>
      )}
    </div>
  );
}
