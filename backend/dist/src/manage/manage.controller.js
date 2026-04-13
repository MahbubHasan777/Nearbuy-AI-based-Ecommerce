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
exports.ManageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const manage_service_1 = require("./manage.service");
const token_guard_1 = require("../auth/guards/token.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let ManageController = class ManageController {
    manageService;
    constructor(manageService) {
        this.manageService = manageService;
    }
    listShops(query) {
        return this.manageService.listShops(query);
    }
    getShop(id) {
        return this.manageService.getShop(id);
    }
    updateShop(id, body) {
        return this.manageService.updateShop(id, body);
    }
    deleteShop(id) {
        return this.manageService.deleteShop(id);
    }
    approveShop(id) {
        return this.manageService.approveShop(id);
    }
    rejectShop(id) {
        return this.manageService.rejectShop(id);
    }
    toggleShop(id) {
        return this.manageService.toggleShopActive(id);
    }
    getShopProducts(id) {
        return this.manageService.getShopProducts(id);
    }
    createProductForShop(id, body, files) {
        return this.manageService.createProductForShop(id, body, files);
    }
    updateProduct(id, pid, body) {
        return this.manageService.updateProductForShop(id, pid, body);
    }
    deleteProduct(id, pid) {
        return this.manageService.deleteProductForShop(id, pid);
    }
    listCustomers(query) {
        return this.manageService.listCustomers(query);
    }
    toggleCustomer(id) {
        return this.manageService.toggleCustomerActive(id);
    }
    getWishlist(query) {
        return this.manageService.getWishlistByContact(query);
    }
    deleteWishlist(id) {
        return this.manageService.deleteWishlistItem(id);
    }
};
exports.ManageController = ManageController;
__decorate([
    (0, common_1.Get)('shops'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "listShops", null);
__decorate([
    (0, common_1.Get)('shops/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "getShop", null);
__decorate([
    (0, common_1.Patch)('shops/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "updateShop", null);
__decorate([
    (0, common_1.Delete)('shops/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "deleteShop", null);
__decorate([
    (0, common_1.Patch)('shops/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "approveShop", null);
__decorate([
    (0, common_1.Patch)('shops/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "rejectShop", null);
__decorate([
    (0, common_1.Patch)('shops/:id/toggle-active'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "toggleShop", null);
__decorate([
    (0, common_1.Get)('shops/:id/products'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "getShopProducts", null);
__decorate([
    (0, common_1.Post)('shops/:id/products'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 3, { storage: (0, multer_1.memoryStorage)() })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Array]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "createProductForShop", null);
__decorate([
    (0, common_1.Patch)('shops/:id/products/:pid'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('pid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('shops/:id/products/:pid'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('pid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Get)('customers'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "listCustomers", null);
__decorate([
    (0, common_1.Patch)('customers/:id/toggle-active'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "toggleCustomer", null);
__decorate([
    (0, common_1.Get)('wishlist'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "getWishlist", null);
__decorate([
    (0, common_1.Delete)('wishlist/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "deleteWishlist", null);
exports.ManageController = ManageController = __decorate([
    (0, common_1.Controller)('manage'),
    (0, common_1.UseGuards)(token_guard_1.TokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'MODERATOR'),
    __metadata("design:paramtypes", [manage_service_1.ManageService])
], ManageController);
//# sourceMappingURL=manage.controller.js.map