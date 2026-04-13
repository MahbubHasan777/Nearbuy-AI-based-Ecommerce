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
exports.ManageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const prisma_service_1 = require("../prisma/prisma.service");
const product_schema_1 = require("../product/schemas/product.schema");
const wishlist_schema_1 = require("../wishlist/schemas/wishlist.schema");
const upload_service_1 = require("../upload/upload.service");
let ManageService = class ManageService {
    prisma;
    productModel;
    wishlistModel;
    upload;
    constructor(prisma, productModel, wishlistModel, upload) {
        this.prisma = prisma;
        this.productModel = productModel;
        this.wishlistModel = wishlistModel;
        this.upload = upload;
    }
    async listShops(query) {
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.isActive !== undefined)
            where.isActive = query.isActive === 'true';
        return this.prisma.shop.findMany({
            where,
            select: {
                id: true, ownerName: true, ownerEmail: true, shopName: true,
                shopAddress: true, phone: true, lat: true, lng: true,
                status: true, isActive: true, profilePic: true, createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getShop(id) {
        const shop = await this.prisma.shop.findUnique({
            where: { id },
            select: {
                id: true, ownerName: true, ownerEmail: true, shopName: true,
                shopAddress: true, phone: true, lat: true, lng: true,
                status: true, isActive: true, profilePic: true, bannerMsg: true, createdAt: true,
            },
        });
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        return shop;
    }
    async updateShop(id, data) {
        return this.prisma.shop.update({ where: { id }, data });
    }
    async deleteShop(id) {
        await this.prisma.shop.delete({ where: { id } });
        return { message: 'Shop deleted' };
    }
    async approveShop(id) {
        return this.prisma.shop.update({ where: { id }, data: { status: 'APPROVED' } });
    }
    async rejectShop(id) {
        return this.prisma.shop.update({ where: { id }, data: { status: 'REJECTED' } });
    }
    async toggleShopActive(id) {
        const shop = await this.prisma.shop.findUnique({ where: { id } });
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        return this.prisma.shop.update({
            where: { id },
            data: { isActive: !shop.isActive },
            select: { id: true, isActive: true },
        });
    }
    async getShopProducts(shopId) {
        return this.productModel.find({ shopId }).sort({ createdAt: -1 });
    }
    async createProductForShop(shopId, data, files) {
        const imagePaths = [];
        for (const file of files || []) {
            const path = await this.upload.compressAndSave(file, 'products');
            imagePaths.push(path);
        }
        return this.productModel.create({ shopId, ...data, images: imagePaths });
    }
    async updateProductForShop(shopId, pid, data) {
        return this.productModel.findOneAndUpdate({ _id: pid, shopId }, data, { new: true });
    }
    async deleteProductForShop(shopId, pid) {
        const product = await this.productModel.findOne({ _id: pid, shopId });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        for (const img of product.images)
            this.upload.deleteFile(img);
        await product.deleteOne();
        return { message: 'Product deleted' };
    }
    async listCustomers(query) {
        const where = {};
        if (query.isActive !== undefined)
            where.isActive = query.isActive === 'true';
        return this.prisma.customer.findMany({
            where,
            select: {
                id: true, username: true, email: true, fullName: true,
                phone: true, isActive: true, createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async toggleCustomerActive(id) {
        const customer = await this.prisma.customer.findUnique({ where: { id } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return this.prisma.customer.update({
            where: { id },
            data: { isActive: !customer.isActive },
            select: { id: true, isActive: true },
        });
    }
    async getWishlistByContact(query) {
        const customer = await this.prisma.customer.findFirst({
            where: {
                OR: [
                    ...(query.email ? [{ email: query.email }] : []),
                    ...(query.phone ? [{ phone: query.phone }] : []),
                ],
            },
        });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return this.wishlistModel.find({ customerId: customer.id }).sort({ createdAt: -1 });
    }
    async deleteWishlistItem(id) {
        await this.wishlistModel.findByIdAndDelete(id);
        return { message: 'Wishlist item deleted' };
    }
};
exports.ManageService = ManageService;
exports.ManageService = ManageService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(wishlist_schema_1.Wishlist.name)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mongoose_2.Model,
        mongoose_2.Model,
        upload_service_1.UploadService])
], ManageService);
//# sourceMappingURL=manage.service.js.map