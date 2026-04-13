'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import styles from '../auth.module.css';
import Link from 'next/link';

export default function RegisterShopPage() {
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    password: '',
    shopName: '',
    shopAddress: '',
    phone: '',
    lat: 0,
    lng: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/shop/register', formData);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
      }, () => {
        setError('Failed to get location. Please allow location access.');
      });
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.authCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ maxWidth: '600px' }}
      >
        <h1 className={styles.title}>Shop Registration</h1>
        <p className={styles.subtitle}>Join NearBuy to list your products to nearby customers.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="ownerName">Owner Name</label>
              <input type="text" id="ownerName" className="form-input" value={formData.ownerName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="ownerEmail">Owner Email</label>
              <input type="email" id="ownerEmail" className="form-input" value={formData.ownerEmail} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="shopName">Shop Name</label>
              <input type="text" id="shopName" className="form-input" value={formData.shopName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="text" id="phone" className="form-input" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="shopAddress">Shop Address</label>
            <input type="text" id="shopAddress" className="form-input" value={formData.shopAddress} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Location Coordinates</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="number" step="any" id="lat" className="form-input" placeholder="Latitude" value={formData.lat} onChange={handleChange} required style={{ flex: 1 }} />
              <input type="number" step="any" id="lng" className="form-input" placeholder="Longitude" value={formData.lng} onChange={handleChange} required style={{ flex: 1 }} />
              <button type="button" onClick={getCurrentLocation} className="btn-secondary" style={{ padding: '0.75rem 1rem' }}>Get My Location</button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--secondary-foreground)', marginTop: '0.25rem' }}>We will add a map picker here in Phase 3.</p>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="form-input" value={formData.password} onChange={handleChange} required minLength={8} />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register Shop'}
          </button>
        </form>

        <div className={styles.links}>
          <Link href="/login">Already have an account? Sign in</Link>
          <Link href="/register-customer">Register as a Customer instead</Link>
        </div>
      </motion.div>
    </div>
  );
}
