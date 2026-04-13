'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { ArrowLeft, Plus, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    // In a real app we need a shop specific endpoint for this
    // We'll mock it for now since we just created the backend without a specific "get my products" endpoint
    try {
      const shopProfile = await api.get('/shop/profile');
      const res = await api.get(`/product/shop/${shopProfile.data.id}`);
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('file', selectedFile);
        const uploadRes = await api.post('/upload/image', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.url;
      }

      await api.post('/product', {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        images: imageUrl ? [imageUrl] : []
      });
      
      setShowForm(false);
      fetchProducts();
      setFormData({ name: '', description: '', price: '', quantity: '' });
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      alert('Failed to create product');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <button onClick={() => router.push('/dashboard')} className="btn-secondary" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>My Products</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', background: 'var(--input-bg)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Create New Product</h2>
          <form onSubmit={handleCreateProduct}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" step="0.01" className="form-input" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input" rows={3} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Quantity in Stock</label>
                <input type="number" className="form-input" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} id="file-upload" style={{ display: 'none' }} />
                  <label htmlFor="file-upload" className="btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                    <ImageIcon size={16} /> Choose Image
                  </label>
                  <span style={{ fontSize: '0.875rem', color: 'var(--secondary-foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedFile ? selectedFile.name : 'No file chosen'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn-primary">Save Product</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {products.map(product => (
          <div key={product._id} className="card" style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', background: 'var(--secondary)', overflow: 'hidden', flexShrink: 0 }}>
              {product.images?.[0] && <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{product.name}</h3>
              <div style={{ color: 'var(--accent)', fontWeight: 700, margin: '0.25rem 0' }}>${product.price.toFixed(2)}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--secondary-foreground)' }}>Stock: {product.quantity}</div>
            </div>
          </div>
        ))}
        {products.length === 0 && !showForm && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--secondary-foreground)' }}>
            No products found. Click "Add Product" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
