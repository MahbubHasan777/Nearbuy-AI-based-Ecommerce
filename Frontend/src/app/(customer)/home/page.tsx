'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/axios';
import styles from './home.module.css';
import { Search, MapPin, Navigation } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Map...</div> });

export default function CustomerHome() {
  const [profile, setProfile] = useState<any>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [radius, setRadius] = useState(5000);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/customer/profile');
      setProfile(res.data);
      setRadius(res.data.radiusMeters || 5000);
      if (res.data.lat && res.data.lng) {
        fetchNearbyShops(res.data.lat, res.data.lng, res.data.radiusMeters);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNearbyShops = async (lat: number, lng: number, rad: number) => {
    try {
      // Temporary endpoint mock for nearby shops, normally handled by search?radius=...
      const res = await api.get(`/search?q=&radius=${rad}`);
      // Filter out duplicate shops from product search results
      const uniqueShops = Array.from(new Set(res.data.map((p: any) => p.shop.shopId)))
        .map(id => res.data.find((p: any) => p.shop.shopId === id).shop);
      setShops(uniqueShops);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateRadius = async () => {
    if (!profile) return;
    try {
      await api.patch('/customer/location', { lat: profile.lat, lng: profile.lng, radiusMeters: radius });
      fetchNearbyShops(profile.lat, profile.lng, radius);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&radius=${radius}`);
    }
  };

  if (!profile) return <div className={styles.container}>Loading...</div>;

  const center: [number, number] = profile.lat && profile.lng ? [profile.lat, profile.lng] : [23.8103, 90.4125];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>NearBuy</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Hello, {profile.fullName}</span>
          <button className="btn-secondary" onClick={() => api.post('/auth/logout').then(() => router.push('/login'))}>Logout</button>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.mapSection}>
          <div className={styles.mapWrapper}>
            <Map center={center} radius={radius} shops={shops} />
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.controlCard}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={20} /> Discover
            </h2>
            
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search for products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem' }}>
                <Search size={20} />
              </button>
            </form>

            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Search Radius</span>
                <span>{radius / 1000} km</span>
              </label>
              <input 
                type="range" 
                min="1000" 
                max="20000" 
                step="1000" 
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                onMouseUp={handleUpdateRadius}
                onTouchEnd={handleUpdateRadius}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>
          </div>

          <div className={styles.shopList}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} /> Nearby Shops ({shops.length})
            </h2>
            {shops.length === 0 ? (
              <p style={{ color: 'var(--secondary-foreground)', textAlign: 'center', marginTop: '2rem' }}>No shops found in this radius.</p>
            ) : (
              shops.map((shop, idx) => (
                <div key={idx} className={styles.shopItem} onClick={() => router.push(`/shop/${shop.shopId}`)} style={{ cursor: 'pointer' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{shop.shopName}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--secondary-foreground)' }}>{shop.distance_km?.toFixed(1)} km away</p>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
