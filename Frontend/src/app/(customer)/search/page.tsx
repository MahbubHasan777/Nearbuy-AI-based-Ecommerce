'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import styles from './search.module.css';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const radius = searchParams.get('radius') || '5000';
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchResults();
  }, [q, radius]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(q)}&radius=${radius}`);
      setResults(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={() => router.push('/home')} className="btn-secondary" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Home
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}><SearchIcon /> Search Results</h1>
        <p className={styles.subtitle}>Showing results for "{q}" within {parseInt(radius)/1000} km</p>
      </header>

      {loading ? (
        <div>Loading results...</div>
      ) : results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--secondary-foreground)' }}>
          No products found nearby matching your query.
        </div>
      ) : (
        <div className={styles.grid}>
          {results.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.imagePlaceholder}>
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <span>No Image</span>
                )}
                {product.relevanceScore > 80 && <span className={styles.badge}>Highly Relevant</span>}
              </div>
              <div className={styles.details}>
                <h2 className={styles.productName}>{product.name}</h2>
                <div className={styles.price}>${product.price.toFixed(2)}</div>
                
                <div className={styles.shopInfo}>
                  <div>
                    <span>Sold by: </span>
                    <Link href={`/shop/${product.shopId}`}>{product.shopId.slice(0,8)}...</Link>
                  </div>
                  {product.quantity > 0 ? (
                    <span style={{ color: 'var(--accent)' }}>In Stock</span>
                  ) : (
                    <span style={{ color: 'var(--danger)' }}>Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
