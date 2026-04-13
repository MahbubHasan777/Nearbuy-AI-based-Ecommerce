'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import styles from '../auth.module.css';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = emailState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const role = res.data.userType;
      
      if (role === 'CUSTOMER') router.push('/home');
      else if (role === 'SHOP') router.push('/dashboard');
      else router.push(`/${role.toLowerCase()}/dashboard`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.authCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your NearBuy account</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.links}>
          <Link href="/register-customer">Create a customer account</Link>
          <Link href="/register-shop">Register your shop</Link>
          <Link href="/forgot-password" style={{ color: 'var(--secondary-foreground)' }}>Forgot Password?</Link>
        </div>
      </motion.div>
    </div>
  );
}

function emailState(initial: string) {
  return useState(initial);
}
