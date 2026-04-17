'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import api from '@/lib/api';
import Link from 'next/link';

interface Category { id: string; categoryName: string; }
interface Brand { id: string; brandName: string; }

export default function ProductFormPage() {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const isEdit = !!params?.id && params.id !== 'new';
  const productId = isEdit ? params.id : undefined;

  const [form, setForm] = useState({
    productName: '', price: '', discountPrice: '',
    discountPercentage: '', description: '',
    categoryId: '', brandId: '', status: 'ACTIVE',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [newCatName, setNewCatName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [addingCat, setAddingCat] = useState(false);
  const [addingBrand, setAddingBrand] = useState(false);
  const [showCatInput, setShowCatInput] = useState(false);
  const [showBrandInput, setShowBrandInput] = useState(false);

  const loadCategoriesAndBrands = () => {
    api.get('/shop/categories').then(r => setCategories(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/shop/brands').then(r => setBrands(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  };

  useEffect(() => {
    loadCategoriesAndBrands();
    if (isEdit && productId) {
      api.get(`/products/${productId}`).then(r => {
        const p = r.data;
        setForm({
          productName: p.productName,
          price: String(p.price),
          discountPrice: String(p.discountPrice ?? ''),
          discountPercentage: String(p.discountPercentage ?? ''),
          description: p.description ?? '',
          categoryId: p.category?.id ?? '',
          brandId: p.brand?.id ?? '',
          status: p.status,
        });
        setExistingImages(p.images ?? []);
      }).catch(() => {});
    }
  }, [isEdit, productId]);

  const createCategory = async () => {
    if (!newCatName.trim()) return;
    setAddingCat(true);
    try {
      const r = await api.post('/shop/categories', { name: newCatName.trim() });
      setCategories(prev => [...prev, r.data]);
      setForm(f => ({ ...f, categoryId: r.data.id }));
      setNewCatName('');
      setShowCatInput(false);
    } catch {}
    setAddingCat(false);
  };

  const createBrand = async () => {
    if (!newBrandName.trim()) return;
    setAddingBrand(true);
    try {
      const r = await api.post('/shop/brands', { name: newBrandName.trim() });
      setBrands(prev => [...prev, r.data]);
      setForm(f => ({ ...f, brandId: r.data.id }));
      setNewBrandName('');
      setShowBrandInput(false);
    } catch {}
    setAddingBrand(false);
  };

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
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      images.forEach(img => fd.append('images', img));
      if (isEdit && productId) {
        await api.patch(`/products/${productId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      router.push('/shop/products');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Something went wrong. Check all required fields.');
    } finally {
      setLoading(false);
    }
  };

  const BASE = 'http://localhost:3001/';

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavBar variant="shop" />
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/shop/products" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-on-surface">{isEdit ? 'Edit Product' : 'New Product'}</h1>
            <p className="text-outline text-sm mt-0.5">{isEdit ? 'Update product details' : 'Add a new product to your catalog'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 space-y-5">
            <h2 className="text-lg font-bold text-on-surface border-b border-slate-100 pb-3">Basic Information</h2>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Product Name *</label>
              <input required value={form.productName} onChange={e => setForm(f => ({ ...f, productName: e.target.value }))}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="e.g. Fresh Organic Apples" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Price (৳) *</label>
                <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Discount Price</label>
                <input type="number" min="0" step="0.01" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Discount %</label>
                <input type="number" min="0" max="100" value={form.discountPercentage} onChange={e => setForm(f => ({ ...f, discountPercentage: e.target.value }))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px] resize-y"
                placeholder="Describe your product in detail..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider">Category</label>
                  <button type="button" onClick={() => setShowCatInput(!showCatInput)} className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">add</span> New
                  </button>
                </div>
                {showCatInput && (
                  <div className="flex gap-1 mb-2">
                    <input value={newCatName} onChange={e => setNewCatName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); createCategory(); } }}
                      className="flex-1 border border-primary rounded-lg px-2 py-1.5 text-xs outline-none" placeholder="Category name" />
                    <button type="button" onClick={createCategory} disabled={addingCat} className="px-2 py-1.5 bg-primary-container text-white rounded-lg text-xs font-bold">
                      {addingCat ? '...' : 'Add'}
                    </button>
                  </div>
                )}
                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary outline-none">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider">Brand</label>
                  <button type="button" onClick={() => setShowBrandInput(!showBrandInput)} className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">add</span> New
                  </button>
                </div>
                {showBrandInput && (
                  <div className="flex gap-1 mb-2">
                    <input value={newBrandName} onChange={e => setNewBrandName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); createBrand(); } }}
                      className="flex-1 border border-primary rounded-lg px-2 py-1.5 text-xs outline-none" placeholder="Brand name" />
                    <button type="button" onClick={createBrand} disabled={addingBrand} className="px-2 py-1.5 bg-primary-container text-white rounded-lg text-xs font-bold">
                      {addingBrand ? '...' : 'Add'}
                    </button>
                  </div>
                )}
                <select value={form.brandId} onChange={e => setForm(f => ({ ...f, brandId: e.target.value }))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary outline-none">
                  <option value="">Select Brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.brandName}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary outline-none">
                  <option value="ACTIVE">Active</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                  <option value="DISABLED">Disabled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-on-surface border-b border-slate-100 pb-3 mb-5">
              Product Gallery <span className="text-xs font-normal text-outline ml-2">(Max 3 images)</span>
            </h2>

            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-outline mb-2">Current Images</p>
                <div className="flex gap-2">
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
              <p className="text-sm font-semibold text-on-surface-variant">Click to upload images</p>
              <p className="text-xs text-outline mt-1">PNG, JPG up to 10MB each</p>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
            </div>

            {previews.length > 0 && (
              <div className="flex gap-3 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-primary-container">
                    <img src={src} className="w-full h-full object-cover" alt="" />
                    {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-primary-container text-white text-[9px] font-bold text-center py-0.5">PRIMARY</span>}
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
              className="flex-1 py-4 bg-primary-container text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-container/20 hover:bg-primary transition-colors active:scale-95 disabled:opacity-60">
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Publish Product'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
