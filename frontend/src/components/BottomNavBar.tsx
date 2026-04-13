'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const customerNav = [
  { href: '/', icon: 'home', label: 'Home' },
  { href: '/search', icon: 'explore', label: 'Explore' },
  { href: '/orders', icon: 'receipt_long', label: 'Orders' },
  { href: '/profile', icon: 'person', label: 'Profile' },
];

const shopNav = [
  { href: '/shop/dashboard', icon: 'dashboard', label: 'Home' },
  { href: '/shop/products', icon: 'inventory_2', label: 'Products' },
  { href: '/shop/wishlist-requests', icon: 'favorite', label: 'Requests' },
  { href: '/shop/profile', icon: 'person', label: 'Profile' },
];

export default function BottomNavBar({ variant = 'customer' }: { variant?: 'customer' | 'shop' }) {
  const pathname = usePathname();
  const nav = variant === 'shop' ? shopNav : customerNav;

  return (
    <nav className="lg:hidden flex justify-around items-center h-20 px-4 pb-safe bg-white/80 backdrop-blur-md fixed bottom-0 w-full rounded-t-2xl z-50 border-t border-slate-200 shadow-nav-bottom">
      {nav.map(item => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-transform duration-300 ${
              active
                ? 'text-primary-container bg-blue-50 rounded-xl px-4 py-1 scale-110'
                : 'text-slate-400 scale-110'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
