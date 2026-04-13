'use client';
import { useEffect, useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import Link from 'next/link';
import api from '@/lib/api';

const sideNav = [
  { href: '/shop/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/shop/products', icon: 'inventory_2', label: 'Inventory', active: true },
  { href: '/shop/wishlist-requests', icon: 'heart_plus', label: 'Wishlist Requests' },
  { href: '/shop/profile', icon: 'settings', label: 'Settings' },
];

interface Product {
  id: string;
  productName: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  images: string[];
  status: string;
  category?: { categoryName: string };
  brand?: { brandName: string };
}

export default function ShopProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/shop/products').then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (id: string) => {
    await api.delete(`/products/${id}`);
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
  };

  const BASE = 'http://localhost:3001/';
  const filtered = products.filter(p => {
    const matchSearch = p.productName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? p.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

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
                className={`flex items-center px-6 py-3 transition-all duration-150 text-sm ${item.active ? 'text-primary-container bg-blue-50 border-r-4 border-primary-container font-semibold' : 'text-slate-600 hover:text-primary-container hover:bg-blue-50/50'}`}
              >
                <span className="material-symbols-outlined mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4">
            <Link href="/shop/products/new" className="w-full py-3 bg-primary-container text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-sm">add</span> Add Product
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-on-surface">Inventory</h1>
              <p className="text-outline mt-1">Manage your shop&apos;s product catalog</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-xl">file_download</span>
                Export
              </button>
              <Link href="/shop/products/new" className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white rounded-xl font-bold text-sm shadow-lg hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-sm">add_circle</span>
                New Product
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-center">
            <div className="md:col-span-6 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Search product name..."
              />
            </div>
            <div className="md:col-span-3">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="w-full py-3 px-4 bg-white border border-outline-variant rounded-xl text-sm outline-none focus:border-primary">
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="DISABLED">Disabled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs text-outline font-bold uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-xs text-outline font-bold uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs text-outline font-bold uppercase tracking-wider">Brand</th>
                      <th className="px-6 py-4 text-xs text-outline font-bold uppercase tracking-wider text-right">Price</th>
                      <th className="px-6 py-4 text-xs text-outline font-bold uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading && (
                      <tr><td colSpan={6} className="py-16 text-center text-on-surface-variant">
                        <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto" />
                      </td></tr>
                    )}
                    {!loading && filtered.length === 0 && (
                      <tr><td colSpan={6} className="py-16 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl block mb-2">inventory_2</span>
                        <p>No products found</p>
                        <Link href="/shop/products/new" className="inline-flex items-center gap-1 mt-4 text-primary text-sm font-semibold hover:underline">
                          <span className="material-symbols-outlined text-sm">add</span> Add your first product
                        </Link>
                      </td></tr>
                    )}
                    {filtered.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 border border-slate-100">
                              {p.images[0] ? (
                                <img src={`${BASE}${p.images[0]}`} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="material-symbols-outlined text-sm text-outline">image</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-on-surface">{p.productName}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{p.category?.categoryName ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{p.brand?.brandName ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-on-surface font-semibold text-right">
                          ${(p.discountPrice ?? p.price).toFixed(2)}
                          {p.discountPrice && <span className="ml-1 line-through text-outline text-xs">${p.price.toFixed(2)}</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                            p.status === 'OUT_OF_STOCK' ? 'bg-error-container text-on-error-container' :
                            'bg-slate-100 text-slate-600'
                          }`}>{p.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/shop/products/${p.id}/edit`} className="p-2 hover:bg-primary-container/10 rounded-lg text-outline group-hover:text-primary transition-colors">
                              <span className="material-symbols-outlined">edit</span>
                            </Link>
                            <button onClick={() => setDeleteId(p.id)} className="p-2 hover:bg-error-container/10 rounded-lg text-outline hover:text-error transition-colors">
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                <p className="text-xs text-outline">Showing {filtered.length} of {products.length} products</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-primary-container text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-xs opacity-80 uppercase tracking-widest font-bold">Total Products</p>
                  <h3 className="text-4xl font-bold mt-2">{products.length}</h3>
                  <div className="flex items-center gap-1 mt-4 text-xs">
                    <span className="material-symbols-outlined text-sm">inventory_2</span>
                    <span>{products.filter(p => p.status === 'ACTIVE').length} active</span>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full" />
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-3">Quick Add</h4>
                <Link href="/shop/products/new"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-outline-variant rounded-xl text-outline hover:border-primary hover:text-primary transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-3xl mb-2">add_a_photo</span>
                  <span className="text-xs font-semibold">Upload Product</span>
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-3">Stock Status</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Active', count: products.filter(p => p.status === 'ACTIVE').length, color: 'bg-green-500' },
                    { label: 'Out of Stock', count: products.filter(p => p.status === 'OUT_OF_STOCK').length, color: 'bg-error' },
                    { label: 'Disabled', count: products.filter(p => p.status === 'DISABLED').length, color: 'bg-slate-400' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                        <span className="text-xs text-on-surface-variant">{s.label}</span>
                      </div>
                      <span className="text-xs font-bold text-on-surface">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <div className="w-12 h-12 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-error">delete</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface text-center mb-2">Delete Product?</h3>
            <p className="text-sm text-on-surface-variant text-center mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-outline-variant rounded-xl font-semibold text-sm hover:bg-surface-container transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteProduct(deleteId)} className="flex-1 py-3 bg-error text-white rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar variant="shop" />
    </div>
  );
}
