import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { ProductDocument } from '../product/schemas/product.schema';
import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private wishlistModel;
    private productModel;
    private prisma;
    constructor(wishlistModel: Model<WishlistDocument>, productModel: Model<ProductDocument>, prisma: PrismaService);
    getCustomerWishlist(customerId: string): Promise<(import("mongoose").Document<unknown, {}, WishlistDocument, {}, import("mongoose").DefaultSchemaOptions> & Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    addToWishlist(customerId: string, productId: string): Promise<import("mongoose").Document<unknown, {}, WishlistDocument, {}, import("mongoose").DefaultSchemaOptions> & Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    removeFromWishlist(customerId: string, wishlistId: string): Promise<{
        message: string;
    }>;
    getShopWishlistRequests(shopId: string): Promise<(import("mongoose").Document<unknown, {}, WishlistDocument, {}, import("mongoose").DefaultSchemaOptions> & Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markAsDone(shopId: string, wishlistId: string): Promise<{
        message: string;
    }>;
    reject(shopId: string, wishlistId: string): Promise<{
        message: string;
    }>;
}
