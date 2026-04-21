'use client';
import { useEffect, useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import api from '@/lib/api';
import Link from 'next/link';

interface WishlistItem {
  _id: string;
  productId: string;
  shopId: string;
  createdAt: string;
  product?: { name: string; images: string[]; price: number };
  shop?: { shopName: string };
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/customer/wishlist').then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const remove = async (id: string) => {
    await api.delete(`/customer/wishlist/${id}`);
    setItems(prev => prev.filter(i => i._id !== id));
  };

  const BASE = 'http://localhost:3001/uploads/';

  const statusColors: Record<string, string> = {
    PENDING: 'bg-blue-50 text-blue-700',
    FULFILLED: 'bg-green-50 text-green-700',
    REJECTED: 'bg-red-50 text-red-700',
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <TopNavBar variant="customer" />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-on-surface">My Wishlist</h1>
          <p className="text-on-surface-variant mt-1">Track your special requests from local shops</p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl block mb-4">favorite_border</span>
            <p className="text-xl font-semibold">Your wishlist is empty</p>
            <p className="text-sm mt-2">Browse products and add them to your wishlist</p>
            <Link href="/search" className="inline-flex items-center gap-2 mt-6 bg-primary-container text-white px-6 py-3 rounded-xl font-bold text-sm">
              <span className="material-symbols-outlined">explore</span>
              Browse Products
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden flex">
              <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-surface-container">
                {item.product?.images?.[0] ? (
                  <img src={`${BASE}${item.product.images[0]}`} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-outline">inventory_2</span>
                  </div>
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-on-surface text-base">{item.product?.name ?? 'Product'}</h3>
                    <button onClick={() => remove(item._id)} className="text-outline hover:text-error transition-colors p-1">
                      <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                  </div>
                  {item.shop && (
                    <p className="text-xs text-outline mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">store</span>{item.shop.shopName}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[item.status] ?? 'bg-slate-50 text-slate-600'}`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-outline">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNavBar variant="customer" />
    </div>
  );
}
