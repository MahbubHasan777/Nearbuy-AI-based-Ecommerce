'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import styles from '../search/search.module.css'; // Reuse search styles for products
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import { use } from 'react';

export default function ShopPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShopData();
  }, [id]);

  const fetchShopData = async () => {
    try {
      // In a real app, we would have a specific endpoint for shop public profile
      // For now we use the manage endpoint to fetch shop details
      const shopRes = await api.get(`/manage/shops/${id}`);
      setShop(shopRes.data);

      const prodRes = await api.get(`/product/shop/${id}`);
      setProducts(prodRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Shop...</div>;
  if (!shop) return <div style={{ padding: '2rem', textAlign: 'center' }}>Shop not found.</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <button onClick={() => router.back()} className="btn-secondary" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
        {/* Banner msg */}
        {shop.bannerMsg && (
          <div style={{ background: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center', fontWeight: 500, fontSize: '0.875rem' }}>
            Announcement: {shop.bannerMsg}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: shop.bannerMsg ? '2rem' : '0' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--secondary)', flexShrink: 0, overflow: 'hidden' }}>
            {shop.profilePic && <img src={shop.profilePic} alt={shop.shopName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>{shop.shopName}</h1>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-foreground)', marginBottom: '0.5rem' }}>
              <MapPin size={16} /> {shop.shopAddress}
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-foreground)' }}>
              <Phone size={16} /> {shop.phone}
            </p>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Products Available</h2>
      
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          This shop hasn't listed any products yet.
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.imagePlaceholder}>
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <span>No Image</span>
                )}
              </div>
              <div className={styles.details}>
                <h2 className={styles.productName}>{product.name}</h2>
                <div className={styles.price}>${product.price.toFixed(2)}</div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                  <button className="btn-primary" style={{ padding: '0.5rem 1rem', flex: 1, marginRight: '0.5rem' }}>Add to Cart</button>
                  <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>♥</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
