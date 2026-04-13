'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'CUSTOMER',
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
          <p className="text-on-surface-variant mt-2">Create your customer account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <h2 className="text-2xl font-bold text-on-surface mb-6">Join NearBuy</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">First Name</label>
                <input required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none transition-all"
                  placeholder="John" />
              </div>
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Last Name</label>
                <input required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none transition-all"
                  placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Email</label>
              <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none transition-all"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none transition-all"
                placeholder="+880..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Password</label>
              <input required type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none transition-all"
                placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input required type="password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none transition-all"
                placeholder="••••••••" />
            </div>

            {error && <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm font-medium">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-primary-container text-white rounded-xl py-3.5 font-bold text-sm shadow-lg shadow-primary-container/20 hover:bg-primary transition-colors active:scale-95 disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            <p className="text-on-surface-variant">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
            <p className="text-on-surface-variant">
              Own a shop?{' '}
              <Link href="/shop/register" className="text-secondary font-semibold hover:underline">Register your shop</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
