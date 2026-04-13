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
exports.ShopsPublicController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const prisma_service_1 = require("../prisma/prisma.service");
const product_schema_1 = require("../product/schemas/product.schema");
const customer_service_1 = require("../customer/customer.service");
const token_guard_1 = require("../auth/guards/token.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let ShopsPublicController = class ShopsPublicController {
    prisma;
    productModel;
    customerService;
    constructor(prisma, productModel, customerService) {
        this.prisma = prisma;
        this.productModel = productModel;
        this.customerService = customerService;
    }
    getShop(id) {
        return this.prisma.shop.findUnique({
            where: { id },
            select: {
                id: true,
                shopName: true,
                shopAddress: true,
                lat: true,
                lng: true,
                profilePic: true,
                bannerMsg: true,
                status: true,
            },
        });
    }
    getPopular(id) {
        return this.productModel.find({ shopId: id }).sort({ totalSold: -1 }).limit(20);
    }
    getTopRated(id) {
        return this.productModel.find({ shopId: id }).sort({ averageRating: -1 }).limit(20);
    }
    recordVisit(id, req) {
        return this.customerService.recordRecentShop(req.user.id, id);
    }
};
exports.ShopsPublicController = ShopsPublicController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShopsPublicController.prototype, "getShop", null);
__decorate([
    (0, common_1.Get)(':id/products/popular'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShopsPublicController.prototype, "getPopular", null);
__decorate([
    (0, common_1.Get)(':id/products/top-rated'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShopsPublicController.prototype, "getTopRated", null);
__decorate([
    (0, common_1.Get)(':id/visit'),
    (0, common_1.UseGuards)(token_guard_1.TokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('CUSTOMER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShopsPublicController.prototype, "recordVisit", null);
exports.ShopsPublicController = ShopsPublicController = __decorate([
    (0, common_1.Controller)('shops'),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mongoose_2.Model,
        customer_service_1.CustomerService])
], ShopsPublicController);
//# sourceMappingURL=shops-public.controller.js.map