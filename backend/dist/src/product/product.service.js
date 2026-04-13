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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const upload_service_1 = require("../upload/upload.service");
let ProductService = class ProductService {
    productModel;
    productQueue;
    upload;
    constructor(productModel, productQueue, upload) {
        this.productModel = productModel;
        this.productQueue = productQueue;
        this.upload = upload;
    }
    async findByShop(shopId) {
        return this.productModel.find({ shopId }).sort({ createdAt: -1 });
    }
    async create(shopId, dto, files) {
        if (files && files.length > 3) {
            throw new common_1.BadRequestException('Maximum 3 images allowed');
        }
        const imagePaths = [];
        for (const file of files || []) {
            const path = await this.upload.compressAndSave(file, 'products');
            imagePaths.push(path);
        }
        const product = await this.productModel.create({
            shopId,
            ...dto,
            images: imagePaths,
            imageKeywords: [],
        });
        if (imagePaths.length > 0) {
            await this.productQueue.add('process-product', {
                productId: product._id.toString(),
                images: imagePaths,
            });
        }
        return product;
    }
    async update(shopId, id, dto) {
        const product = await this.productModel.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (product.shopId !== shopId)
            throw new common_1.ForbiddenException();
        Object.assign(product, dto);
        return product.save();
    }
    async remove(shopId, id) {
        const product = await this.productModel.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (product.shopId !== shopId)
            throw new common_1.ForbiddenException();
        for (const img of product.images) {
            this.upload.deleteFile(img);
        }
        await product.deleteOne();
        return { message: 'Product deleted' };
    }
    async findById(id) {
        const product = await this.productModel.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async findByShopPublic(shopId, sort) {
        const sortMap = {
            popular: { totalSold: -1 },
            top_rated: { averageRating: -1 },
        };
        return this.productModel.find({ shopId }).sort(sortMap[sort] || { createdAt: -1 });
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, bullmq_1.InjectQueue)('product-processing')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        bullmq_2.Queue,
        upload_service_1.UploadService])
], ProductService);
//# sourceMappingURL=product.service.js.map