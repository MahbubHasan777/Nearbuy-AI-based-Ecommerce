'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Package, Heart, Activity, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ShopDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/shop/profile');
      setProfile(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = (e.target as any).message.value;
    try {
      await api.patch('/shop/message', { message: msg });
      alert('Banner message updated!');
      fetchProfile();
    } catch (error) {
      console.error(error);
    }
  };

  if (!profile) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Shop Dashboard</h1>
          <p style={{ color: 'var(--secondary-foreground)' }}>Welcome back, {profile.shopName}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={() => router.push('/products')}>Manage Products</button>
          <button className="btn-secondary" onClick={() => api.post('/auth/logout').then(() => router.push('/login'))}>Logout</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '50%' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>12</div>
            <div style={{ color: 'var(--secondary-foreground)', fontSize: '0.875rem' }}>Active Products</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', borderRadius: '50%' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profile.status}</div>
            <div style={{ color: 'var(--secondary-foreground)', fontSize: '0.875rem' }}>Account Status</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings size={20} /> Update Banner Message</h2>
        <form onSubmit={handleUpdateMessage}>
          <div className="form-group">
            <label>Announce sales or important info to your customers</label>
            <textarea 
              name="message" 
              className="form-input" 
              defaultValue={profile.bannerMsg || ''} 
              rows={3} 
              placeholder="e.g., 20% off all items this weekend!"
            ></textarea>
          </div>
          <button type="submit" className="btn-primary">Update Banner</button>
        </form>
      </div>
    </div>
  );
}
