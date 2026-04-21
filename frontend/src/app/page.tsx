'use client';
import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

interface Shop {
  id: string;
  shopName: string;
  shopAddress: string;
  lat: number;
  lng: number;
  profilePic?: string;
  bannerMsg?: string;
  distance_km?: number;
}

export default function CustomerHomePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [radius, setRadius] = useState(5000);
  const [loadingShops, setLoadingShops] = useState(true);
  const [locationStatus, setLocationStatus] = useState<'pending' | 'granted' | 'denied' | 'idle'>('idle');
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [pickerLat, setPickerLat] = useState(23.8103);
  const [pickerLng, setPickerLng] = useState(90.4125);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'ADMIN') { router.replace('/admin/dashboard'); return; }
      if (user.role === 'SHOP') { router.replace('/shop/dashboard'); return; }
    }
  }, [user, loading]);

  const fetchShops = useCallback((lat?: number, lng?: number, r?: number) => {
    setLoadingShops(true);
    const params: any = { radius: r ?? radius };
    if (lat) params.lat = lat;
    if (lng) params.lng = lng;
    api.get('/customer/nearby-shops', { params })
      .then(res => setShops(Array.isArray(res.data) ? res.data : []))
      .catch(() => setShops([]))
      .finally(() => setLoadingShops(false));
  }, [radius]);

  useEffect(() => {
    if (loading) return;
    if (!user) { setLoadingShops(false); return; }
    if (locationStatus === 'idle') {
      setLocationStatus('pending');
      navigator.geolocation?.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setUserLat(latitude); setUserLng(longitude);
          setLocationStatus('granted');
          fetchShops(latitude, longitude, radius);
          api.patch('/customer/location', { lat: latitude, lng: longitude }).catch(() => {});
        },
        () => {
          setLocationStatus('denied');
          fetchShops(undefined, undefined, radius);
        },
        { timeout: 8000 }
      );
    }
  }, [user, loading]);

  const savePickedLocation = async () => {
    setUserLat(pickerLat); setUserLng(pickerLng);
    setLocationStatus('granted');
    setShowMapPicker(false);
    fetchShops(pickerLat, pickerLng, radius);
    api.patch('/customer/location', { lat: pickerLat, lng: pickerLng }).catch(() => {});
  };

  useEffect(() => {
    if (locationStatus === 'granted' && userLat && userLng) {
      fetchShops(userLat, userLng, radius);
    } else if (locationStatus === 'denied') {
      fetchShops(undefined, undefined, radius);
    }
  }, [radius]);

  const filtered = shops.filter(s =>
    s.shopName.toLowerCase().includes(search.toLowerCase()) ||
    (s.shopAddress ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const BASE = 'http://localhost:3001/uploads/';

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 font-sans flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <span className="material-symbols-outlined text-5xl text-white">location_city</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-3">NearBuy</h1>
          <p className="text-blue-200 text-lg mb-10 max-w-sm">Discover local shops and products near you, instantly.</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
            <Link href="/login" className="flex-1 bg-white text-blue-900 font-bold py-4 rounded-2xl text-center shadow-lg hover:bg-blue-50 active:scale-95 transition-all">
              Sign In
            </Link>
            <Link href="/register" className="flex-1 bg-white/10 backdrop-blur border border-white/20 text-white font-bold py-4 rounded-2xl text-center hover:bg-white/20 active:scale-95 transition-all">
              Register
            </Link>
          </div>
        </div>

        <div className="px-6 pb-12">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6">
            <h2 className="text-white font-bold text-lg mb-1">Why NearBuy?</h2>
            <p className="text-blue-200 text-sm mb-4">Support local businesses while getting what you need.</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: 'near_me', label: 'Hyperlocal' },
                { icon: 'inventory_2', label: 'Live Stock' },
                { icon: 'favorite', label: 'Wishlist' },
              ].map(f => (
                <div key={f.label} className="bg-white/5 rounded-2xl p-4 flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-blue-300 text-2xl">{f.icon}</span>
                  <span className="text-white text-xs font-semibold">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background font-sans text-on-background min-h-screen flex flex-col">
      <TopNavBar variant="customer" onSearch={q => router.push(`/search?q=${encodeURIComponent(q)}`)} />

      <main className="flex-1 flex flex-col lg:flex-row gap-0 max-w-[1440px] mx-auto w-full">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 p-4 lg:p-6 lg:border-r border-slate-100 lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 lg:overflow-y-auto">
          {/* Location Status */}
          <div className={`mb-4 rounded-2xl p-4 flex items-center gap-3 ${
            locationStatus === 'granted' ? 'bg-green-50 border border-green-100' :
            locationStatus === 'denied' ? 'bg-amber-50 border border-amber-100' :
            locationStatus === 'pending' ? 'bg-blue-50 border border-blue-100' :
            'bg-slate-50 border border-slate-100'
          }`}>
            <span className={`material-symbols-outlined text-2xl ${
              locationStatus === 'granted' ? 'text-green-500' :
              locationStatus === 'denied' ? 'text-amber-500' :
              'text-blue-400'
            }`}>
              {locationStatus === 'granted' ? 'location_on' : locationStatus === 'denied' ? 'location_off' : 'my_location'}
            </span>
            <div className="flex-1">
              <p className="text-xs font-bold text-on-surface">
                {locationStatus === 'granted' ? 'Using your location' :
                 locationStatus === 'denied' ? 'Location not shared' :
                 locationStatus === 'pending' ? 'Getting your location...' : 'Location'}
              </p>
              <p className="text-xs text-outline">
                {locationStatus === 'granted' ? 'Shops sorted by distance' :
                 locationStatus === 'denied' ? 'Showing all shops' :
                 'Allow for better results'}
              </p>
            </div>
            <button
              onClick={() => {
                if (userLat && userLng) { setPickerLat(userLat); setPickerLng(userLng); }
                setShowMapPicker(true);
              }}
              className="flex-shrink-0 p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              title="Pick location on map"
            >
              <span className="material-symbols-outlined text-sm text-primary">map</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search shops..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Radius Slider */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-on-surface">Search Radius</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {(radius / 1000).toFixed(1)} km
              </span>
            </div>
            <input
              type="range" min="500" max="10000" step="500"
              value={radius}
              onChange={e => setRadius(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-1 text-xs text-outline">
              <span>0.5km</span><span>5km</span><span>10km</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link href="/wishlist" className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg">
              <span className="material-symbols-outlined text-2xl fill-icon">favorite</span>
              <span className="text-xs font-bold">Wishlist</span>
            </Link>
            <Link href="/orders" className="bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg">
              <span className="material-symbols-outlined text-2xl fill-icon">receipt_long</span>
              <span className="text-xs font-bold">Orders</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-primary-container to-blue-600 text-white rounded-2xl p-5 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs opacity-75 uppercase tracking-widest font-bold mb-1">Shops Found</p>
              <h3 className="text-4xl font-black">{loadingShops ? '...' : filtered.length}</h3>
              <p className="text-xs opacity-75 mt-1">within {(radius / 1000).toFixed(1)} km radius</p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -right-2 -top-6 w-16 h-16 bg-white/5 rounded-full" />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-black text-on-surface">Nearby Shops</h1>
              <p className="text-outline text-sm">{filtered.length} shops near you</p>
            </div>
            <Link href="/search" className="flex items-center gap-2 bg-primary-container text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-sm">grid_view</span>
              Browse All
            </Link>
          </div>

          {loadingShops ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                  <div className="h-36 bg-slate-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl text-outline">store_mall_directory</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">No shops found</h3>
              <p className="text-outline text-sm mb-6">Try increasing the radius or search with a different keyword</p>
              <button onClick={() => setRadius(10000)} className="px-6 py-3 bg-primary-container text-white rounded-xl font-bold text-sm">
                Expand to 10 km
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(shop => (
                <Link key={shop.id} href={`/shops/${shop.id}`}>
                  <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer">
                    {/* Banner/Image */}
                    <div className="h-36 bg-gradient-to-br from-slate-100 to-blue-50 relative overflow-hidden flex items-center justify-center">
                      {shop.profilePic ? (
                        <img
                          src={`${BASE}${shop.profilePic}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={shop.shopName}
                        />
                      ) : (
                        <span className="material-symbols-outlined text-5xl text-outline/30">storefront</span>
                      )}
                      {shop.distance_km && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">near_me</span>
                          {shop.distance_km} km
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors truncate">{shop.shopName}</h3>
                      <p className="text-outline text-xs mt-1 flex items-center gap-1 truncate">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {shop.shopAddress || 'Address not set'}
                      </p>
                      {shop.bannerMsg && (
                        <p className="text-xs text-primary bg-primary/5 rounded-lg px-2 py-1 mt-2 line-clamp-1 italic">
                          "{shop.bannerMsg}"
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                          Open
                        </span>
                        <span className="text-xs text-primary font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Visit <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Map Location Picker Modal */}
      {showMapPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-on-surface text-lg">Pick Your Location</h3>
                <p className="text-xs text-outline mt-0.5">Click on the map or drag the pin to set your location</p>
              </div>
              <button onClick={() => setShowMapPicker(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <div className="h-72 w-full relative">
              <LocationPicker
                lat={pickerLat}
                lng={pickerLng}
                onChange={(lat, lng) => { setPickerLat(lat); setPickerLng(lng); }}
              />
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-outline">
                📍 {pickerLat.toFixed(4)}, {pickerLng.toFixed(4)}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowMapPicker(false)} className="px-4 py-2 border border-outline-variant rounded-xl text-sm font-semibold">
                  Cancel
                </button>
                <button onClick={savePickedLocation} className="px-6 py-2 bg-primary-container text-white rounded-xl text-sm font-bold shadow hover:bg-primary transition-colors">
                  Use This Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar variant="customer" />
    </div>
  );
}
