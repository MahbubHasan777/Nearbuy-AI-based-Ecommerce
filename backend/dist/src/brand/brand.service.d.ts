import { Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
export declare class BrandService {
    private brandModel;
    constructor(brandModel: Model<BrandDocument>);
    findAll(shopId: string): Promise<(import("mongoose").Document<unknown, {}, BrandDocument, {}, import("mongoose").DefaultSchemaOptions> & Brand & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(shopId: string, name: string): Promise<import("mongoose").Document<unknown, {}, BrandDocument, {}, import("mongoose").DefaultSchemaOptions> & Brand & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(shopId: string, id: string, name: string): Promise<import("mongoose").Document<unknown, {}, BrandDocument, {}, import("mongoose").DefaultSchemaOptions> & Brand & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(shopId: string, id: string, productModel: Model<any>): Promise<{
        message: string;
    }>;
}
