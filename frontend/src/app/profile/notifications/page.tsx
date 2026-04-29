'use client';
import { useEffect, useState, Suspense } from 'react';
import TopNavBar from '@/components/TopNavBar';
import Link from 'next/link';
import api from '@/lib/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function NotificationsContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications').then(r => setNotifications(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = async () => {
    await api.patch('/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavBar variant="customer" />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/profile" className="flex items-center gap-2 text-outline hover:text-on-surface mb-6 transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="font-semibold text-sm">Back to Profile</span>
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Notifications</h1>
            {unread > 0 && <p className="text-sm text-outline mt-0.5">{unread} unread</p>}
          </div>
          {unread > 0 && (
            <button onClick={markAllAsRead} className="text-sm font-bold text-primary hover:underline">
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 text-outline">
            <span className="material-symbols-outlined text-5xl block mb-3 opacity-40">notifications_paused</span>
            <p className="font-semibold">No notifications yet</p>
            <p className="text-sm mt-1">We'll notify you when something important happens.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n._id}
                onClick={() => !n.isRead && markAsRead(n._id)}
                className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all hover:shadow-sm ${!n.isRead ? 'border-primary/30 bg-primary/[0.02]' : 'border-slate-100'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-primary' : 'bg-transparent border border-outline-variant'}`} />
                  <div className="flex-1">
                    <h3 className={`text-sm mb-1 ${!n.isRead ? 'font-bold text-on-surface' : 'font-semibold text-on-surface-variant'}`}>
                      {n.title}
                    </h3>
                    <p className="text-sm text-outline">{n.message}</p>
                    <span className="text-xs text-outline/60 mt-2 block">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function NotificationsPage() {
  return <Suspense><NotificationsContent /></Suspense>;
}
