'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import styles from '../auth.module.css';
import Link from 'next/link';

export default function RegisterCustomerPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    address: '',
    gender: 'MALE',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/customer/register', formData);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.authCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={styles.title}>Customer Registration</h1>
        <p className={styles.subtitle}>Create your NearBuy customer account</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" className="form-input" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" className="form-input" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="text" id="phone" className="form-input" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" className="form-input" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select id="gender" className="form-input" value={formData.gender} onChange={handleChange}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="form-input" value={formData.password} onChange={handleChange} required minLength={8} />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register as Customer'}
          </button>
        </form>

        <div className={styles.links}>
          <Link href="/login">Already have an account? Sign in</Link>
          <Link href="/register-shop">Register a Shop instead</Link>
        </div>
      </motion.div>
    </div>
  );
}
