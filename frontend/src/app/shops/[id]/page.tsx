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
  shopDescription?: string;
  profilePic?: string;
  lat: number;
  lng: number;
}

interface Product {
  id: string;
  productName: string;
  price: number;
  discountPrice?: number;
  images: string[];
  averageRating: number;
}

export default function ShopPublicPage() {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<ShopProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get(`/shops/${id}`).then(r => setShop(r.data)).catch(() => {});
    api.get(`/shops/${id}/products`).then(r => setProducts(r.data)).catch(() => {});
  }, [id]);

  const BASE = 'http://localhost:3001/';

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <TopNavBar variant="customer" />

      <main className="pt-4 pb-12 max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative mb-6">
          <div className="h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-indigo-200 mb-8">
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <span className="material-symbols-outlined text-9xl text-primary">storefront</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md -mt-20 relative z-10 border border-outline-variant/20">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-4 border-white shadow-md flex-shrink-0 bg-surface-container">
                  {shop.profilePic ? (
                    <img src={`${BASE}${shop.profilePic}`} className="w-full h-full object-cover" alt={shop.shopName} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-outline">storefront</span>
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-bold text-on-surface">{shop.shopName}</h1>
                    <span className="material-symbols-outlined text-primary-container fill-icon">verified</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant text-sm mb-2">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{shop.shopAddress}</span>
                  </div>
                  {shop.shopDescription && (
                    <p className="text-outline italic text-sm max-w-2xl">&quot;{shop.shopDescription}&quot;</p>
                  )}
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                <button className="flex-1 md:w-44 bg-primary text-white py-3 px-6 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all">
                  Follow
                </button>
                <button className="flex-1 md:w-44 border border-primary text-primary py-3 px-6 rounded-xl font-bold text-sm hover:bg-primary-fixed active:scale-95 transition-all">
                  Message Shop
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20 sticky top-24">
              <h3 className="text-xl font-semibold text-on-surface mb-4">Shop Info</h3>
              <div className="mb-6">
                <h4 className="text-sm font-bold text-on-surface mb-2">About</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {shop.shopDescription || 'A local shop on NearBuy.'}
                </p>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-bold text-on-surface mb-2">Location</h4>
                <div className="h-36 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center">
                  <div className="text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-3xl text-secondary-container fill-icon block">location_on</span>
                    <p className="text-xs mt-1">{shop.shopAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-on-surface">Products</h2>
                <p className="text-on-surface-variant text-sm mt-1">{products.length} items available</p>
              </div>
              <Link href={`/search?shopId=${shop.id}`} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {products.length === 0 && (
              <div className="text-center py-16 text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl block mb-3">inventory_2</span>
                <p>No products listed yet</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.slice(0, 6).map(p => (
                <Link key={p.id} href={`/products/${p.id}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all group border border-slate-100">
                    <div className="h-48 bg-surface-container overflow-hidden">
                      {p.images[0] ? (
                        <img src={`${BASE}${p.images[0]}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.productName} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-outline">image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-on-surface text-sm line-clamp-1">{p.productName}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-primary font-bold">${(p.discountPrice ?? p.price).toFixed(2)}</span>
                        <div className="flex items-center text-secondary">
                          <span className="material-symbols-outlined text-sm fill-icon">star</span>
                          <span className="text-xs ml-0.5">{p.averageRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar variant="customer" />
    </div>
  );
}
