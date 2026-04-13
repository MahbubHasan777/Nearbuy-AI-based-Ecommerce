import { CategoryService } from './category.service';
export declare class CategoryController {
    private categoryService;
    constructor(categoryService: CategoryService);
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/category.schema").CategoryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/category.schema").Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(req: any, name: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/category.schema").CategoryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/category.schema").Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(req: any, id: string, name: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/category.schema").CategoryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/category.schema").Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
