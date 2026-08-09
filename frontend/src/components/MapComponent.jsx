import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapBounds({ places }) {
  const map = useMap();

  useEffect(() => {
    if (places.length > 0) {
      const bounds = L.latLngBounds(places.map(p => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [places, map]);

  return null;
}

export default function MapComponent({ places }) {
  const defaultCenter = [40.7128, -74.0060]; // NYC as default if no places

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
      <MapContainer 
        center={places.length > 0 ? [places[0].latitude, places[0].longitude] : defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {places.map(place => (
          <Marker key={place.id} position={[place.latitude, place.longitude]}>
            <Popup>
              <div style={{ color: '#000', minWidth: '150px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{place.name}</h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem' }}>{place.address}</p>
                <Link to={`/place/${place.id}`} style={{ display: 'block', textAlign: 'center', background: '#3b82f6', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', textDecoration: 'none', fontSize: '0.8rem' }}>
                  Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapBounds places={places} />
      </MapContainer>
    </div>
  );
}
