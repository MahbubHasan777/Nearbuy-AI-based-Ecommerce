import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { PrismaService } from '../prisma/prisma.service';
import { GeoService } from '../geo/geo.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private prisma: PrismaService,
    private geo: GeoService,
  ) {}

  async search(query: string, customerId: string, params: Record<string, string>) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    const radius = params['radius'] ? Number(params['radius']) : (customer?.radiusMeters ?? 5000);

    const allShops: any[] = await this.prisma.shop.findMany({
      where: { status: 'APPROVED', isActive: true },
    });

    const nearbyShopIds: string[] =
      customer?.lat && customer?.lng
        ? this.geo
            .filterByRadius(allShops, customer.lat, customer.lng, radius)
            .map((s) => (s as any).id as string)
        : allShops.map((s) => s.id as string);

    let queryProductIds: string[] | null = null;
    if (query.trim()) {
      try {
        const response = await fetch('http://localhost:8000/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query, n_results: 50 }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.results) {
            queryProductIds = data.results.map((r: any) => r.product_id);
          }
        } else {
          throw new Error('ChromaDB returned ' + response.status);
        }
      } catch (err) {
        console.error('ChromaDB search failed, falling back to fuzzy match:', err.message);
      }
    }

    const filter: any = { shopId: { $in: nearbyShopIds } };
    const products = await this.productModel.find(filter);

    const q = query.toLowerCase().trim();
    const scored = products.map((p) => {
      let matchType = '';
      
      if (q) {
        const name = p.name.toLowerCase();
        const keywords = ((p.imageKeywords as string[]) || []).map((k) => k.toLowerCase());

        if (name === q) {
          matchType = 'exact';
        } else {
          const qTokens = q.split(' ');
          const nameTokens = name.split(' ');

          const prefixMatches = qTokens.filter((qt) =>
            nameTokens.some((nt) => nt.startsWith(qt)),
          ).length;

          const fuzzyScore = this.maxSimilarity(q, name);

          if (fuzzyScore >= 0.6 || prefixMatches > 0) {
            matchType = 'fuzzy';
          } else if (queryProductIds !== null && queryProductIds.includes(p._id.toString())) {
            matchType = 'similar';
          } else {
            const kwMatches = qTokens.filter((qt) =>
              keywords.some((kw) => kw.includes(qt)),
            ).length;
            if (kwMatches > 0) matchType = 'keyword';
          }
        }
      } else {
        matchType = 'exact';
      }

      if (!matchType) return null;

      if (params['minPrice'] && p.price < Number(params['minPrice'])) return null;
      if (params['maxPrice'] && p.price > Number(params['maxPrice'])) return null;
      if (params['minRating'] && p.averageRating < Number(params['minRating'])) return null;
      if (params['maxRating'] && p.averageRating > Number(params['maxRating'])) return null;

      return { product: p, matchType }; 
    });

    const filtered = scored.filter(Boolean) as { product: any; matchType: string }[];
    
    // Sort logic is now applied per category or flattened. We will group them!
    const exactMatches = this.applySort(filtered.filter(f => f.matchType === 'exact').map(f => f.product), params['sort']);
    const fuzzyMatches = this.applySort(filtered.filter(f => f.matchType === 'fuzzy').map(f => f.product), params['sort']);
    const similarMatches = this.applySort(filtered.filter(f => f.matchType === 'similar').map(f => f.product), params['sort']);
    const keywordMatches = this.applySort(filtered.filter(f => f.matchType === 'keyword').map(f => f.product), params['sort']);

    const shopMap = new Map<string, any>(allShops.map((s) => [s.id, s]));

    const formatProduct = (p: any) => {
      const shop = shopMap.get(p.shopId);
      const dist = customer?.lat && customer?.lng && shop ? this.geo.haversine(customer.lat, customer.lng, shop.lat, shop.lng) : null;
      return {
        productId: p._id,
        productName: p.name,
        price: p.price,
        discountPrice: p.discountPrice,
        discountPercentage: p.discountPercentage,
        status: p.status,
        images: p.images,
        averageRating: p.averageRating,
        totalRatings: p.totalRatings,
        shop: shop ? {
          shopId: shop.id,
          shopName: shop.shopName,
          distance_km: dist ? Math.round((dist / 1000) * 10) / 10 : null,
        } : null,
      };
    };

    return {
      query,
      radius_km: radius / 1000,
      total: exactMatches.length + fuzzyMatches.length + similarMatches.length + keywordMatches.length,
      exact: exactMatches.map(formatProduct),
      fuzzy: fuzzyMatches.map(formatProduct),
      similar: similarMatches.map(formatProduct),
      keyword: keywordMatches.map(formatProduct),
    };
  }

  async searchInShop(shopId: string, query: string, params: Record<string, string>) {
    let queryProductIds: string[] | null = null;
    const q = query.toLowerCase().trim();
    if (q) {
      try {
        const response = await fetch('http://localhost:8000/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query, n_results: 50 }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.results) {
            queryProductIds = data.results.map((r: any) => r.product_id);
          }
        } else {
          throw new Error('ChromaDB returned ' + response.status);
        }
      } catch (err) {
        console.error('ChromaDB shop search failed:', err.message);
      }
    }

    const filter: any = { shopId };
    const products = await this.productModel.find(filter);

    const q = query.toLowerCase().trim();
    const scored = products.map((p) => {
      let matchType = '';
      
      if (q) {
        const name = p.name.toLowerCase();
        const keywords = ((p.imageKeywords as string[]) || []).map((k) => k.toLowerCase());

        if (name === q) {
          matchType = 'exact';
        } else {
          const qTokens = q.split(' ');
          const nameTokens = name.split(' ');

          const prefixMatches = qTokens.filter((qt) =>
            nameTokens.some((nt) => nt.startsWith(qt)),
          ).length;

          const fuzzyScore = this.maxSimilarity(q, name);

          if (fuzzyScore >= 0.6 || prefixMatches > 0) {
            matchType = 'fuzzy';
          } else if (queryProductIds !== null && queryProductIds.includes(p._id.toString())) {
            matchType = 'similar';
          } else {
            const kwMatches = qTokens.filter((qt) =>
              keywords.some((kw) => kw.includes(qt)),
            ).length;
            if (kwMatches > 0) matchType = 'keyword';
          }
        }
      } else {
        matchType = 'exact';
      }

      if (!matchType) return null;
      return { product: p, matchType };
    });

    const filtered = scored.filter(Boolean) as { product: any; matchType: string }[];
    
    const exactMatches = this.applySort(filtered.filter(f => f.matchType === 'exact').map(f => f.product), params['sort'] || '');
    const fuzzyMatches = this.applySort(filtered.filter(f => f.matchType === 'fuzzy').map(f => f.product), params['sort'] || '');
    const similarMatches = this.applySort(filtered.filter(f => f.matchType === 'similar').map(f => f.product), params['sort'] || '');
    const keywordMatches = this.applySort(filtered.filter(f => f.matchType === 'keyword').map(f => f.product), params['sort'] || '');

    return { 
      query, 
      total: exactMatches.length + fuzzyMatches.length + similarMatches.length + keywordMatches.length, 
      exact: exactMatches,
      fuzzy: fuzzyMatches,
      similar: similarMatches,
      keyword: keywordMatches
    };
  }

  private applySort(products: any[], sort: string) {
    if (!sort) return products;
    const map: Record<string, (a: any, b: any) => number> = {
      name_asc: (a, b) => a.name.localeCompare(b.name),
      name_desc: (a, b) => b.name.localeCompare(a.name),
      price_asc: (a, b) => a.price - b.price,
      price_desc: (a, b) => b.price - a.price,
      rating_desc: (a, b) => b.averageRating - a.averageRating,
      sold_desc: (a, b) => b.totalSold - a.totalSold,
      date_desc: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    };
    return [...products].sort(map[sort] || (() => 0));
  }

  private levenshtein(a: string, b: string): number {
    const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
      Array.from({ length: b.length + 1 }, (_, j) =>
        i === 0 ? j : j === 0 ? i : 0,
      ),
    );
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[a.length][b.length];
  }

  private similarity(a: string, b: string): number {
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    return 1 - this.levenshtein(a, b) / maxLen;
  }

  private maxSimilarity(query: string, name: string): number {
    const qTokens = query.split(' ');
    const nTokens = name.split(' ');
    let max = 0;
    for (const qt of qTokens) {
      for (const nt of nTokens) {
        const s = this.similarity(qt, nt);
        if (s > max) max = s;
      }
    }
    return max;
  }
}
