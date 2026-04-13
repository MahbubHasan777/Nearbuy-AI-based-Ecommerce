'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

interface MapProps {
  center: [number, number];
  radius: number;
  shops: Array<{ id: string; shopName: string; lat: number; lng: number; phone: string }>;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export default function Map({ center, radius, shops, onLocationSelect }: MapProps) {
  useEffect(() => {
    // Leaflet fix for default icon
    L.Marker.prototype.options.icon = icon;
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '400px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Circle center={center} radius={radius} pathOptions={{ color: 'var(--primary)', fillColor: 'var(--primary)', fillOpacity: 0.1 }} />
        <Marker position={center} icon={icon}>
          <Popup>You are here</Popup>
        </Marker>
        
        {shops.map((shop) => (
          <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={icon}>
            <Popup>
              <strong>{shop.shopName}</strong><br/>
              {shop.phone}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
