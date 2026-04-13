'use client';
import { useEffect, useState, useRef } from 'react';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Shop {
  id: string;
  shopName: string;
  shopAddress: string;
  lat: number;
  lng: number;
  profilePic?: string;
  distance_km?: number;
}

export default function CustomerHomePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [radius, setRadius] = useState(5000);
  const router = useRouter();

  useEffect(() => {
    api.get('/customer/nearby-shops', { params: { radius } })
      .then(r => setShops(r.data))
      .catch(() => {});
  }, [radius]);

  return (
    <div className="bg-background font-sans text-on-background overflow-hidden h-screen flex flex-col">
      <TopNavBar variant="customer" onSearch={q => router.push(`/search?q=${encodeURIComponent(q)}`)} />

      <main className="relative flex overflow-hidden flex-1">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-surface-dim relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-50 via-slate-100 to-indigo-100 opacity-80" />
            <div className="absolute top-1/4 left-1/3 group cursor-pointer">
              <div className="bg-primary-container text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1 active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-sm fill-icon">store</span>
                <span className="text-xs font-bold">Nearby</span>
              </div>
              <div className="w-0.5 h-3 bg-primary-container mx-auto" />
            </div>
            <div className="absolute bottom-1/3 right-1/4 cursor-pointer">
              <div className="bg-secondary-container text-white px-3 py-1 rounded-full shadow-xl flex items-center gap-1 scale-110 ring-4 ring-white/30">
                <span className="material-symbols-outlined text-sm fill-icon">local_cafe</span>
                <span className="text-xs font-bold">Featured</span>
              </div>
              <div className="w-0.5 h-3 bg-secondary-container mx-auto" />
            </div>
            <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute -inset-8 bg-primary-container/20 rounded-full animate-ping" />
                <div className="relative bg-white p-1 rounded-full shadow-xl">
                  <div className="bg-primary-container w-4 h-4 rounded-full ring-2 ring-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="relative z-10 w-full md:w-[400px] h-full flex flex-col p-lg pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-lg shadow-xl mb-md border border-white/50 pointer-events-auto">
            <div className="flex justify-between items-center mb-md">
              <h3 className="text-xl font-semibold text-on-surface">Discovery Radius</h3>
              <span className="bg-primary-container/10 text-primary-container px-3 py-1 rounded-full text-xs font-semibold">
                {(radius / 1000).toFixed(1)} km
              </span>
            </div>
            <div className="relative py-4">
              <input
                type="range" min="500" max="10000" step="500"
                value={radius}
                onChange={e => setRadius(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary-container"
              />
              <div className="flex justify-between mt-2 text-xs text-outline">
                <span>0km</span><span>5km</span><span>10km</span>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 bg-surface-container-low hover:bg-surface-container-high transition-colors py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">filter_list</span> Filters
              </button>
              <button className="flex-1 bg-surface-container-low hover:bg-surface-container-high transition-colors py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">category</span> Categories
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/50 flex flex-col overflow-hidden pointer-events-auto">
            <div className="p-md border-b border-surface-variant flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <h2 className="font-semibold text-[18px]">Nearby Shops</h2>
                <span className="text-outline text-xs">({shops.length} found)</span>
              </div>
              <Link href="/search" className="text-primary text-xs font-bold hover:underline">View All</Link>
            </div>

            <div className="flex-1 overflow-y-auto p-md space-y-md">
              {shops.length === 0 && (
                <div className="text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl block mb-2">store_mall_directory</span>
                  <p>No shops found nearby</p>
                  <p className="text-xs mt-1">Try increasing the radius</p>
                </div>
              )}
              {shops.map(shop => (
                <Link key={shop.id} href={`/shops/${shop.id}`}>
                  <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-primary-fixed cursor-pointer">
                    <div className="flex h-28">
                      <div className="w-28 flex-shrink-0 bg-surface-container flex items-center justify-center">
                        {shop.profilePic ? (
                          <img src={`http://localhost:3001/${shop.profilePic}`} className="w-full h-full object-cover" alt={shop.shopName} />
                        ) : (
                          <span className="material-symbols-outlined text-3xl text-outline">storefront</span>
                        )}
                      </div>
                      <div className="p-md flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-[15px] group-hover:text-primary transition-colors">{shop.shopName}</h4>
                          </div>
                          <p className="text-outline text-xs mt-1">{shop.shopAddress}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold">OPEN</span>
                          {shop.distance_km && (
                            <span className="text-primary text-[10px] font-bold">{shop.distance_km} km away</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div className="absolute right-lg top-lg z-10 flex flex-col gap-sm pointer-events-none">
          <button className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-surface-container-low transition-colors pointer-events-auto border border-white/50">
            <span className="material-symbols-outlined text-on-surface">my_location</span>
          </button>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col pointer-events-auto border border-white/50">
            <button className="w-12 h-12 flex items-center justify-center hover:bg-surface-container-low transition-colors border-b border-surface-variant">
              <span className="material-symbols-outlined text-on-surface">add</span>
            </button>
            <button className="w-12 h-12 flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-on-surface">remove</span>
            </button>
          </div>
        </div>

        <Link href="/search" className="fixed bottom-24 right-lg z-50 lg:bottom-lg bg-secondary-container text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined fill-icon">shopping_basket</span>
          <span className="font-bold tracking-wide text-sm">QUICK ORDER</span>
        </Link>
      </main>

      <BottomNavBar variant="customer" />
    </div>
  );
}
