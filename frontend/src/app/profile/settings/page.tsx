'use client';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import api from '@/lib/api';
import Link from 'next/link';

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'general');

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // General Forms
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [picUploading, setPicUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Delete Form
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get('/customer/profile').then(r => {
      setProfile(r.data);
      setName(r.data.fullName || r.data.name || '');
      setAddress(r.data.address || '');
    }).finally(() => setLoading(false));
  }, []);

  const handlePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPicUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await api.post('/customer/profile/picture', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile({ ...profile, profilePic: r.data.profilePic });
      alert('Profile picture updated!');
    } catch {
      alert('Failed to update picture.');
    } finally {
      setPicUploading(false);
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeneral(true);
    try {
      await api.patch('/customer/profile', { fullName: name, address });
      alert('Profile updated successfully!');
      setProfile({ ...profile, fullName: name, address });
    } catch {
      alert('Failed to update profile.');
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      alert('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure you want to permanently delete your account? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete('/customer/account');
      alert('Your account has been deleted.');
      localStorage.removeItem('token');
      router.push('/login');
    } catch {
      alert('Failed to delete account.');
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background font-sans flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavBar variant="customer" />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-64 flex-shrink-0">
          <Link href="/profile" className="flex items-center gap-2 text-outline hover:text-on-surface mb-6 transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="font-semibold text-sm">Back to Profile</span>
          </Link>

          <h2 className="text-2xl font-bold text-on-surface mb-4">Settings</h2>
          <nav className="flex flex-col gap-2">
            <button onClick={() => setActiveTab('general')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'general' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}>
              <span className="material-symbols-outlined text-[20px]">person</span> General
            </button>
            <button onClick={() => setActiveTab('password')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'password' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}>
              <span className="material-symbols-outlined text-[20px]">lock</span> Password
            </button>
            <button onClick={() => setActiveTab('delete')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'delete' ? 'bg-error text-white' : 'text-error hover:bg-error-container/20'}`}>
              <span className="material-symbols-outlined text-[20px]">delete</span> Danger Zone
            </button>
          </nav>
        </aside>

        <section className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
          {activeTab === 'general' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-slate-100 pb-4">General Information</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container border-4 border-white shadow-md">
                    {profile?.profilePic ? (
                      <img src={`http://localhost:3001/uploads/${profile.profilePic}`} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-container text-white">
                        <span className="material-symbols-outlined text-4xl">person</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handlePicUpload} />
                  {picUploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full"><span className="material-symbols-outlined animate-spin">refresh</span></div>}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">{profile?.fullName || profile?.name}</h4>
                  <p className="text-sm text-outline">{profile?.email}</p>
                </div>
              </div>

              <form onSubmit={handleSaveGeneral} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} required
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Address</label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)}
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px] resize-y" />
                </div>
                <button type="submit" disabled={savingGeneral}
                  className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl shadow hover:bg-primary/90 transition-colors disabled:opacity-60">
                  {savingGeneral ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-slate-100 pb-4">Change Password</h3>
              <form onSubmit={handleSavePassword} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Current Password</label>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6}
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <button type="submit" disabled={savingPassword}
                  className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl shadow hover:bg-primary/90 transition-colors disabled:opacity-60">
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'delete' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-error mb-6 border-b border-error/20 pb-4">Danger Zone</h3>
              <div className="bg-error-container/10 border border-error/20 rounded-2xl p-6">
                <h4 className="font-bold text-on-surface mb-2">Delete Account</h4>
                <p className="text-sm text-on-surface-variant mb-6">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button onClick={handleDeleteAccount} disabled={deleting}
                  className="px-6 py-3 bg-error text-white font-bold rounded-xl shadow hover:bg-error/90 transition-colors disabled:opacity-60">
                  {deleting ? 'Deleting...' : 'Permanently Delete Account'}
                </button>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default function SettingsPage() {
  return <Suspense><SettingsContent /></Suspense>;
}
