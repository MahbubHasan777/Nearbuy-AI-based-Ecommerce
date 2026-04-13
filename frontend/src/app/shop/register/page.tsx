'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ShopRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    ownerName: '', ownerEmail: '', phone: '', password: '',
    shopName: '', shopAddress: '', lat: '', lng: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/shop/register', {
        ownerName: form.ownerName,
        ownerEmail: form.ownerEmail,
        phone: form.phone,
        password: form.password,
        shopName: form.shopName,
        shopAddress: form.shopAddress,
        lat: parseFloat(form.lat) || 0,
        lng: parseFloat(form.lng) || 0,
      });
      router.push('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

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
              <h2 className="text-2xl font-bold text-on-surface mb-6">Owner Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Owner Full Name *</label>
                  <input required value={form.ownerName} onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))}
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none"
                    placeholder="Mohammad Mahbub" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Owner Email *</label>
                  <input required type="email" value={form.ownerEmail} onChange={e => setForm(f => ({ ...f, ownerEmail: e.target.value }))}
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none"
                    placeholder="shop@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Phone *</label>
                  <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none"
                    placeholder="+8801..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Password * (min 8 chars)</label>
                  <input required type="password" minLength={8} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none"
                    placeholder="••••••••" />
                </div>
              </div>
              {error && <div className="mt-4 bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm font-medium">{error}</div>}
              <button type="button"
                onClick={() => {
                  if (!form.ownerName || !form.ownerEmail || !form.phone || !form.password) {
                    setError('Please fill all required fields'); return;
                  }
                  if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
                  setError(''); setStep(2);
                }}
                className="w-full mt-6 bg-primary-container text-white rounded-xl py-3.5 font-bold text-sm shadow-lg hover:bg-primary transition-colors active:scale-95">
                Continue →
              </button>
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-on-surface mb-6">Shop Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Shop Name *</label>
                  <input required value={form.shopName} onChange={e => setForm(f => ({ ...f, shopName: e.target.value }))}
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none"
                    placeholder="My Local Shop" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Shop Address *</label>
                  <input required value={form.shopAddress} onChange={e => setForm(f => ({ ...f, shopAddress: e.target.value }))}
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none"
                    placeholder="123 Main Street, Dhaka" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Latitude</label>
                    <input type="number" step="any" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
                      className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none"
                      placeholder="23.8103" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Longitude</label>
                    <input type="number" step="any" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
                      className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none"
                      placeholder="90.4125" />
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-primary flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                  <span>Your shop will be reviewed by admins before going live. You can login immediately after registration.</span>
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

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Already registered?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
