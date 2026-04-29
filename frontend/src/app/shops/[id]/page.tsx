'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import api from '@/lib/api';
import Link from 'next/link';

interface ShopProfile {
  id: string;
  shopName: string;
  shopAddress: string;
  bannerMsg?: string;
  profilePic?: string;
  lat: number;
  lng: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  averageRating: number;
  totalRatings: number;
  status: string;
}

export default function ShopPublicPage() {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<ShopProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/shop/public/${id}`)
      .then(r => setShop(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    api.get(`/shop/public/${id}/products`)
      .then(r => setProducts(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
  }, [id]);

  const BASE = 'http://localhost:3001/uploads/';

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!shop) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <span className="material-symbols-outlined text-6xl text-outline">storefront_off</span>
      <p className="text-on-surface-variant font-semibold">Shop not found</p>
      <Link href="/" className="text-primary font-bold hover:underline">Go Home</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 font-sans">
      <TopNavBar variant="customer" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-12">
        {/* Hero Banner */}
        <div className="relative h-52 md:h-72 w-full rounded-3xl overflow-hidden mb-6 bg-gradient-to-br from-blue-100 to-indigo-200 shadow-lg">
          {shop.profilePic ? (
            <img src={`${BASE}${shop.profilePic}`} className="w-full h-full object-cover" alt={shop.shopName} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-9xl text-primary/20">storefront</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-md">{shop.shopName}</h1>
                <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {shop.shopAddress}
                </p>
              </div>
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Open
              </span>
            </div>
          </div>
        </div>

        {/* Banner Message */}
        {shop.bannerMsg && (
          <div className="bg-primary/5 border border-primary/10 rounded-2xl px-5 py-3 mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">campaign</span>
            <p className="text-primary font-medium text-sm italic">"{shop.bannerMsg}"</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 sticky top-24 space-y-5">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-outline mb-3">Location</h3>
                {shop.lat && shop.lng ? (
                  <a
                    href={`https://www.google.com/maps?q=${shop.lat},${shop.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-40 rounded-xl overflow-hidden border border-slate-100 relative group"
                  >
                    <img
                      src={`https://maps.googleapis.com/maps/api/staticmap?center=${shop.lat},${shop.lng}&zoom=15&size=400x200&markers=color:red%7C${shop.lat},${shop.lng}&key=AIzaSyD-placeholder`}
                      className="w-full h-full object-cover"
                      alt="Map"
                      onError={e => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = 'none';
                        (el.nextElementSibling as HTMLElement).style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-primary fill-icon">location_on</span>
                      <p className="text-xs font-semibold text-primary">Open in Google Maps</p>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                    </div>
                  </a>
                ) : (
                  <div className="h-40 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <div className="text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-3xl block mb-1">location_off</span>
                      <p className="text-xs">Location not set</p>
                    </div>
                  </div>
                )}
                <p className="text-xs text-outline mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">place</span>
                  {shop.shopAddress}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href={`/wishlist/new?shopId=${shop.id}`}
                  className="flex items-center justify-center gap-2 bg-primary-container text-white py-3 rounded-xl font-bold text-sm shadow hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-sm fill-icon">favorite</span>
                  Add to Wishlist
                </Link>
                <Link href={`/search?shopId=${shop.id}`}
                  className="flex items-center justify-center gap-2 border border-outline-variant text-on-surface py-3 rounded-xl font-bold text-sm hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-sm">search</span>
                  Search Products
                </Link>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-2xl font-bold text-on-surface">Products</h2>
                <p className="text-outline text-sm">{products.length} items available</p>
              </div>
              <Link href={`/search?shopId=${shop.id}`} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-100">
                <span className="material-symbols-outlined text-6xl text-outline/30 block mb-3">inventory_2</span>
                <p className="font-semibold text-on-surface-variant">No products listed yet</p>
                <p className="text-xs text-outline mt-1">Check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(p => (
                  <Link key={p._id} href={`/products/${p._id}`}>
                    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer">
                      <div className="h-44 bg-slate-50 overflow-hidden relative">
                        {p.images?.[0] ? (
                          <img
                            src={`${BASE}${p.images[0]}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            alt={p.name}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-outline/30">image</span>
                          </div>
                        )}
                        {p.discountPrice && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            SALE
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-on-surface text-sm line-clamp-2 mb-1">{p.name}</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-primary font-bold text-sm">
                              ৳{(p.discountPrice ?? p.price).toLocaleString()}
                            </span>
                            {p.discountPrice && (
                              <span className="ml-1 text-xs text-outline line-through">৳{p.price.toLocaleString()}</span>
                            )}
                          </div>
                          {p.averageRating > 0 && (
                            <div className="flex items-center gap-0.5 text-amber-500">
                              <span className="material-symbols-outlined text-sm fill-icon">star</span>
                              <span className="text-xs text-on-surface-variant font-bold">{p.averageRating.toFixed(1)}</span>
                              <span className="text-[10px] text-outline ml-0.5">({p.totalRatings})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNavBar variant="customer" />
    </div>
  );
}
