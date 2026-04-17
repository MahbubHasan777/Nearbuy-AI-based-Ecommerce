'use client';
import { useEffect, useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import ShopSidebar from '@/components/ShopSidebar';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';



interface WishlistItem {
  _id: string;
  customerId: string;
  productId: string;
  status: string;
  createdAt: string;
  product?: { productName: string; images: string[] };
}

interface ShopStats {
  totalProducts: number;
  pendingRequests: number;
  fulfilledRequests: number;
  totalRequests: number;
}

export default function ShopDashboardPage() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [stats, setStats] = useState<ShopStats>({ totalProducts: 0, pendingRequests: 0, fulfilledRequests: 0, totalRequests: 0 });
  const [shopName, setShopName] = useState('Your Shop');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/shop/wishlist-requests').catch(() => ({ data: [] })),
      api.get('/shop/profile').catch(() => ({ data: {} })),
      api.get('/shop/products').catch(() => ({ data: [] })),
    ]).then(([wishR, profileR, productsR]) => {
      const items: WishlistItem[] = Array.isArray(wishR.data) ? wishR.data : [];
      const products = Array.isArray(productsR.data) ? productsR.data : [];
      setWishlist(items);
      setShopName(profileR.data?.shopName ?? 'Your Shop');
      setStats({
        totalProducts: products.length,
        pendingRequests: items.filter(w => w.status === 'PENDING').length,
        fulfilledRequests: items.filter(w => w.status === 'FULFILLED').length,
        totalRequests: items.length,
      });
    }).finally(() => setLoading(false));
  }, []);

  const pending = wishlist.filter(w => w.status === 'PENDING');
  const BASE = 'http://localhost:3001/uploads/';

  return (
    <div className="min-h-screen bg-background font-sans text-on-background flex flex-col">
      <TopNavBar variant="shop" />

      <div className="flex flex-1 w-full max-w-[1440px] mx-auto">
        <ShopSidebar shopName={shopName} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-on-surface">Store Dashboard</h1>
              <p className="text-on-surface-variant text-base mt-1">
                Welcome back, <span className="font-semibold text-primary-container">{shopName}</span>. Here&apos;s your shop activity.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/shop/products/new" className="px-5 py-2.5 bg-primary-container text-white rounded-xl text-sm font-bold shadow-lg hover:bg-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add_circle</span>
                New Product
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'inventory_2', label: 'Total Products', value: stats.totalProducts, color: 'from-blue-500 to-indigo-600', link: '/shop/products' },
              { icon: 'pending_actions', label: 'Pending Requests', value: stats.pendingRequests, color: 'from-amber-500 to-orange-500', link: '/shop/wishlist-requests' },
              { icon: 'task_alt', label: 'Fulfilled', value: stats.fulfilledRequests, color: 'from-emerald-500 to-green-600', link: '/shop/wishlist-requests' },
              { icon: 'favorite', label: 'Total Requests', value: stats.totalRequests, color: 'from-rose-500 to-pink-600', link: '/shop/wishlist-requests' },
            ].map(card => (
              <Link key={card.label} href={card.link}>
                <div className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-5 shadow-lg relative overflow-hidden hover:scale-105 transition-transform cursor-pointer`}>
                  <div className="absolute -right-3 -bottom-3 w-20 h-20 bg-white/10 rounded-full" />
                  <span className="material-symbols-outlined text-2xl mb-3 block">{card.icon}</span>
                  <p className="text-3xl font-black">{loading ? '—' : card.value}</p>
                  <p className="text-xs opacity-80 mt-1">{card.label}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">pending_actions</span>
                  Pending Wishlist Requests
                </h3>
                <Link href="/shop/wishlist-requests" className="text-primary text-sm font-bold hover:underline">View All</Link>
              </div>

              {loading && (
                <div className="py-12 text-center">
                  <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              )}

              {!loading && pending.length === 0 && (
                <div className="py-16 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl block mb-2">inbox</span>
                  <p className="text-sm font-semibold">No pending requests</p>
                  <p className="text-xs mt-1 text-outline">All requests have been handled</p>
                </div>
              )}

              <div className="divide-y divide-slate-100">
                {pending.slice(0, 5).map(item => (
                  <div key={item._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-100">
                      {item.product?.images?.[0] ? (
                        <img src={`${BASE}${item.product.images[0]}`} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="material-symbols-outlined text-outline">inventory_2</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">{item.product?.productName ?? 'Product Request'}</p>
                      <p className="text-xs text-outline">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">PENDING</span>
                    <Link href="/shop/wishlist-requests" className="px-3 py-2 bg-primary-container text-white rounded-lg text-xs font-bold hover:bg-primary transition-colors active:scale-95">
                      Handle
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: 'add_circle', label: 'Add Product', href: '/shop/products/new', color: 'bg-blue-50 text-blue-600' },
                    { icon: 'inventory_2', label: 'Inventory', href: '/shop/products', color: 'bg-indigo-50 text-indigo-600' },
                    { icon: 'category', label: 'Categories', href: '/shop/categories', color: 'bg-emerald-50 text-emerald-600' },
                    { icon: 'label', label: 'Brands', href: '/shop/brands', color: 'bg-purple-50 text-purple-600' },
                  ].map(q => (
                    <Link key={q.href} href={q.href} className="flex flex-col items-center justify-center p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group">
                      <div className={`w-10 h-10 rounded-full ${q.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-xl">{q.icon}</span>
                      </div>
                      <span className="text-xs font-bold text-on-surface">{q.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-container to-primary text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full" />
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-3xl mb-3 block">storefront</span>
                  <h4 className="font-bold text-lg">{shopName}</h4>
                  <p className="text-white/70 text-xs mt-1">{stats.totalProducts} products listed</p>
                  <Link href="/shop/profile" className="mt-4 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    <span className="material-symbols-outlined text-xs">settings</span>
                    Manage Shop
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNavBar variant="shop" />
    </div>
  );
}
