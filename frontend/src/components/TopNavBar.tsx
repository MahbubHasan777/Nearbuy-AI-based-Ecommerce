'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface TopNavBarProps {
  onSearch?: (q: string) => void;
  searchValue?: string;
  variant?: 'customer' | 'shop' | 'admin';
}

export default function TopNavBar({ onSearch, searchValue = '', variant = 'customer' }: TopNavBarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [q, setQ] = useState(searchValue);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      api.get('/notifications').then(r => setNotifications(r.data)).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(q);
    else router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="bg-white border-b border-slate-100 shadow-nav font-sans text-sm font-medium sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black tracking-tighter text-primary-container">
            NearBuy
          </Link>
          {variant === 'customer' && (
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-primary-container border-b-2 border-primary-container py-5">Home</Link>
              <Link href="/search" className="text-slate-500 hover:text-primary-container transition-colors py-5 px-2">Explore</Link>
              <Link href="/orders" className="text-slate-500 hover:text-primary-container transition-colors py-5 px-2">Orders</Link>
            </nav>
          )}
          {variant === 'shop' && (
            <nav className="hidden md:flex gap-6">
              <Link href="/shop/dashboard" className="text-slate-500 hover:text-primary-container py-5 px-2">Dashboard</Link>
              <Link href="/shop/products" className="text-slate-500 hover:text-primary-container py-5 px-2">Inventory</Link>
              <Link href="/shop/wishlist-requests" className="text-slate-500 hover:text-primary-container py-5 px-2">Requests</Link>
            </nav>
          )}
        </div>

        {variant === 'customer' && (
          <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-container outline-none"
                placeholder="Search shops, products..."
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
          </form>
        )}

        <div className="flex items-center gap-2">
          {user && (
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotif(!showNotif)}
                className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse" />
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-on-surface">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs font-bold text-primary hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-outline">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_paused</span>
                        <p className="text-sm">No new notifications</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {notifications.map(n => (
                          <div 
                            key={n._id} 
                            onClick={() => !n.isRead && markAsRead(n._id)}
                            className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${!n.isRead ? 'bg-primary/5' : ''}`}
                          >
                            <div className="flex gap-3">
                              <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-primary' : 'bg-transparent'}`} />
                              <div>
                                <h4 className={`text-sm mb-0.5 ${!n.isRead ? 'font-bold text-on-surface' : 'font-semibold text-on-surface-variant'}`}>
                                  {n.title}
                                </h4>
                                <p className="text-xs text-outline line-clamp-2">{n.message}</p>
                                <span className="text-[10px] text-outline/60 mt-1 block">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link href={user.role === 'SHOP' ? '/shop/profile' : user.role === 'ADMIN' ? '/admin/profile' : '/profile'} className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full hover:bg-surface-container transition-colors cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-[10px]">
                  {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-on-surface truncate max-w-[100px]">
                  {user.name || user.email.split('@')[0]}
                </span>
              </Link>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 px-3 py-2 bg-error-container text-on-error-container rounded-full text-xs font-bold hover:opacity-90 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-primary-container text-white rounded-full text-sm font-semibold hover:bg-primary transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
