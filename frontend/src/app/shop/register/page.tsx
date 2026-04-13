'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ShopRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    shopName: '', shopAddress: '', shopDescription: '',
    lat: '', lng: '',
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setProfilePic(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      fd.append('role', 'SHOP');
      if (profilePic) fd.append('profilePic', profilePic);
      await api.post('/auth/register-shop', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      router.push('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none transition-all"
        placeholder={placeholder} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-black tracking-tighter text-primary-container">NearBuy</Link>
          <p className="text-on-surface-variant mt-2">Register your local shop</p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${step >= s ? 'bg-primary-container' : 'bg-surface-container-high'}`} />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-on-surface mb-6">Account Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {field('firstName', 'First Name', 'text', 'John')}
                  {field('lastName', 'Last Name', 'text', 'Doe')}
                </div>
                {field('email', 'Email', 'email', 'shop@example.com')}
                {field('phone', 'Phone', 'tel', '+880...')}
                {field('password', 'Password', 'password', '••••••••')}
              </div>
              <button
                type="button"
                onClick={() => { if (!form.firstName || !form.email || !form.password) { setError('Please fill all required fields'); return; } setError(''); setStep(2); }}
                className="w-full mt-6 bg-primary-container text-white rounded-xl py-3.5 font-bold text-sm shadow-lg hover:bg-primary transition-colors active:scale-95"
              >
                Continue →
              </button>
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-on-surface mb-6">Shop Details</h2>
              <div className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-24 h-24 rounded-2xl border-2 border-dashed border-outline-variant cursor-pointer hover:border-primary transition-all overflow-hidden flex items-center justify-center bg-surface-container-low"
                  >
                    {preview ? (
                      <img src={preview} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-outline">add_a_photo</span>
                    )}
                  </div>
                  <p className="text-xs text-outline mt-2">Shop Logo (optional)</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </div>

                {field('shopName', 'Shop Name *', 'text', 'My Local Shop')}
                {field('shopAddress', 'Shop Address *', 'text', '123 Main St, Dhaka')}
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Description</label>
                  <textarea value={form.shopDescription} onChange={e => setForm(f => ({ ...f, shopDescription: e.target.value }))}
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none transition-all min-h-[80px] resize-y"
                    placeholder="Tell customers about your shop..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {field('lat', 'Latitude', 'number', '23.8103')}
                  {field('lng', 'Longitude', 'number', '90.4125')}
                </div>
              </div>

              {error && <div className="mt-4 bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm font-medium">{error}</div>}

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 border border-outline-variant rounded-xl font-semibold text-sm hover:bg-surface-container transition-colors">
                  ← Back
                </button>
                <button type="submit" disabled={loading || !form.shopName || !form.shopAddress}
                  className="flex-1 py-3.5 bg-secondary-container text-white rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-60">
                  {loading ? 'Registering...' : 'Register Shop'}
                </button>
              </div>
            </form>
          )}

          {step === 1 && error && <div className="mt-4 bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm font-medium">{error}</div>}

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Already registered?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
