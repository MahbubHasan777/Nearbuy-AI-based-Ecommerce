'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

import { useAuth } from '@/context/AuthContext';

const sideNav = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/shops', icon: 'storefront', label: 'Shops' },
  { href: '/admin/customers', icon: 'group', label: 'Customers' },
  { href: '/admin/moderators', icon: 'shield_person', label: 'Moderators', active: true },
];

interface Moderator {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminModeratorsPage() {
  const { user, logout } = useAuth();
  const [mods, setMods] = useState<Moderator[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/moderators').then(r => setMods(Array.isArray(r.data) ? r.data : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const createMod = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      const r = await api.post('/admin/moderators', { email: form.email, password: form.password });
      setMods(m => [r.data, ...m]);
      setForm({ email: '', password: '' });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create moderator');
    } finally {
      setCreating(false);
    }
  };

  const deleteMod = async (id: string) => {
    await api.delete(`/admin/moderators/${id}`);
    setMods(m => m.filter(mod => mod.id !== id));
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
          <h2 className="text-xl font-bold text-slate-800">Moderators</h2>
          <p className="text-xs text-slate-500">Manage platform moderators</p>
        </header>

        <main className="p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {loading && (
                <div className="py-12 text-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
              )}
              {!loading && mods.length === 0 && (
                <div className="py-12 text-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl block mb-2">shield_person</span>
                  <p>No moderators yet</p>
                </div>
              )}
              {mods.length > 0 && (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-xs text-slate-500 font-bold uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mods.map(mod => (
                      <tr key={mod.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="material-symbols-outlined text-purple-600 text-sm">shield_person</span>
                            </div>
                            <span className="text-sm font-medium text-slate-800">{mod.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{new Date(mod.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          {user?.role === 'ADMIN' && (
                            <button onClick={() => deleteMod(mod.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {user?.role === 'ADMIN' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-500">person_add</span>
                  Add Moderator
                </h3>
                <form onSubmit={createMod} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none"
                      placeholder="mod@nearbuy.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                    <input required type="password" minLength={8} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none"
                      placeholder="Min 8 characters" />
                  </div>
                  {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                  <button type="submit" disabled={creating}
                    className="w-full py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-60">
                    {creating ? 'Creating...' : 'Create Moderator'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
