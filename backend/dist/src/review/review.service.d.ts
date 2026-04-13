import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { WishlistDocument } from '../wishlist/schemas/wishlist.schema';
import { ProductDocument } from '../product/schemas/product.schema';
export declare class ReviewService {
    private reviewModel;
    private wishlistModel;
    private productModel;
    constructor(reviewModel: Model<ReviewDocument>, wishlistModel: Model<WishlistDocument>, productModel: Model<ProductDocument>);
    createReview(customerId: string, productId: string, rating: number, comment: string): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, import("mongoose").DefaultSchemaOptions> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getProductReviews(productId: string): Promise<(import("mongoose").Document<unknown, {}, ReviewDocument, {}, import("mongoose").DefaultSchemaOptions> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
