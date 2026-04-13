import { Document } from 'mongoose';
export type WishlistDocument = Wishlist & Document;
export declare class Wishlist {
    customerId: string;
    productId: string;
    shopId: string;
    status: string;
}
export declare const WishlistSchema: import("mongoose").Schema<Wishlist, import("mongoose").Model<Wishlist, any, any, any, any, any, Wishlist>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Wishlist, Document<unknown, {}, Wishlist, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Wishlist & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    customerId?: import("mongoose").SchemaDefinitionProperty<string, Wishlist, Document<unknown, {}, Wishlist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Wishlist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    productId?: import("mongoose").SchemaDefinitionProperty<string, Wishlist, Document<unknown, {}, Wishlist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Wishlist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    shopId?: import("mongoose").SchemaDefinitionProperty<string, Wishlist, Document<unknown, {}, Wishlist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Wishlist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Wishlist, Document<unknown, {}, Wishlist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Wishlist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Wishlist>;
