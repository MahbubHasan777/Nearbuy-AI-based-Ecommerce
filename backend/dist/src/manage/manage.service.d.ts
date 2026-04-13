import { Model } from 'mongoose';
import { PrismaService } from '../prisma/prisma.service';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { Wishlist, WishlistDocument } from '../wishlist/schemas/wishlist.schema';
import { UploadService } from '../upload/upload.service';
export declare class ManageService {
    private prisma;
    private productModel;
    private wishlistModel;
    private upload;
    constructor(prisma: PrismaService, productModel: Model<ProductDocument>, wishlistModel: Model<WishlistDocument>, upload: UploadService);
    listShops(query: any): Promise<{
        id: string;
        createdAt: Date;
        ownerEmail: string;
        shopName: string;
        ownerName: string;
        shopAddress: string;
        phone: string;
        lat: number;
        lng: number;
        status: import("@prisma/client").$Enums.ShopStatus;
        isActive: boolean;
        profilePic: string | null;
    }[]>;
    getShop(id: string): Promise<{
        id: string;
        createdAt: Date;
        ownerEmail: string;
        shopName: string;
        ownerName: string;
        shopAddress: string;
        phone: string;
        lat: number;
        lng: number;
        status: import("@prisma/client").$Enums.ShopStatus;
        isActive: boolean;
        profilePic: string | null;
        bannerMsg: string | null;
    }>;
    updateShop(id: string, data: any): Promise<{
        id: string;
        passwordHash: string;
        createdAt: Date;
        ownerEmail: string;
        shopName: string;
        ownerName: string;
        shopAddress: string;
        phone: string;
        lat: number;
        lng: number;
        status: import("@prisma/client").$Enums.ShopStatus;
        isActive: boolean;
        profilePic: string | null;
        bannerMsg: string | null;
        updatedAt: Date;
    }>;
    deleteShop(id: string): Promise<{
        message: string;
    }>;
    approveShop(id: string): Promise<{
        id: string;
        passwordHash: string;
        createdAt: Date;
        ownerEmail: string;
        shopName: string;
        ownerName: string;
        shopAddress: string;
        phone: string;
        lat: number;
        lng: number;
        status: import("@prisma/client").$Enums.ShopStatus;
        isActive: boolean;
        profilePic: string | null;
        bannerMsg: string | null;
        updatedAt: Date;
    }>;
    rejectShop(id: string): Promise<{
        id: string;
        passwordHash: string;
        createdAt: Date;
        ownerEmail: string;
        shopName: string;
        ownerName: string;
        shopAddress: string;
        phone: string;
        lat: number;
        lng: number;
        status: import("@prisma/client").$Enums.ShopStatus;
        isActive: boolean;
        profilePic: string | null;
        bannerMsg: string | null;
        updatedAt: Date;
    }>;
    toggleShopActive(id: string): Promise<{
        id: string;
        isActive: boolean;
    }>;
    getShopProducts(shopId: string): Promise<(import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    createProductForShop(shopId: string, data: any, files: Express.Multer.File[]): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateProductForShop(shopId: string, pid: string, data: any): Promise<(import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteProductForShop(shopId: string, pid: string): Promise<{
        message: string;
    }>;
    listCustomers(query: any): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        phone: string;
        isActive: boolean;
        username: string;
        fullName: string;
    }[]>;
    toggleCustomerActive(id: string): Promise<{
        id: string;
        isActive: boolean;
    }>;
    getWishlistByContact(query: any): Promise<(import("mongoose").Document<unknown, {}, WishlistDocument, {}, import("mongoose").DefaultSchemaOptions> & Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    deleteWishlistItem(id: string): Promise<{
        message: string;
    }>;
}
