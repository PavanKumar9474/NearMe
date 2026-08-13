import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapClickHandler({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);
  return null;
}

export default function LocationPickerMap({ position, setPosition }) {
  const defaultCenter = [40.7128, -74.0060]; // NYC as default
  const mapCenter = position || defaultCenter;

  const handleGetCurrentLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Error getting location:", err);
          alert("Could not get your location. Please check your browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Location on Map</label>
        <button 
          onClick={handleGetCurrentLocation}
          style={{ 
            background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', 
            color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.875rem'
          }}
          type="button"
        >
          <MapPin size={16} /> Use My Location
        </button>
      </div>
      
      <div style={{ height: '300px', width: '100%', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapClickHandler setPosition={setPosition} />
          <MapUpdater position={position} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>
      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Click on the map to set the precise location.</p>
    </div>
  );
}
