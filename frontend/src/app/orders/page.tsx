'use client';
import { useEffect, useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import api from '@/lib/api';
import Link from 'next/link';

interface Order {
  id?: string;
  _id?: string;
  productId: string;
  shopId: string;
  status: string;
  createdAt: string;
  markedAt?: string;
  product?: { name: string; images: string[]; price: number };
  shop?: { shopName: string };
}

const statusColor: Record<string, string> = {
  PENDING: 'bg-blue-50 text-blue-700',
  PROCESSING: 'bg-orange-50 text-orange-700',
  READY: 'bg-purple-50 text-purple-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/customer/orders').then(r => setOrders(r.data)).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const BASE = 'http://localhost:3001/uploads/';

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <TopNavBar variant="customer" />
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-4xl font-bold text-on-surface mb-2">My Orders</h1>
        <p className="text-on-surface-variant mb-8">Track your local shop purchases</p>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-card border border-slate-100">
            <span className="material-symbols-outlined text-6xl text-outline block mb-4">receipt_long</span>
            <p className="text-xl font-semibold text-on-surface">No orders yet</p>
            <p className="text-sm text-on-surface-variant mt-2">Start shopping from nearby stores!</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order, i) => (
            <div key={order.id || order._id || i} className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
              <div className="flex">
                <div className="w-24 h-24 flex-shrink-0 bg-surface-container">
                  {order.product?.images?.[0] ? (
                    <img src={`${BASE}${order.product.images[0]}`} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl text-outline">inventory_2</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-on-surface text-sm">{order.product?.name ?? 'Product'}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColor[order.status] ?? 'bg-slate-50 text-slate-600'}`}>
                      {order.status}
                    </span>
                  </div>
                  {order.shop && (
                    <p className="text-xs text-outline mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">store</span>{order.shop.shopName}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    {order.product?.price && (
                      <p className="text-sm font-bold text-primary"> ৳{order.product.price.toFixed(2)}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-outline">{new Date(order.createdAt || order.markedAt || Date.now()).toLocaleDateString()}</p>
                      <Link href={`/products/${order.productId}`} className="px-3 py-1.5 bg-primary-container text-white text-xs font-bold rounded-lg hover:bg-primary transition-colors">
                        Write Review
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNavBar variant="customer" />
    </div>
  );
}
