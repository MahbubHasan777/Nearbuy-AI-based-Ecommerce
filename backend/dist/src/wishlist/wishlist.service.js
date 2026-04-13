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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const wishlist_schema_1 = require("./schemas/wishlist.schema");
const product_schema_1 = require("../product/schemas/product.schema");
const prisma_service_1 = require("../prisma/prisma.service");
let WishlistService = class WishlistService {
    wishlistModel;
    productModel;
    prisma;
    constructor(wishlistModel, productModel, prisma) {
        this.wishlistModel = wishlistModel;
        this.productModel = productModel;
        this.prisma = prisma;
    }
    async getCustomerWishlist(customerId) {
        return this.wishlistModel.find({ customerId }).sort({ createdAt: -1 });
    }
    async addToWishlist(customerId, productId) {
        const product = await this.productModel.findById(productId);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const existing = await this.wishlistModel.findOne({ customerId, productId });
        if (existing)
            throw new common_1.BadRequestException('Already in wishlist');
        return this.wishlistModel.create({
            customerId,
            productId,
            shopId: product.shopId,
        });
    }
    async removeFromWishlist(customerId, wishlistId) {
        const item = await this.wishlistModel.findById(wishlistId);
        if (!item)
            throw new common_1.NotFoundException('Wishlist item not found');
        if (item.customerId !== customerId)
            throw new common_1.ForbiddenException();
        await item.deleteOne();
        return { message: 'Removed from wishlist' };
    }
    async getShopWishlistRequests(shopId) {
        return this.wishlistModel.find({ shopId }).sort({ createdAt: -1 });
    }
    async markAsDone(shopId, wishlistId) {
        const item = await this.wishlistModel.findById(wishlistId);
        if (!item)
            throw new common_1.NotFoundException('Wishlist item not found');
        if (item.shopId !== shopId)
            throw new common_1.ForbiddenException();
        if (item.status !== 'PENDING') {
            throw new common_1.BadRequestException('Item is not in PENDING state');
        }
        item.status = 'DONE';
        await item.save();
        const product = await this.productModel.findById(item.productId);
        if (product) {
            await this.productModel.findByIdAndUpdate(item.productId, {
                $inc: { totalSold: 1 },
            });
            await this.prisma.orderHistory.create({
                data: {
                    customerId: item.customerId,
                    productId: item.productId.toString(),
                    shopId: item.shopId,
                    productName: product.name,
                    price: product.discountPrice || product.price,
                },
            });
        }
        return { message: 'Marked as done' };
    }
    async reject(shopId, wishlistId) {
        const item = await this.wishlistModel.findById(wishlistId);
        if (!item)
            throw new common_1.NotFoundException('Wishlist item not found');
        if (item.shopId !== shopId)
            throw new common_1.ForbiddenException();
        item.status = 'REJECTED';
        await item.save();
        return { message: 'Wishlist request rejected' };
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(wishlist_schema_1.Wishlist.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map