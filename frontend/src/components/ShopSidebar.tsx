'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/shop/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/shop/products', icon: 'inventory_2', label: 'Inventory' },
  { href: '/shop/wishlist-requests', icon: 'heart_plus', label: 'Wishlist Requests' },
  { href: '/shop/categories', icon: 'category', label: 'Categories' },
  { href: '/shop/brands', icon: 'label', label: 'Brands' },
  { href: '/shop/profile', icon: 'settings', label: 'Settings' },
];

interface ShopSidebarProps {
  shopName?: string;
}

export default function ShopSidebar({ shopName = 'Your Shop' }: ShopSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/shop/dashboard') return pathname === '/shop/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col h-[calc(100vh-64px)] w-64 border-r bg-slate-50 py-6 sticky top-16 flex-shrink-0">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {shopName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">{shopName}</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Local Partner</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 transition-all duration-150 text-sm ${
              isActive(item.href)
                ? 'text-primary-container bg-blue-50 border-r-4 border-primary-container font-semibold'
                : 'text-slate-600 hover:text-primary-container hover:bg-blue-50/50'
            }`}
          >
            <span className="material-symbols-outlined mr-3 text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-4 pt-4 border-t border-slate-200 mt-2">
        <Link
          href="/shop/products/new"
          className="w-full py-3 bg-primary-container text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-lg shadow-primary-container/20"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Product
        </Link>
      </div>
    </aside>
  );
}
