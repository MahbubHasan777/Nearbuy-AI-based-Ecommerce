'use client';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function CustomerProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-outline block mb-3">lock</span>
          <p className="text-on-surface-variant mb-4">Please log in to view your profile</p>
          <Link href="/login" className="px-6 py-3 bg-primary-container text-white rounded-xl font-bold text-sm">Sign In</Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: 'favorite', label: 'My Wishlist', href: '/wishlist', color: 'text-error' },
    { icon: 'location_on', label: 'Saved Addresses', href: '/profile/addresses', color: 'text-primary' },
    { icon: 'notifications', label: 'Notifications', href: '/profile/notifications', color: 'text-secondary' },
    { icon: 'lock', label: 'Change Password', href: '/profile/password', color: 'text-outline' },
    { icon: 'help', label: 'Help & Support', href: '/help', color: 'text-outline' },
    { icon: 'info', label: 'About NearBuy', href: '/about', color: 'text-outline' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <TopNavBar variant="customer" />

      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-gradient-to-br from-primary-container to-primary rounded-3xl p-8 text-white mb-6 relative overflow-hidden shadow-xl shadow-primary-container/30">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -right-4 -bottom-8 w-24 h-24 bg-white/10 rounded-full" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white text-3xl font-black border-2 border-white/30">
              {user.name?.charAt(0).toUpperCase() ?? user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name ?? 'Customer'}</h1>
              <p className="text-white/80 text-sm mt-0.5">{user.email}</p>
              <div className="inline-flex items-center gap-1.5 mt-3 bg-white/20 px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-sm fill-icon">verified_user</span>
                <span className="text-xs font-bold uppercase tracking-wider">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: 'favorite', label: 'Wishlist', count: '—', href: '/wishlist' },
            { icon: 'local_activity', label: 'Orders', count: '—', href: '/orders' },
            { icon: 'store', label: 'Shops', count: '—', href: '/search' },
          ].map(s => (
            <Link key={s.href} href={s.href} className="bg-white rounded-2xl p-4 text-center shadow-card hover:shadow-card-hover transition-all border border-slate-100">
              <span className="material-symbols-outlined text-primary-container text-2xl block mb-1">{s.icon}</span>
              <p className="text-xl font-bold text-on-surface">{s.count}</p>
              <p className="text-xs text-outline">{s.label}</p>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
          {menuItems.map((item, i) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors ${i < menuItems.length - 1 ? 'border-b border-slate-100' : ''}`}
            >
              <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
              <span className="text-sm font-semibold text-on-surface flex-1">{item.label}</span>
              <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
            </Link>
          ))}
        </div>

        <button
          onClick={() => logout()}
          className="w-full mt-4 py-4 bg-error-container text-on-error-container rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </main>

      <BottomNavBar variant="customer" />
    </div>
  );
}
