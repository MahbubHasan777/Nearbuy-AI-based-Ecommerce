'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ lat, lng, onChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectResult = (result: any) => {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    onChange(newLat, newLng);
    setSearchResults([]);
    setSearchQuery('');
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, { zoomControl: true }).setView([lat, lng], 14);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current = marker;

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onChange(pos.lat, pos.lng);
      });

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng);
        onChange(e.latlng.lat, e.latlng.lng);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
    }
  }, [lat, lng]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div className="relative w-full h-full">
        <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden z-0" />
        
        {/* Search Overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-[1000]">
          <form onSubmit={searchLocation} className="flex bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for a location..."
              className="flex-1 px-4 py-3 text-sm outline-none"
            />
            <button type="submit" disabled={isSearching} className="px-4 bg-primary text-white font-bold flex items-center justify-center disabled:opacity-70">
              {isSearching ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <span className="material-symbols-outlined">search</span>
              )}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="mt-2 bg-white rounded-xl shadow-xl border border-slate-200 max-h-60 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  onClick={() => selectResult(result)}
                  className="px-4 py-3 border-b last:border-b-0 border-slate-100 hover:bg-slate-50 cursor-pointer text-sm"
                >
                  <p className="font-semibold text-on-surface line-clamp-1">{result.display_name.split(',')[0]}</p>
                  <p className="text-xs text-outline line-clamp-1">{result.display_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
