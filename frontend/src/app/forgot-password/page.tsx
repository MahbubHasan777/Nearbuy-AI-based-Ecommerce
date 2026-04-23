'use client';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import TopNavBar from '@/components/TopNavBar';

function ForgotPasswordContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. User might not exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      alert('Password reset successfully! Please login.');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      <TopNavBar variant="customer" />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-5xl text-primary mb-2">lock_reset</span>
            <h1 className="text-2xl font-black text-on-surface">Forgot Password</h1>
            <p className="text-sm text-outline mt-1">
              {step === 1 && "Enter your email to receive an OTP."}
              {step === 2 && "Enter the OTP sent to your email."}
              {step === 3 && "Create a new strong password."}
            </p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-xl text-sm font-medium mb-6 text-center">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">6-Digit OTP</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm text-center tracking-[0.5em] font-mono focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm font-bold text-primary hover:underline mt-2"
              >
                Use a different email
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading || newPassword.length < 6}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-outline font-medium">
              Remember your password? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return <Suspense><ForgotPasswordContent /></Suspense>;
}
