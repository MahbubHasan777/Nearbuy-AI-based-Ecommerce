'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import api from '@/lib/api';
import Link from 'next/link';

interface SearchResult {
  productId: string;
  productName: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  images: string[];
  averageRating: number;
  totalRatings: number;
  status: string;
  shop?: { shopId: string; shopName: string; distance_km?: number };
}

interface SearchResponse {
  query: string;
  radius_km: number;
  total: number;
  exact: SearchResult[];
  fuzzy: SearchResult[];
  similar: SearchResult[];
  keyword: SearchResult[];
}

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get('q') || '';
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [radius, setRadius] = useState(15);

  const doSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get('/search', {
        params: { q: query, sort: sort || undefined, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined, radius: radius * 1000 },
      });
      setData(res.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (q) doSearch(q); }, [q, sort]);

  const handleSearch = (newQ: string) => {
    router.push(`/search?q=${encodeURIComponent(newQ)}`);
  };

  const renderProductCard = (item: SearchResult) => (
    <Link key={item.productId} href={`/products/${item.productId}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group border border-slate-100 flex flex-col h-full cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-surface-container">
          {item.images[0] ? (
            <img
              src={`http://localhost:3001/uploads/${item.images[0]}`}
              alt={item.productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-outline">image</span>
            </div>
          )}

          <button 
            onClick={e => {
              e.preventDefault();
              api.post(`/customer/wishlist/${item.productId}`)
                 .then(() => alert('Added to Wishlist!'))
                 .catch(() => alert('Failed to add. Please log in first.'));
            }}
            className="absolute top-3 right-3 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-outline hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </button>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-[17px] text-on-surface line-clamp-1">{item.productName}</h3>
            <div className="text-right flex flex-col items-end">
              <span className="text-primary font-semibold text-[17px]">
                ৳{item.discountPrice ?? item.price}
              </span>
              {item.averageRating > 0 && (
                <div className="flex items-center gap-0.5 text-amber-500 mt-1">
                  <span className="material-symbols-outlined text-[14px] fill-icon">star</span>
                  <span className="text-xs text-on-surface-variant font-bold">{item.averageRating.toFixed(1)}</span>
                  <span className="text-[10px] text-outline ml-0.5">({item.totalRatings})</span>
                </div>
              )}
            </div>
          </div>
          {item.shop && (
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-outline text-[18px]">store</span>
              <span className="text-xs text-outline font-medium">{item.shop.shopName}</span>
            </div>
          )}
          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
              <span className="text-xs">{item.shop?.distance_km ?? '?'} km away</span>
            </div>
            <button
              onClick={e => { e.preventDefault(); }}
              className="bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all"
            >
              Add to List
            </button>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar variant="customer" onSearch={handleSearch} searchValue={q} />

      <main className="pt-4 pb-24 md:pb-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-8">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-on-surface">Filters</h3>
              <button className="text-primary text-xs font-medium hover:underline" onClick={() => { setMinPrice(''); setMaxPrice(''); setRadius(15); }}>Clear all</button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-4">Distance Radius</label>
              <input type="range" min="1" max="50" value={radius} onChange={e => setRadius(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" />
              <div className="flex justify-between mt-2 text-xs text-outline">
                <span>1 km</span><span>{radius} km</span><span>50 km</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-3">Price Range</label>
              <div className="flex items-center gap-2">
                <input className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Min" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                <span className="text-outline">—</span>
                <input className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Max" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
              </div>
            </div>

            <button onClick={() => doSearch(q)} className="w-full bg-primary-container text-white py-3 rounded-xl font-bold text-sm hover:bg-primary transition-colors">
              Apply Filters
            </button>
          </div>
        </aside>

        <section className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-on-surface">
                {q ? `Results for "${q}"` : 'Browse Products'}
              </h2>
              <p className="text-outline text-sm mt-1">
                {data ? `Showing ${data.total} products within ${data.radius_km} km` : 'Search for products near you'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="bg-white border border-outline-variant rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Top Rated</option>
                <option value="date_desc">Newest</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl block mb-3 animate-spin">progress_activity</span>
              <p>Searching nearby shops...</p>
            </div>
          )}

          {!loading && data && data.total === 0 && (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl block mb-3">search_off</span>
              <p className="font-semibold text-lg">No results found</p>
              <p className="text-sm mt-1">Try different keywords or increase the radius</p>
            </div>
          )}

          {!loading && data && data.total > 0 && (
            <div className="space-y-12">
              {data.exact && data.exact.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface">Exact Matches</h3>
                      <p className="text-xs text-outline">Products matching your search exactly</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.exact.map(item => renderProductCard(item))}
                  </div>
                </div>
              )}

              {data.fuzzy && data.fuzzy.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-amber-500 text-3xl">spellcheck</span>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface">Did you mean?</h3>
                      <p className="text-xs text-outline">Products with similar names or typo corrections</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.fuzzy.map(item => renderProductCard(item))}
                  </div>
                </div>
              )}

              {data.similar && data.similar.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-purple-500 text-3xl">auto_awesome</span>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface">Similar Products</h3>
                      <p className="text-xs text-outline">AI suggested products based on meaning</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.similar.map(item => renderProductCard(item))}
                  </div>
                </div>
              )}

              {data.keyword && data.keyword.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-blue-500 text-3xl">sell</span>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface">Related by Keywords</h3>
                      <p className="text-xs text-outline">Products containing matching tags</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.keyword.map(item => renderProductCard(item))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <BottomNavBar variant="customer" />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
