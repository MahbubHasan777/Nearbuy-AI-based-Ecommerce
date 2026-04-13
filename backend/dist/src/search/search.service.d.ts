import { Model } from 'mongoose';
import { ProductDocument } from '../product/schemas/product.schema';
import { PrismaService } from '../prisma/prisma.service';
import { GeoService } from '../geo/geo.service';
export declare class SearchService {
    private productModel;
    private prisma;
    private geo;
    constructor(productModel: Model<ProductDocument>, prisma: PrismaService, geo: GeoService);
    search(query: string, customerId: string, params: Record<string, string>): Promise<{
        query: string;
        radius_km: number;
        total: number;
        results: {
            productId: any;
            productName: any;
            price: any;
            discountPrice: any;
            discountPercentage: any;
            status: any;
            images: any;
            averageRating: any;
            totalRatings: any;
            shop: {
                shopId: any;
                shopName: any;
                distance_km: number | null;
            } | null;
        }[];
    }>;
    searchInShop(shopId: string, query: string, params: Record<string, string>): Promise<{
        query: string;
        total: number;
        results: any[];
    }>;
    private applySort;
    private levenshtein;
    private similarity;
    private maxSimilarity;
}
