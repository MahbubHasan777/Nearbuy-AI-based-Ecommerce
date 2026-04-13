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
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const brand_schema_1 = require("./schemas/brand.schema");
let BrandService = class BrandService {
    brandModel;
    constructor(brandModel) {
        this.brandModel = brandModel;
    }
    async findAll(shopId) {
        return this.brandModel.find({ shopId }).sort({ createdAt: -1 });
    }
    async create(shopId, name) {
        return this.brandModel.create({ shopId, name });
    }
    async update(shopId, id, name) {
        const brand = await this.brandModel.findById(id);
        if (!brand)
            throw new common_1.NotFoundException('Brand not found');
        if (brand.shopId !== shopId)
            throw new common_1.ForbiddenException();
        brand.name = name;
        return brand.save();
    }
    async remove(shopId, id, productModel) {
        const brand = await this.brandModel.findById(id);
        if (!brand)
            throw new common_1.NotFoundException('Brand not found');
        if (brand.shopId !== shopId)
            throw new common_1.ForbiddenException();
        await productModel.deleteMany({ brandId: id });
        await brand.deleteOne();
        return { message: 'Brand and associated products deleted' };
    }
};
exports.BrandService = BrandService;
exports.BrandService = BrandService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(brand_schema_1.Brand.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BrandService);
//# sourceMappingURL=brand.service.js.map