import { ManageService } from './manage.service';
export declare class ManageController {
    private manageService;
    constructor(manageService: ManageService);
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
    updateShop(id: string, body: any): Promise<{
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
    toggleShop(id: string): Promise<{
        id: string;
        isActive: boolean;
    }>;
    getShopProducts(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../product/schemas/product.schema").ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../product/schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    createProductForShop(id: string, body: any, files: Express.Multer.File[]): Promise<import("mongoose").Document<unknown, {}, import("../product/schemas/product.schema").ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../product/schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateProduct(id: string, pid: string, body: any): Promise<(import("mongoose").Document<unknown, {}, import("../product/schemas/product.schema").ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../product/schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteProduct(id: string, pid: string): Promise<{
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
    toggleCustomer(id: string): Promise<{
        id: string;
        isActive: boolean;
    }>;
    getWishlist(query: any): Promise<(import("mongoose").Document<unknown, {}, import("../wishlist/schemas/wishlist.schema").WishlistDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../wishlist/schemas/wishlist.schema").Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    deleteWishlist(id: string): Promise<{
        message: string;
    }>;
}
