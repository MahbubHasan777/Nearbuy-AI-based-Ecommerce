'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

import { useAuth } from '@/context/AuthContext';

const sideNav = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/shops', icon: 'storefront', label: 'Shops' },
  { href: '/admin/customers', icon: 'group', label: 'Customers', active: true },
  { href: '/admin/moderators', icon: 'shield_person', label: 'Moderators' },
];

interface Customer {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const { user, logout } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/manage/customers').then(r => setCustomers(Array.isArray(r.data) ? r.data : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleActive = async (id: string) => {
    await api.patch(`/manage/customers/${id}/toggle-active`);
    setCustomers(c => c.map(cu => cu.id === id ? { ...cu, isActive: !cu.isActive } : cu));
  };

  const filtered = customers.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="px-6 pt-4 border-t border-slate-700 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">A</div>
            <div>
              <p className="text-sm font-semibold text-white">Admin</p>
              <p className="text-xs text-slate-400 truncate max-w-[140px]">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => logout()} className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-sm py-2 transition-colors">
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:ml-64 min-h-screen">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">Customer Management</h2>
          <p className="text-xs text-slate-500">{customers.length} registered customers</p>
        </header>

        <main className="p-6 lg:p-8">
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400"
                placeholder="Search name, email, username..." />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading && (
                    <tr><td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td></tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr><td colSpan={6} className="py-12 text-center text-slate-400">No customers found</td></tr>
                  )}
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                            {c.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{c.fullName}</p>
                            <p className="text-xs text-slate-400">@{c.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">{c.email}</p>
                        <p className="text-xs text-slate-400">{c.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{c.gender}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {c.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => toggleActive(c.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 ${c.isActive ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50'}`}>
                          {c.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t text-xs text-slate-400">
              Showing {filtered.length} of {customers.length} customers
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
