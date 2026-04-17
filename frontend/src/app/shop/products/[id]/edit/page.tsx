'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import api from '@/lib/api';
import Link from 'next/link';

interface Category { _id: string; name: string; }
interface Brand { _id: string; name: string; }

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', price: '', discountPrice: '',
    discountPercentage: '', description: '',
    categoryId: '', brandId: '', status: 'IN_STOCK',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const BASE = 'http://localhost:3001/uploads/';

  useEffect(() => {
    api.get('/shop/categories').then(r => setCategories(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/shop/brands').then(r => setBrands(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get(`/shop/products/${id}`).then(r => {
      const p = r.data;
      setForm({
        name: p.name ?? '',
        price: String(p.price ?? ''),
        discountPrice: p.discountPrice ? String(p.discountPrice) : '',
        discountPercentage: p.discountPercentage ? String(p.discountPercentage) : '',
        description: p.description ?? '',
        categoryId: p.categoryId ?? '',
        brandId: p.brandId ?? '',
        status: p.status ?? 'IN_STOCK',
      });
      setExistingImages(Array.isArray(p.images) ? p.images : []);
    }).catch(() => {}).finally(() => setFetching(false));
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', form.price);
      if (form.discountPrice) fd.append('discountPrice', form.discountPrice);
      if (form.discountPercentage) fd.append('discountPercentage', form.discountPercentage);
      if (form.description) fd.append('description', form.description);
      if (form.categoryId) fd.append('categoryId', form.categoryId);
      if (form.brandId) fd.append('brandId', form.brandId);
      if (form.status) fd.append('status', form.status);
      images.forEach(img => fd.append('images', img));
      await api.patch(`/shop/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      router.push('/shop/products');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Something went wrong.'));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen bg-background font-sans flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavBar variant="shop" />
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/shop/products" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Edit Product</h1>
            <p className="text-outline text-sm mt-0.5">Update product details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 space-y-5">
            <h2 className="text-lg font-bold text-on-surface border-b border-slate-100 pb-3">Basic Information</h2>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Product Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="e.g. iPhone 15 Pro Max" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Price (৳) *</label>
                <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Discount Price</label>
                <input type="number" min="0" step="0.01" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))}
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Discount %</label>
                <input type="number" min="0" max="100" value={form.discountPercentage} onChange={e => setForm(f => ({ ...f, discountPercentage: e.target.value }))}
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px] resize-y"
                placeholder="Describe your product..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Category</label>
                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary outline-none">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Brand</label>
                <select value={form.brandId} onChange={e => setForm(f => ({ ...f, brandId: e.target.value }))}
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary outline-none">
                  <option value="">Select Brand</option>
                  {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary outline-none">
                  <option value="IN_STOCK">In Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-on-surface border-b border-slate-100 pb-3 mb-5">
              Product Images <span className="text-xs font-normal text-outline ml-2">(Max 3)</span>
            </h2>
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-outline mb-2">Current Images</p>
                <div className="flex gap-2 flex-wrap">
                  {existingImages.map((img, i) => (
                    <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                      <img src={`${BASE}${img}`} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-outline-variant rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-surface-container-low transition-all group">
              <span className="material-symbols-outlined text-4xl text-outline group-hover:text-primary transition-colors mb-3">add_a_photo</span>
              <p className="text-sm font-semibold text-on-surface-variant">Click to replace images</p>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
            </div>
            {previews.length > 0 && (
              <div className="flex gap-3 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="w-24 h-24 rounded-xl overflow-hidden border-2 border-primary-container">
                    <img src={src} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm font-medium">{error}</div>}

          <div className="flex gap-3 pb-8">
            <Link href="/shop/products" className="flex-1 py-4 border border-outline-variant rounded-xl font-semibold text-on-surface hover:bg-surface-container transition-colors text-center text-sm">
              Cancel
            </Link>
            <button type="submit" disabled={loading}
              className="flex-1 py-4 bg-primary-container text-white rounded-xl font-bold text-sm shadow-lg hover:bg-primary transition-colors active:scale-95 disabled:opacity-60">
              {loading ? 'Saving...' : 'Update Product'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
