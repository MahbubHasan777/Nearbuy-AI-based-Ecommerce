'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import api from '@/lib/api';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  description?: string;
  images: string[];
  averageRating: number;
  totalRatings: number;
  imageKeywords: string[];
  status: string;
  category?: { categoryName: string };
  brand?: { brandName: string };
  shop?: { id: string; shopName: string; shopAddress: string; lat: number; lng: number };
}

interface Review {
  _id: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [mainImg, setMainImg] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistDone, setWishlistDone] = useState(false);
  
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    api.get(`/shop/public/product/${id}`).then(r => {
      setProduct(r.data);
    }).catch(() => router.push('/search'));
    api.get(`/products/${id}/reviews`).then(r => setReviews(r.data)).catch(() => {});
  }, [id]);

  const addToWishlist = async () => {
    setWishlistLoading(true);
    try {
      await api.post(`/customer/wishlist/${id}`);
      setWishlistDone(true);
    } catch {}
    setWishlistLoading(false);
  };

  const submitReview = async () => {
    if (!reviewComment.trim()) return;
    setReviewLoading(true);
    setReviewError('');
    try {
      await api.post(`/customer/review/${id}`, { rating: reviewRating, comment: reviewComment });
      setReviewComment('');
      setReviewRating(5);
      const r = await api.get(`/products/${id}/reviews`);
      setReviews(r.data);
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
    setReviewLoading(false);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const BASE = 'http://localhost:3001/uploads/';

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <TopNavBar variant="customer" />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[500px]">
              <div className="col-span-4 md:col-span-3 md:row-span-2 rounded-2xl overflow-hidden shadow-card bg-white relative">
                {product.images[mainImg] ? (
                  <img src={`${BASE}${product.images[mainImg]}`} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-container">
                    <span className="material-symbols-outlined text-6xl text-outline">image</span>
                  </div>
                )}
                <button onClick={addToWishlist} className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur shadow-md rounded-full transition-colors hover:bg-error-container">
                  <span className={`material-symbols-outlined ${wishlistDone ? 'text-error fill-icon' : 'text-outline'}`}>favorite</span>
                </button>
              </div>
              {product.images.slice(1, 3).map((img, i) => (
                <div key={i} onClick={() => setMainImg(i + 1)} className="hidden md:block col-span-1 row-span-1 rounded-xl overflow-hidden shadow-sm bg-white cursor-pointer hover:opacity-90 transition-opacity">
                  <img src={`${BASE}${img}`} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
            {product.images.length > 1 && (
              <div className="flex md:hidden gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setMainImg(i)} className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${mainImg === i ? 'border-primary-container' : 'border-slate-200'}`}>
                    <img src={`${BASE}${img}`} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div>
              <nav className="flex text-xs text-outline mb-2 gap-2 items-center">
                {product.category && <><span>{product.category.categoryName}</span><span className="material-symbols-outlined text-xs">chevron_right</span></>}
                {product.brand && <span className="text-on-surface">{product.brand.brandName}</span>}
              </nav>
              <h1 className="text-3xl font-bold text-on-surface leading-tight mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-secondary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`material-symbols-outlined text-lg ${i < Math.round(product.averageRating) ? 'fill-icon' : ''}`}>star</span>
                  ))}
                  <span className="text-sm font-semibold ml-1">{product.averageRating.toFixed(1)}</span>
                  <span className="text-outline text-xs ml-1">({product.totalRatings})</span>
                </div>
                <span className="text-on-surface-variant text-xs bg-surface-container px-2 py-1 rounded font-semibold">{product.status}</span>
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-primary">${(product.discountPrice ?? product.price).toFixed(2)}</span>
                {product.discountPrice && <span className="text-outline line-through">${product.price.toFixed(2)}</span>}
                {product.discountPercentage && (
                  <span className="bg-tertiary-container text-on-tertiary text-xs px-2 py-0.5 rounded-full font-bold">{product.discountPercentage}% OFF</span>
                )}
              </div>
            </div>

            {product.imageKeywords && product.imageKeywords.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  Smart Highlights
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.imageKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-50 text-primary border border-blue-100 rounded-full text-xs font-semibold">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={addToWishlist}
                disabled={wishlistLoading || wishlistDone}
                className="flex-1 bg-secondary-container text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg font-bold active:scale-95 transition-all disabled:opacity-60"
              >
                <span className="material-symbols-outlined">{wishlistDone ? 'task_alt' : 'favorite'}</span>
                {wishlistDone ? 'Added to Wishlist' : wishlistLoading ? 'Adding...' : 'Add to Wishlist'}
              </button>
              <button className="px-4 border-2 border-primary text-primary rounded-xl active:scale-95 transition-all flex items-center justify-center">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>

            {product.shop && (
              <div className="p-4 bg-white/60 backdrop-blur-sm border border-white rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-white">
                    <span className="material-symbols-outlined fill-icon">storefront</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-on-surface">{product.shop.shopName}</h3>
                    <p className="text-xs text-outline flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>{product.shop.shopAddress}
                    </p>
                  </div>
                  <Link href={`/shops/${product.shop.id}`} className="px-3 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90">
                    View Shop
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex border-b border-slate-200">
            <button onClick={() => setActiveTab('desc')} className={`px-8 py-4 font-semibold text-sm ${activeTab === 'desc' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-on-surface'}`}>
              Description
            </button>
            <button onClick={() => setActiveTab('reviews')} className={`px-8 py-4 font-semibold text-sm ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-on-surface'}`}>
              Reviews ({product.totalRatings})
            </button>
          </div>

          {activeTab === 'desc' && (
            <div className="py-8">
              <p className="text-on-surface-variant leading-relaxed text-base">{product.description || 'No description available.'}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="py-8">
              <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-on-surface mb-4">Write a Review</h3>
                {reviewError && <p className="text-error text-sm mb-3 bg-error-container/20 p-3 rounded-xl">{reviewError}</p>}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setReviewRating(star)} className="text-secondary hover:scale-110 transition-transform">
                        <span className={`material-symbols-outlined text-2xl ${star <= reviewRating ? 'fill-icon' : ''}`}>star</span>
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full h-24 p-4 border border-outline-variant rounded-xl resize-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm mb-4"
                />
                <button
                  onClick={submitReview}
                  disabled={reviewLoading || !reviewComment.trim()}
                  className="px-6 py-3 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-2">rate_review</span>
                    <p>No reviews yet</p>
                  </div>
                )}
                {reviews.map(r => (
                  <div key={r._id} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden flex flex-shrink-0 items-center justify-center">
                        {r.customer?.profilePic ? (
                          <img src={`http://localhost:3001/uploads/${r.customer.profilePic}`} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="material-symbols-outlined text-outline">person</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{r.customer?.fullName || 'Customer'}</p>
                        <p className="text-xs text-outline">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="ml-auto flex text-secondary">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`material-symbols-outlined text-sm ${i < r.rating ? 'fill-icon' : ''}`}>star</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-sm">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNavBar variant="customer" />
    </div>
  );
}
