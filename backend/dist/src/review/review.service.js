"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./schemas/review.schema");
const wishlist_schema_1 = require("../wishlist/schemas/wishlist.schema");
const product_schema_1 = require("../product/schemas/product.schema");
let ReviewService = class ReviewService {
    reviewModel;
    wishlistModel;
    productModel;
    constructor(reviewModel, wishlistModel, productModel) {
        this.reviewModel = reviewModel;
        this.wishlistModel = wishlistModel;
        this.productModel = productModel;
    }
    async createReview(customerId, productId, rating, comment) {
        const purchased = await this.wishlistModel.findOne({
            customerId,
            productId,
            status: 'DONE',
        });
        if (!purchased) {
            throw new common_1.BadRequestException('You can only review products you have purchased');
        }
        const existing = await this.reviewModel.findOne({ customerId, productId });
        if (existing)
            throw new common_1.BadRequestException('Already reviewed this product');
        const product = await this.productModel.findById(productId);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const review = await this.reviewModel.create({
            customerId,
            productId,
            shopId: product.shopId,
            rating,
            comment,
        });
        const newTotal = product.totalRatings + 1;
        const newAvg = (product.averageRating * product.totalRatings + rating) / newTotal;
        await this.productModel.findByIdAndUpdate(productId, {
            averageRating: Math.round(newAvg * 10) / 10,
            totalRatings: newTotal,
        });
        return review;
    }
    async getProductReviews(productId) {
        return this.reviewModel.find({ productId }).sort({ createdAt: -1 });
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(1, (0, mongoose_1.InjectModel)(wishlist_schema_1.Wishlist.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReviewService);
//# sourceMappingURL=review.service.js.map