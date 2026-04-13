'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', role: 'CUSTOMER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password, form.role);
      if (form.role === 'CUSTOMER') router.push('/');
      else if (form.role === 'SHOP') router.push('/shop/dashboard');
      else router.push('/admin/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-primary-container mb-2">NearBuy</h1>
          <p className="text-on-surface-variant">Hyperlocal Shopping Platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <h2 className="text-2xl font-bold text-on-surface mb-6">Welcome back</h2>

          <div className="flex bg-surface-container rounded-xl p-1 mb-6">
            {(['CUSTOMER', 'SHOP', 'ADMIN'] as const).map(role => (
              <button
                key={role}
                onClick={() => setForm(f => ({ ...f, role }))}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  form.role === role
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {role === 'CUSTOMER' ? 'Customer' : role === 'SHOP' ? 'Shop' : 'Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-white rounded-xl py-3 font-bold text-sm shadow-lg shadow-primary-container/20 hover:bg-primary transition-colors active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 text-center text-sm">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
            <p className="text-on-surface-variant">
              New customer?{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Create account
              </Link>
            </p>
            <p className="text-on-surface-variant">
              Own a shop?{' '}
              <Link href="/shop/register" className="text-secondary font-semibold hover:underline">
                Register your shop
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
