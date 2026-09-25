import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MapComponent from '../components/MapComponent';
import PlaceCard from '../components/PlaceCard';
import SearchBar from '../components/SearchBar';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [recommendedPlaces, setRecommendedPlaces] = useState(null);
  const [aiMessage, setAiMessage] = useState('');
  const [aiPreferences, setAiPreferences] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const fetchPlaces = useCallback((searchParams = {}) => {
    // ... no changes to fetchPlaces ... (Actually I have to include fetchPlaces here)
    setLoading(true);
    let url = 'http://127.0.0.1:8000/api/places/';
    const params = new URLSearchParams();
    
    if (searchParams.category) params.append('category', searchParams.category);
    if (searchParams.query) params.append('search', searchParams.query);
    if (searchParams.minRating) params.append('min_rating', searchParams.minRating);
    if (searchParams.sortBy) params.append('sort_by', searchParams.sortBy);
    if (searchParams.radius) params.append('radius', searchParams.radius);
    
    if (searchParams.userLocation) {
      params.append('user_lat', searchParams.userLocation[0]);
      params.append('user_lon', searchParams.userLocation[1]);
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
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.log("Location access denied or error:", err),
        { timeout: 10000 }
      );
    }
  }, [fetchPlaces]);

  const handleAiRecommend = () => {
    if (!showAiInput) {
      setShowAiInput(true);
      return;
    }
    
    setAiLoading(true);
    setAiMessage('');
    axios.get(`http://127.0.0.1:8000/api/places/recommendations/?preferences=${encodeURIComponent(aiPreferences)}`)
      .then(res => {
        setRecommendedPlaces(res.data.data);
        setAiMessage(res.data.message);
        setAiLoading(false);
      })
      .catch(err => {
        console.error("Error fetching AI recommendations:", err);
        setAiMessage("Failed to get recommendations. Please try again.");
        setAiLoading(false);
      });
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="animate-fade-in" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Discover Places Near You</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Find the best spots, hidden gems, and local favorites in your area.</p>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <SearchBar 
          onSearch={(params) => fetchPlaces({ ...params, userLocation })} 
          showDistanceSort={!!userLocation} 
        />
      </div>
      
      <div style={{ marginBottom: '3rem', animationDelay: '0.2s' }} className="animate-fade-in">
        <MapComponent places={places} userLocation={userLocation} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ margin: 0 }}>Popular Places</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: showAiInput ? '100%' : 'auto', transition: 'all 0.3s ease' }}>
            {showAiInput && (
              <input 
                type="text" 
                placeholder="What are you looking for? (e.g. A cozy cafe to work from)" 
                value={aiPreferences}
                onChange={(e) => setAiPreferences(e.target.value)}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--accent-primary)', background: 'rgba(0,0,0,0.2)', color: 'white', minWidth: '250px' }}
                onKeyDown={(e) => e.key === 'Enter' && handleAiRecommend()}
              />
            )}
            <button onClick={handleAiRecommend} disabled={aiLoading || places.length === 0} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--accent-gradient)', whiteSpace: 'nowrap' }}>
              <Sparkles size={18} />
              {aiLoading ? 'Analyzing...' : showAiInput ? 'Get Recommendations' : 'AI Recommendations'}
            </button>
          </div>
        </div>
      </div>
      
      {recommendedPlaces && (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
            <Sparkles size={24} />
            <h3 style={{ margin: 0 }}>AI Top Picks For You</h3>
          </div>
          {aiMessage && <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{aiMessage}</p>}
          <div className="grid-cards">
            {recommendedPlaces.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      )}

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
