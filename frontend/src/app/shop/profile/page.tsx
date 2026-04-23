'use client';
import { useEffect, useState, useRef } from 'react';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import ShopSidebar from '@/components/ShopSidebar';
import LocationPicker from '@/components/LocationPicker';
import api from '@/lib/api';

export default function ShopProfilePage() {
  const [form, setForm] = useState({
    ownerName: '',
    shopAddress: '',
    phone: '',
    lat: '',
    lng: '',
  });
  const [shopName, setShopName] = useState('Your Shop');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [currentPic, setCurrentPic] = useState('');
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const BASE = 'http://localhost:3001/uploads/';

  useEffect(() => {
    api.get('/shop/profile').then(r => {
      const d = r.data;
      setShopName(d.shopName ?? 'Your Shop');
      setForm({
        ownerName: d.ownerName ?? '',
        shopAddress: d.shopAddress ?? '',
        phone: d.phone ?? '',
        lat: d.lat != null ? String(d.lat) : '',
        lng: d.lng != null ? String(d.lng) : '',
      });
      if (d.profilePic) setCurrentPic(d.profilePic);
    }).catch(() => {}).finally(() => setDataLoading(false));
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setProfilePic(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      const body: Record<string, any> = {};
      if (form.ownerName) body.ownerName = form.ownerName;
      if (form.shopAddress) body.shopAddress = form.shopAddress;
      if (form.phone) body.phone = form.phone;
      if (form.lat) body.lat = parseFloat(form.lat);
      if (form.lng) body.lng = parseFloat(form.lng);

      await api.patch('/shop/profile', body);

      if (profilePic) {
        const fd = new FormData();
        fd.append('file', profilePic);
        await api.patch('/shop/profile/picture', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to save changes');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavBar variant="shop" />
      <div className="flex w-full max-w-[1440px] mx-auto">
        <ShopSidebar shopName={shopName} />

        <main className="flex-1 p-6 lg:p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-on-surface">Shop Settings</h1>
            <p className="text-outline mt-1">Update your shop&apos;s public profile</p>
          </div>

          {dataLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-on-surface border-b border-slate-100 pb-3 mb-6">
                  Shop Logo
                </h2>
                <div className="flex items-center gap-6">
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-24 h-24 rounded-2xl border-2 border-dashed border-outline-variant cursor-pointer hover:border-primary transition-all overflow-hidden bg-surface-container-low flex items-center justify-center flex-shrink-0"
                  >
                    {(preview || currentPic) ? (
                      <img src={preview || `${BASE}${currentPic}`} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-outline">store</span>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="px-4 py-2 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-surface-container transition-colors"
                    >
                      Change Photo
                    </button>
                    <p className="text-xs text-outline mt-2">PNG or JPG, max 5MB</p>
                    {preview && (
                      <p className="text-xs text-primary mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        New photo selected
                      </p>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 space-y-5">
                <h2 className="text-lg font-bold text-on-surface border-b border-slate-100 pb-3">
                  Shop Information
                </h2>

                <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30">
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Shop Name</p>
                  <p className="text-sm font-semibold text-on-surface">{shopName}</p>
                  <p className="text-xs text-outline mt-0.5">Contact support to change your shop name</p>
                </div>

                {[
                  { key: 'ownerName', label: 'Owner Name', placeholder: 'Mohammad Mahbub', type: 'text' },
                  { key: 'shopAddress', label: 'Shop Address', placeholder: '123 Main Street, Dhaka', type: 'text' },
                  { key: 'phone', label: 'Phone Number', placeholder: '+8801...' , type: 'tel' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder={placeholder}
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 mt-4">
                    <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-3">Pinpoint Location on Map</label>
                    <div className="h-[400px] rounded-xl overflow-hidden border border-outline-variant">
                      <LocationPicker 
                        lat={parseFloat(form.lat) || 23.8103} 
                        lng={parseFloat(form.lng) || 90.4125} 
                        onChange={(lat, lng) => setForm(f => ({ ...f, lat: lat.toString(), lng: lng.toString() }))}
                      />
                    </div>
                    <div className="flex gap-4 mt-2">
                      <div className="flex-1 bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <span className="block text-[10px] text-outline uppercase font-bold">Lat</span>
                        <span className="text-sm font-mono">{form.lat || 'Not set'}</span>
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <span className="block text-[10px] text-outline uppercase font-bold">Lng</span>
                        <span className="text-sm font-mono">{form.lng || 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Profile updated successfully!
                </div>
              )}
              {error && (
                <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-primary-container text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-primary transition-colors active:scale-95 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </main>
      </div>
      <BottomNavBar variant="shop" />
    </div>
  );
}
