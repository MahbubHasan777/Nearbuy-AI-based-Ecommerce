'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const sideNav = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard', active: true },
  { href: '/admin/shops', icon: 'storefront', label: 'Shops' },
  { href: '/admin/customers', icon: 'group', label: 'Customers' },
  { href: '/admin/moderators', icon: 'shield_person', label: 'Moderators' },
];

interface Stats {
  totalShops: number;
  pendingShops: number;
  totalCustomers: number;
  totalModerators: number;
}

interface PendingShop {
  id: string;
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  shopAddress: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ totalShops: 0, pendingShops: 0, totalCustomers: 0, totalModerators: 0 });
  const [pending, setPending] = useState<PendingShop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') { router.push('/'); return; }
    Promise.all([
      api.get('/manage/shops?status=PENDING').catch(() => ({ data: [] })),
      api.get('/manage/shops').catch(() => ({ data: [] })),
      api.get('/manage/customers').catch(() => ({ data: [] })),
      api.get('/admin/moderators').catch(() => ({ data: [] })),
    ]).then(([pendingR, shopsR, cusR, modR]) => {
      const pendingList = Array.isArray(pendingR.data) ? pendingR.data : [];
      const allShops = Array.isArray(shopsR.data) ? shopsR.data : [];
      const customers = Array.isArray(cusR.data) ? cusR.data : [];
      const mods = Array.isArray(modR.data) ? modR.data : [];
      setPending(pendingList);
      setStats({
        totalShops: allShops.length,
        pendingShops: pendingList.length,
        totalCustomers: customers.length,
        totalModerators: mods.length,
      });
    }).finally(() => setLoading(false));
  }, [user]);

  const approveShop = async (id: string) => {
    await api.patch(`/manage/shops/${id}/approve`);
    setPending(p => p.filter(s => s.id !== id));
    setStats(s => ({ ...s, pendingShops: s.pendingShops - 1 }));
  };

  const rejectShop = async (id: string) => {
    await api.patch(`/manage/shops/${id}/reject`);
    setPending(p => p.filter(s => s.id !== id));
    setStats(s => ({ ...s, pendingShops: s.pendingShops - 1 }));
  };

  const statCards = [
    { label: 'Total Shops', value: stats.totalShops, icon: 'storefront', color: 'from-blue-500 to-blue-700', link: '/admin/shops' },
    { label: 'Pending Approval', value: stats.pendingShops, icon: 'pending_actions', color: 'from-amber-500 to-orange-600', link: '/admin/shops' },
    { label: 'Customers', value: stats.totalCustomers, icon: 'group', color: 'from-emerald-500 to-green-700', link: '/admin/customers' },
    { label: 'Moderators', value: stats.totalModerators, icon: 'shield_person', color: 'from-purple-500 to-violet-700', link: '/admin/moderators' },
  ];

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
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-xs text-slate-500">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            {stats.pendingShops > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold">
                <span className="material-symbols-outlined text-sm">pending_actions</span>
                {stats.pendingShops} shops pending
              </div>
            )}
          </div>
        </header>

        <main className="p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            {statCards.map(card => (
              <Link key={card.label} href={card.link}>
                <div className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-6 shadow-lg relative overflow-hidden hover:scale-105 transition-transform cursor-pointer`}>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
                  <span className="material-symbols-outlined text-3xl mb-4 block opacity-90">{card.icon}</span>
                  <p className="text-4xl font-black">{loading ? '—' : card.value}</p>
                  <p className="text-sm mt-1 opacity-80">{card.label}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">pending_actions</span>
                  Shops Pending Approval
                </h3>
                <Link href="/admin/shops" className="text-xs text-blue-600 font-semibold hover:underline">View all</Link>
              </div>

              {loading && (
                <div className="py-12 text-center text-slate-400">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              )}

              {!loading && pending.length === 0 && (
                <div className="py-12 text-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl block mb-2">check_circle</span>
                  <p className="text-sm">All caught up! No pending approvals.</p>
                </div>
              )}

              {!loading && pending.length > 0 && (
                <div className="divide-y divide-slate-100">
                  {pending.map(shop => (
                    <div key={shop.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-blue-600">store</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{shop.shopName}</p>
                        <p className="text-xs text-slate-500 truncate">{shop.ownerName} · {shop.shopAddress}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => approveShop(shop.id)} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 active:scale-95 transition-all">
                          Approve
                        </button>
                        <button onClick={() => rejectShop(shop.id)} className="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 active:scale-95 transition-all">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-500">shield_person</span>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link href="/admin/moderators" className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                    <span className="material-symbols-outlined text-purple-600">person_add</span>
                    <span className="text-sm font-semibold text-purple-800">Add Moderator</span>
                  </Link>
                  <Link href="/admin/shops" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <span className="material-symbols-outlined text-blue-600">storefront</span>
                    <span className="text-sm font-semibold text-blue-800">Manage Shops</span>
                  </Link>
                  <Link href="/admin/customers" className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                    <span className="material-symbols-outlined text-emerald-600">group</span>
                    <span className="text-sm font-semibold text-emerald-800">View Customers</span>
                  </Link>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-6">
                <h3 className="font-bold mb-2">Admin Credentials</h3>
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="text-white font-mono">admin@nearbuy.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Password</span>
                    <span className="text-white font-mono">admin123456</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Role</span>
                    <span className="text-emerald-400 font-bold">ADMIN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
