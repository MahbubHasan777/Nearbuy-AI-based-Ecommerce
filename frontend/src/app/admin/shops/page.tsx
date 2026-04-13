'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const sideNav = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/shops', icon: 'storefront', label: 'Shops', active: true },
  { href: '/admin/customers', icon: 'group', label: 'Customers' },
  { href: '/admin/moderators', icon: 'shield_person', label: 'Moderators' },
];

interface Shop {
  id: string;
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  shopAddress: string;
  phone: string;
  status: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/manage/shops').then(r => setShops(Array.isArray(r.data) ? r.data : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const approveShop = async (id: string) => {
    await api.patch(`/manage/shops/${id}/approve`);
    setShops(s => s.map(sh => sh.id === id ? { ...sh, status: 'APPROVED' } : sh));
  };

  const rejectShop = async (id: string) => {
    await api.patch(`/manage/shops/${id}/reject`);
    setShops(s => s.map(sh => sh.id === id ? { ...sh, status: 'REJECTED' } : sh));
  };

  const toggleActive = async (id: string) => {
    await api.patch(`/manage/shops/${id}/toggle-active`);
    setShops(s => s.map(sh => sh.id === id ? { ...sh, isActive: !sh.isActive } : sh));
  };

  const deleteShop = async (id: string) => {
    await api.delete(`/manage/shops/${id}`);
    setShops(s => s.filter(sh => sh.id !== id));
  };

  const filtered = shops.filter(s => {
    const matchSearch = s.shopName.toLowerCase().includes(search.toLowerCase()) || s.ownerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? s.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const statusColor = (status: string) => {
    if (status === 'APPROVED') return 'bg-green-100 text-green-700';
    if (status === 'PENDING') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-slate-900 text-white py-6 z-50">
        <div className="px-6 mb-10">
          <h1 className="text-2xl font-black tracking-tighter text-white">NearBuy</h1>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {sideNav.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${item.active ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:ml-64 min-h-screen">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">Shop Management</h2>
          <p className="text-xs text-slate-500">{shops.length} total shops registered</p>
        </header>

        <main className="p-6 lg:p-8">
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400"
                placeholder="Search shop name or email..." />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400">
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Shop</th>
                    <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Active</th>
                    <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading && (
                    <tr><td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td></tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr><td colSpan={6} className="py-12 text-center text-slate-400">No shops found</td></tr>
                  )}
                  {filtered.map(shop => (
                    <tr key={shop.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 text-sm">{shop.shopName}</p>
                        <p className="text-xs text-slate-400">{shop.shopAddress}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">{shop.ownerName}</p>
                        <p className="text-xs text-slate-400">{shop.ownerEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{shop.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColor(shop.status)}`}>{shop.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => toggleActive(shop.id)} className={`w-10 h-6 rounded-full transition-colors ${shop.isActive ? 'bg-green-500' : 'bg-slate-300'}`}>
                          <span className={`block w-4 h-4 rounded-full bg-white shadow mx-auto transition-all ${shop.isActive ? 'translate-x-2' : '-translate-x-2'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          {shop.status === 'PENDING' && (
                            <>
                              <button onClick={() => approveShop(shop.id)} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 active:scale-95 transition-all">✓</button>
                              <button onClick={() => rejectShop(shop.id)} className="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 active:scale-95 transition-all">✕</button>
                            </>
                          )}
                          <button onClick={() => deleteShop(shop.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-400">
              Showing {filtered.length} of {shops.length} shops
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
