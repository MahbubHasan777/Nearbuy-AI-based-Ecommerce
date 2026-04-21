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

    let queryProductIds: string[] = [];
    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query, n_results: 50 }),
      });
      const data = await response.json();
      if (data.results) {
        queryProductIds = data.results.map((r: any) => r.product_id);
      }
    } catch (err) {
      console.error('ChromaDB search failed:', err);
      queryProductIds = [];
    }

    const products = await this.productModel.find({
      _id: { $in: queryProductIds },
      shopId: { $in: nearbyShopIds },
    });

    const scored = products.map((p) => {
      if (params['minPrice'] && p.price < Number(params['minPrice'])) return null;
      if (params['maxPrice'] && p.price > Number(params['maxPrice'])) return null;
      if (params['minRating'] && p.averageRating < Number(params['minRating'])) return null;
      if (params['maxRating'] && p.averageRating > Number(params['maxRating'])) return null;

      // Preserve the order returned by ChromaDB (which returns sorted by distance)
      const index = queryProductIds.indexOf(p._id.toString());
      return { product: p, score: queryProductIds.length - index }; 
    });

    const filtered = scored.filter(Boolean) as { product: any; score: number }[];
    filtered.sort((a, b) => b.score - a.score);

    const sorted = this.applySort(filtered.map((f) => f.product), params['sort']);
    const shopMap = new Map<string, any>(allShops.map((s) => [s.id, s]));

    return {
      query,
      radius_km: radius / 1000,
      total: sorted.length,
      results: sorted.map((p) => {
        const shop = shopMap.get(p.shopId);
        const dist =
          customer?.lat && customer?.lng && shop
            ? this.geo.haversine(customer.lat, customer.lng, shop.lat, shop.lng)
            : null;
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
          shop: shop
            ? {
                shopId: shop.id,
                shopName: shop.shopName,
                distance_km: dist ? Math.round((dist / 1000) * 10) / 10 : null,
              }
            : null,
        };
      }),
    };
  }

  async searchInShop(shopId: string, query: string, params: Record<string, string>) {
    let queryProductIds: string[] = [];
    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query, n_results: 50 }),
      });
      const data = await response.json();
      if (data.results) {
        queryProductIds = data.results.map((r: any) => r.product_id);
      }
    } catch (err) {
      console.error('ChromaDB shop search failed:', err);
    }

    const products = await this.productModel.find({
      _id: { $in: queryProductIds },
      shopId,
    });

    const scored = products
      .map((p) => {
        const index = queryProductIds.indexOf(p._id.toString());
        return { product: p, score: queryProductIds.length - index };
      })
      .filter(Boolean) as { product: any; score: number }[];

    scored.sort((a, b) => b.score - a.score);
    return { query, total: scored.length, results: scored.map((s) => s.product) };
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


}
