import { SearchService } from './search.service';
export declare class SearchController {
    private searchService;
    constructor(searchService: SearchService);
    search(q: string, params: any, req: any): Promise<{
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
    searchInShop(shopId: string, q: string, params: any): Promise<{
        query: string;
        total: number;
        results: any[];
    }>;
}
