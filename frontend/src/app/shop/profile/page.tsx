'use client';
import { useEffect, useState, useRef } from 'react';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import api from '@/lib/api';
import Link from 'next/link';

const sideNav = [
  { href: '/shop/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/shop/products', icon: 'inventory_2', label: 'Inventory' },
  { href: '/shop/wishlist-requests', icon: 'heart_plus', label: 'Wishlist Requests' },
  { href: '/shop/profile', icon: 'settings', label: 'Settings', active: true },
];

export default function ShopProfilePage() {
  const [form, setForm] = useState({ shopName: '', shopAddress: '', shopDescription: '', phone: '', lat: '', lng: '' });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [currentPic, setCurrentPic] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const BASE = 'http://localhost:3001/';

  useEffect(() => {
    api.get('/shop/profile').then(r => {
      const d = r.data;
      setForm({
        shopName: d.shopName ?? '',
        shopAddress: d.shopAddress ?? '',
        shopDescription: d.shopDescription ?? '',
        phone: d.phone ?? '',
        lat: String(d.lat ?? ''),
        lng: String(d.lng ?? ''),
      });
      if (d.profilePic) setCurrentPic(d.profilePic);
    }).catch(() => {});
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setProfilePic(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (profilePic) fd.append('profilePic', profilePic);
      await api.patch('/shop/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {}
    setLoading(false);
  };

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
                className={`flex items-center px-6 py-3 transition-all text-sm ${item.active ? 'text-primary-container bg-blue-50 border-r-4 border-primary-container font-semibold' : 'text-slate-600 hover:text-primary-container hover:bg-blue-50/50'}`}>
                <span className="material-symbols-outlined mr-3">{item.icon}</span>{item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4">
            <Link href="/shop/products/new" className="w-full py-3 bg-primary-container text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-sm">add</span> Add Product
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-on-surface">Shop Settings</h1>
            <p className="text-outline mt-1">Update your shop&apos;s public profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-on-surface border-b border-slate-100 pb-3 mb-6">Shop Profile Picture</h2>
              <div className="flex items-center gap-6">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-24 h-24 rounded-2xl border-2 border-dashed border-outline-variant cursor-pointer hover:border-primary transition-all overflow-hidden bg-surface-container-low flex items-center justify-center"
                >
                  {(preview || currentPic) ? (
                    <img src={preview || `${BASE}${currentPic}`} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-outline">store</span>
                  )}
                </div>
                <div>
                  <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-surface-container transition-colors">
                    Change Photo
                  </button>
                  <p className="text-xs text-outline mt-2">PNG or JPG, max 5MB</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 space-y-5">
              <h2 className="text-lg font-bold text-on-surface border-b border-slate-100 pb-3">Shop Information</h2>
              {[
                { key: 'shopName', label: 'Shop Name', placeholder: 'My Local Shop' },
                { key: 'shopAddress', label: 'Address', placeholder: '123 Main Street, Dhaka' },
                { key: 'phone', label: 'Phone Number', placeholder: '+880...' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">{label}</label>
                  <input value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder={placeholder} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.shopDescription} onChange={e => setForm(f => ({ ...f, shopDescription: e.target.value }))}
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px] resize-y"
                  placeholder="Tell customers about your shop..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Latitude</label>
                  <input type="number" step="any" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="23.8103" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Longitude</label>
                  <input type="number" step="any" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="90.4125" />
                </div>
              </div>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Profile updated successfully!
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-primary-container text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-primary transition-colors active:scale-95 disabled:opacity-60">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </main>
      </div>
      <BottomNavBar variant="shop" />
    </div>
  );
}
