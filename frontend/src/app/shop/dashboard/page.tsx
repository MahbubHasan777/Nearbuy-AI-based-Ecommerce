'use client';
import { useEffect, useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import api from '@/lib/api';
import Link from 'next/link';

const sideNav = [
  { href: '/shop/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/shop/products', icon: 'inventory_2', label: 'Inventory' },
  { href: '/shop/wishlist-requests', icon: 'shopping_bag', label: 'Orders' },
  { href: '/shop/brands', icon: 'leaderboard', label: 'Brands' },
  { href: '/shop/profile', icon: 'settings', label: 'Settings' },
];

interface WishlistItem {
  _id: string;
  customerId: string;
  productId: string;
  status: string;
  createdAt: string;
}

export default function ShopDashboardPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [shopName, setShopName] = useState('Your Shop');

  useEffect(() => {
    api.get('/shop/wishlist-requests').then(r => setWishlist(r.data)).catch(() => {});
    api.get('/shop/profile').then(r => setShopName(r.data.shopName)).catch(() => {});
  }, []);

  const pending = wishlist.filter(w => w.status === 'PENDING');

  return (
    <div className="min-h-screen bg-background font-sans text-on-background flex flex-col">
      <TopNavBar variant="shop" />

      <div className="flex flex-1 w-full max-w-[1440px] mx-auto">
        <aside className="hidden lg:flex flex-col h-[calc(100vh-64px)] w-64 border-r bg-slate-50 py-6 sticky top-16">
          <div className="px-6 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">
              {shopName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">{shopName}</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Local Partner</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {sideNav.map(item => (
              <Link key={item.href} href={item.href}
                className="flex items-center px-6 py-3 text-slate-600 hover:text-primary-container hover:bg-blue-50/50 transition-all duration-150"
              >
                <span className="material-symbols-outlined mr-3">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="px-6 mt-auto">
            <Link href="/shop/products/new" className="w-full py-3 bg-primary-container text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-sm">add</span>
              Add New Listing
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-lg space-y-lg overflow-y-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-on-surface">Store Dashboard</h1>
              <p className="text-on-surface-variant text-base mt-1">Good morning, {shopName}. Here&apos;s your shop activity today.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-outline rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors">
                Download Report
              </button>
              <button className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-xl text-sm font-semibold shadow-lg shadow-secondary-container/10 active:scale-95 transition-transform">
                Confirm Daily Inventory
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard icon="payments" label="Total Sales (Today)" value="—" badge="+0%" badgeColor="green" />
            <StatCard icon="favorite" label="Active Wishlists" value={`${pending.length} Items`} badge={`+${pending.length}`} badgeColor="green" iconBg="orange" />
            <StatCard icon="visibility" label="Product Views" value="—" badge="—" badgeColor="slate" iconBg="purple" />
            <div className="hidden lg:flex bg-primary text-white p-lg rounded-xl shadow-xl shadow-primary/20 flex-col justify-between h-40 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs opacity-80 uppercase tracking-wider">Store Rating</p>
                <h2 className="text-2xl font-semibold mt-1">— / 5.0</h2>
              </div>
              <div className="relative z-10 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm fill-icon">star</span>
                <span className="text-xs">No reviews yet</span>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-lg">
            <div className="xl:col-span-2 bg-white rounded-xl shadow-card overflow-hidden">
              <div className="p-lg border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-on-surface">Active Wishlist Requests</h3>
                <Link href="/shop/wishlist-requests" className="text-primary text-sm font-semibold hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-slate-100">
                {pending.length === 0 && (
                  <div className="p-lg text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-3xl block mb-2">inbox</span>
                    <p>No pending requests</p>
                  </div>
                )}
                {pending.slice(0, 3).map(item => (
                  <WishlistRow key={item._id} item={item} />
                ))}
              </div>
            </div>

            <div className="space-y-lg">
              <div className="bg-white p-lg rounded-xl shadow-card border border-slate-50">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">warning</span>
                  Stock Alerts
                </h3>
                <p className="text-sm text-on-surface-variant text-center py-4">No alerts at this time</p>
                <Link href="/shop/products" className="w-full mt-4 py-2 border border-outline rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center">
                  Manage All Inventory
                </Link>
              </div>

              <div className="bg-surface-container-high p-lg rounded-xl">
                <h3 className="text-xs font-bold text-on-surface mb-4 uppercase tracking-wider">Quick Management</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: 'add_circle', label: 'Add Product', href: '/shop/products/new' },
                    { icon: 'history', label: 'History', href: '/shop/orders' },
                    { icon: 'category', label: 'Categories', href: '/shop/categories' },
                    { icon: 'label', label: 'Brands', href: '/shop/brands' },
                  ].map(q => (
                    <Link key={q.href} href={q.href} className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                      <span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">{q.icon}</span>
                      <span className="text-xs font-bold">{q.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <BottomNavBar variant="shop" />
    </div>
  );
}

function StatCard({ icon, label, value, badge, badgeColor, iconBg = 'blue' }: {
  icon: string; label: string; value: string; badge: string; badgeColor: string; iconBg?: string;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-primary',
    orange: 'bg-orange-50 text-secondary',
    purple: 'bg-purple-50 text-purple-600',
  };
  const badgeColors: Record<string, string> = {
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    slate: 'text-slate-600 bg-slate-50',
  };
  return (
    <div className="bg-white p-lg rounded-xl shadow-card border border-slate-50 flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${colors[iconBg]}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${badgeColors[badgeColor]}`}>{badge}</span>
      </div>
      <div>
        <p className="text-xs text-outline uppercase tracking-wider">{label}</p>
        <h2 className="text-2xl font-semibold mt-1">{value}</h2>
      </div>
    </div>
  );
}

function WishlistRow({ item }: { item: WishlistItem }) {
  return (
    <div className="p-lg flex items-center gap-4 hover:bg-slate-50 transition-colors">
      <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-outline text-2xl">inventory_2</span>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-on-surface">Product Request</h4>
        <p className="text-xs text-outline mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
        <div className="mt-2">
          <span className="px-2 py-0.5 bg-blue-50 text-primary text-[10px] font-bold rounded uppercase">Pending</span>
        </div>
      </div>
      <Link href="/shop/wishlist-requests" className="px-4 py-2 bg-primary-container text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
        View
      </Link>
    </div>
  );
}
