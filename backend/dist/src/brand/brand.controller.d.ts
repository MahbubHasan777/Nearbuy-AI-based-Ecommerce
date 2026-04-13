import { Model } from 'mongoose';
import { BrandService } from './brand.service';
export declare class BrandController {
    private brandService;
    private productModel;
    constructor(brandService: BrandService, productModel: Model<any>);
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/brand.schema").BrandDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/brand.schema").Brand & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(req: any, name: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/brand.schema").BrandDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/brand.schema").Brand & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(req: any, id: string, name: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/brand.schema").BrandDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/brand.schema").Brand & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
