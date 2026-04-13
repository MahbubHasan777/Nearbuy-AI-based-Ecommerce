'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

interface TopNavBarProps {
  onSearch?: (q: string) => void;
  searchValue?: string;
  variant?: 'customer' | 'shop' | 'admin';
}

export default function TopNavBar({ onSearch, searchValue = '', variant = 'customer' }: TopNavBarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [q, setQ] = useState(searchValue);

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
              <Link href="/search" className="text-slate-500 hover:bg-slate-50 transition-colors py-5 px-2">Explore</Link>
              <Link href="/orders" className="text-slate-500 hover:bg-slate-50 transition-colors py-5 px-2">Orders</Link>
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

        {variant === 'shop' && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container text-sm outline-none" placeholder="Search orders or products..." />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          {user ? (
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 ml-2 p-1 pr-3 hover:bg-slate-50 rounded-full transition-colors border border-transparent hover:border-slate-100"
            >
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-xs">
                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-600 hidden md:block">{user.name || user.email}</span>
            </button>
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
