import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private wishlistService;
    constructor(wishlistService: WishlistService);
    getCustomerWishlist(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/wishlist.schema").WishlistDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/wishlist.schema").Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    addToWishlist(req: any, productId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/wishlist.schema").WishlistDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/wishlist.schema").Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    removeFromWishlist(req: any, wishlistId: string): Promise<{
        message: string;
    }>;
    getShopRequests(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/wishlist.schema").WishlistDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/wishlist.schema").Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markDone(req: any, id: string): Promise<{
        message: string;
    }>;
    reject(req: any, id: string): Promise<{
        message: string;
    }>;
}
