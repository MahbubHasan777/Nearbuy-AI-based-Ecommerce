'use client';
import { useEffect, useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import ShopSidebar from '@/components/ShopSidebar';
import api from '@/lib/api';

interface Category {
  _id: string;
  name: string;
}

export default function ShopCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [shopName, setShopName] = useState('Your Shop');

  useEffect(() => {
    api.get('/shop/categories').then(r => setCategories(Array.isArray(r.data) ? r.data : [])).catch(() => {}).finally(() => setLoading(false));
    api.get('/shop/profile').then(r => setShopName(r.data?.shopName ?? 'Your Shop')).catch(() => {});
  }, []);

  const create = async () => {
    if (!newName.trim()) return;
    setCreating(true); setError('');
    try {
      const r = await api.post('/shop/categories', { name: newName.trim() });
      setCategories(prev => [...prev, r.data]);
      setNewName('');
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Failed'); }
    setCreating(false);
  };

  const update = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const r = await api.patch(`/shop/categories/${id}`, { name: editName.trim() });
      setCategories(prev => prev.map(c => c._id === id ? r.data : c));
      setEditId(null);
    } catch {}
  };

  const remove = async (id: string) => {
    await api.delete(`/shop/categories/${id}`);
    setCategories(prev => prev.filter(c => c._id !== id));
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavBar variant="shop" />
      <div className="flex w-full max-w-[1440px] mx-auto">
        <ShopSidebar shopName={shopName} />
        <main className="flex-1 p-6 lg:p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-on-surface">Categories</h1>
            <p className="text-outline mt-1">Organize your products with custom categories</p>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 mb-6">
            <h2 className="text-base font-bold text-on-surface mb-4">Add New Category</h2>
            <div className="flex gap-3">
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') create(); }}
                className="flex-1 border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="e.g. Electronics, Clothing, Fresh Produce..."
              />
              <button onClick={create} disabled={creating || !newName.trim()}
                className="px-6 py-3 bg-primary-container text-white rounded-xl font-bold text-sm hover:bg-primary active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span>
                {creating ? 'Adding...' : 'Add'}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-error font-medium">{error}</p>}
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-on-surface">Your Categories</h2>
              <span className="text-xs text-outline bg-surface-container px-2 py-1 rounded-full">{categories.length} total</span>
            </div>

            {loading && <div className="py-12 text-center"><div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto" /></div>}

            {!loading && categories.length === 0 && (
              <div className="py-16 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl block mb-3">category</span>
                <p className="font-semibold">No categories yet</p>
                <p className="text-xs mt-1">Add your first category above</p>
              </div>
            )}

            <div className="divide-y divide-slate-100">
              {categories.map((cat, i) => (
                <div key={cat._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  {editId === cat._id ? (
                    <div key={`edit-${cat._id}`} className="flex-1 flex gap-2">
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') update(cat._id); if (e.key === 'Escape') setEditId(null); }}
                        className="flex-1 border border-primary rounded-lg px-3 py-1.5 text-sm outline-none"
                        autoFocus
                      />
                      <button onClick={() => update(cat._id)} className="px-3 py-1.5 bg-primary-container text-white rounded-lg text-xs font-bold">Save</button>
                      <button onClick={() => setEditId(null)} className="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-bold">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-sm font-semibold text-on-surface">{cat.name}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditId(cat._id); setEditName(cat.name); }} className="p-2 text-outline hover:text-primary-container hover:bg-blue-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={() => remove(cat._id)} className="p-2 text-outline hover:text-error hover:bg-error-container/10 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <BottomNavBar variant="shop" />
    </div>
  );
}
