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

function MapBounds({ places, userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (places.length > 0) {
      const bounds = L.latLngBounds(places.map(p => [p.latitude, p.longitude]));
      if (userLocation) {
        bounds.extend(userLocation);
      }
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (userLocation) {
      map.flyTo(userLocation, 14);
    }
  }, [places, userLocation, map]);

  return null;
}

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapComponent({ places, userLocation }) {
  const defaultCenter = userLocation || [40.7128, -74.0060]; // User location or NYC

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
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
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
        <MapBounds places={places} userLocation={userLocation} />
      </MapContainer>
    </div>
  );
}
