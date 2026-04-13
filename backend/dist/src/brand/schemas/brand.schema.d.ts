import { Document } from 'mongoose';
export type BrandDocument = Brand & Document;
export declare class Brand {
    shopId: string;
    name: string;
}
export declare const BrandSchema: import("mongoose").Schema<Brand, import("mongoose").Model<Brand, any, any, any, any, any, Brand>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Brand, Document<unknown, {}, Brand, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Brand & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    shopId?: import("mongoose").SchemaDefinitionProperty<string, Brand, Document<unknown, {}, Brand, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Brand & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Brand, Document<unknown, {}, Brand, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Brand & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Brand>;
