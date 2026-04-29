'use client';
import { useEffect, useState, Suspense } from 'react';
import TopNavBar from '@/components/TopNavBar';
import Link from 'next/link';
import api from '@/lib/api';

function AddressesContent() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/customer/profile').then(r => {
      setAddress(r.data.address || '');
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch('/customer/profile', { address });
      alert('Address updated successfully!');
    } catch {
      alert('Failed to update address.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavBar variant="customer" />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/profile" className="flex items-center gap-2 text-outline hover:text-on-surface mb-6 transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="font-semibold text-sm">Back to Profile</span>
        </Link>

        <h1 className="text-2xl font-bold text-on-surface mb-6">My Address</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Delivery Address</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={4}
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-y"
                  placeholder="Enter your full delivery address..."
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AddressesPage() {
  return <Suspense><AddressesContent /></Suspense>;
}
