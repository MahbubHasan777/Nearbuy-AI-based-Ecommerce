'use client';
import { useEffect, useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import Link from 'next/link';
import api from '@/lib/api';

interface WishlistRequest {
  _id: string;
  customerId: string;
  productId: string;
  status: string;
  createdAt: string;
  product?: { name: string; images: string[]; price: number; category?: { categoryName: string } };
  customer?: { fullName: string; username: string };
}

const sideNav = [
  { href: '/shop/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/shop/products', icon: 'inventory_2', label: 'Inventory' },
  { href: '/shop/wishlist-requests', icon: 'heart_plus', label: 'Wishlist Requests', active: true },
  { href: '/shop/profile', icon: 'settings', label: 'Settings' },
];

export default function WishlistRequestsPage() {
  const [requests, setRequests] = useState<WishlistRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    api.get('/shop/wishlist-requests').then(r => setRequests(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/wishlist/${id}/status`, { status });
    setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
  };

  const BASE = 'http://localhost:3001/';
  const filtered = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);
  const pending = requests.filter(r => r.status === 'PENDING').length;
  const fulfilled = requests.filter(r => r.status === 'FULFILLED').length;

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavBar variant="shop" />
      <div className="flex w-full max-w-[1440px] mx-auto">
        <aside className="hidden lg:flex flex-col h-[calc(100vh-64px)] w-64 border-r bg-slate-50 py-6 sticky top-16">
          <div className="px-6 mb-8">
            <h2 className="text-lg font-black text-primary-container tracking-tight">NearBuy Shop</h2>
            <p className="text-xs text-slate-500">Management Panel</p>
          </div>
          <nav className="flex-1 space-y-1">
            {sideNav.map(item => (
              <Link key={item.href} href={item.href}
                className={`flex items-center px-6 py-3 transition-all duration-150 ${item.active ? 'text-primary-container bg-blue-50 border-r-4 border-primary-container font-semibold' : 'text-slate-600 hover:text-primary-container hover:bg-blue-50/50'}`}
              >
                <span className="material-symbols-outlined mr-3">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="px-4">
            <Link href="/shop/products/new" className="w-full py-3 bg-primary-container text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-sm">add</span> Add Product
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-on-surface">Wishlist Requests</h1>
              <p className="text-outline mt-1">Manage and fulfill requests from your local community</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container">pending_actions</span>
                </div>
                <div>
                  <p className="text-xs text-outline uppercase tracking-wider">Pending</p>
                  <p className="text-2xl font-bold text-on-surface">{pending}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600">task_alt</span>
                </div>
                <div>
                  <p className="text-xs text-outline uppercase tracking-wider">Fulfilled</p>
                  <p className="text-2xl font-bold text-on-surface">{fulfilled}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {['ALL', 'PENDING', 'FULFILLED', 'REJECTED'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-primary-container text-white shadow-lg' : 'bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}
              >
                {f === 'ALL' ? 'All' : f}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-slate-100">
            {loading && (
              <div className="py-16 text-center text-on-surface-variant">
                <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="py-16 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl block mb-2">inbox</span>
                <p>No {filter.toLowerCase()} requests</p>
              </div>
            )}
            {!loading && filtered.length > 0 && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs text-outline font-bold uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs text-outline font-bold uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-xs text-outline font-bold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs text-outline font-bold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs text-outline font-bold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(item => (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-outline">person</span>
                          </div>
                          <p className="text-sm font-semibold text-on-surface">{item.customer?.fullName ?? item.customer?.username ?? 'Customer'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden border border-outline-variant">
                            {item.product?.images?.[0] ? (
                              <img src={`${BASE}${item.product.images[0]}`} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm text-outline">inventory_2</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-on-surface">{item.product?.name ?? 'Product'}</p>
                            {item.product?.category && <p className="text-xs text-outline">{item.product.category.categoryName}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === 'PENDING' ? 'bg-blue-50 text-blue-700' :
                          item.status === 'FULFILLED' ? 'bg-green-50 text-green-700' :
                          'bg-red-50 text-red-700'
                        }`}>{item.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.status === 'PENDING' ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => updateStatus(item._id, 'FULFILLED')} className="px-4 py-2 bg-primary-container text-white rounded-lg text-xs font-bold hover:bg-primary transition-colors active:scale-95">
                              Mark Done
                            </button>
                            <button onClick={() => updateStatus(item._id, 'REJECTED')} className="px-4 py-2 border border-error text-error rounded-lg text-xs font-bold hover:bg-error-container transition-colors active:scale-95">
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button className="p-2 text-outline hover:text-on-surface transition-colors">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && filtered.length > 0 && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <p className="text-xs text-outline">Showing {filtered.length} of {requests.length} requests</p>
              </div>
            )}
          </div>

          {pending > 0 && (
            <div className="mt-6 bg-blue-50 border border-blue-100 p-5 rounded-2xl flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-white flex-shrink-0">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary-container mb-1">Steward Tip</h4>
                <p className="text-sm text-on-surface opacity-80">You have {pending} pending request{pending > 1 ? 's' : ''}. Fulfilling them quickly increases your shop rating and customer loyalty!</p>
              </div>
            </div>
          )}
        </main>
      </div>
      <BottomNavBar variant="shop" />
    </div>
  );
}
