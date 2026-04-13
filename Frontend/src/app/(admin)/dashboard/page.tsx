'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Users, Store, CheckCircle, XCircle, Power } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [shops, setShops] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [tab, setTab] = useState('shops');
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [shopsRes, custRes] = await Promise.all([
        api.get('/manage/shops'),
        api.get('/manage/customers')
      ]);
      setShops(shopsRes.data);
      setCustomers(custRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id: string) => {
    await api.patch(`/manage/shops/${id}/approve`);
    fetchData();
  };

  const handleReject = async (id: string) => {
    await api.patch(`/manage/shops/${id}/reject`);
    fetchData();
  };

  const handleToggleShop = async (id: string, current: boolean) => {
    await api.patch(`/manage/shops/${id}/toggle-active`, { isActive: !current });
    fetchData();
  };

  const handleToggleCustomer = async (id: string, current: boolean) => {
    await api.patch(`/manage/customers/${id}/toggle-active`, { isActive: !current });
    fetchData();
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Management Portal</h1>
        <button className="btn-secondary" onClick={() => api.post('/auth/logout').then(() => router.push('/login'))}>Logout</button>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={tab === 'shops' ? 'btn-primary' : 'btn-secondary'} onClick={() => setTab('shops')}>
          <Store size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
          Manage Shops
        </button>
        <button className={tab === 'customers' ? 'btn-primary' : 'btn-secondary'} onClick={() => setTab('customers')}>
          <Users size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
          Manage Customers
        </button>
      </div>

      <div className="card">
        {tab === 'shops' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>Shop Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Active</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map(shop => (
                <tr key={shop.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{shop.shopName}</td>
                  <td style={{ padding: '1rem', color: 'var(--secondary-foreground)' }}>{shop.ownerEmail}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      background: shop.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : shop.status === 'PENDING' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: shop.status === 'APPROVED' ? 'var(--accent)' : shop.status === 'PENDING' ? '#f59e0b' : 'var(--danger)'
                    }}>
                      {shop.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{shop.isActive ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    {shop.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleApprove(shop.id)} style={{ color: 'var(--accent)', padding: '0.5rem' }} title="Approve"><CheckCircle size={20} /></button>
                        <button onClick={() => handleReject(shop.id)} style={{ color: 'var(--danger)', padding: '0.5rem' }} title="Reject"><XCircle size={20} /></button>
                      </>
                    )}
                    <button onClick={() => handleToggleShop(shop.id, shop.isActive)} style={{ color: shop.isActive ? 'var(--danger)' : 'var(--accent)', padding: '0.5rem' }} title="Toggle Active">
                      <Power size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'customers' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>Username</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Active</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(cust => (
                <tr key={cust.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{cust.username}</td>
                  <td style={{ padding: '1rem', color: 'var(--secondary-foreground)' }}>{cust.email}</td>
                  <td style={{ padding: '1rem' }}>{cust.isActive ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button onClick={() => handleToggleCustomer(cust.id, cust.isActive)} style={{ color: cust.isActive ? 'var(--danger)' : 'var(--accent)', padding: '0.5rem' }} title={cust.isActive ? 'Disable' : 'Enable'}>
                      <Power size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
