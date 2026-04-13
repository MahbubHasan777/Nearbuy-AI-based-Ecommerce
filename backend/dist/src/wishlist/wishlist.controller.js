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
exports.WishlistController = void 0;
const common_1 = require("@nestjs/common");
const wishlist_service_1 = require("./wishlist.service");
const token_guard_1 = require("../auth/guards/token.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let WishlistController = class WishlistController {
    wishlistService;
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }
    getCustomerWishlist(req) {
        return this.wishlistService.getCustomerWishlist(req.user.id);
    }
    addToWishlist(req, productId) {
        return this.wishlistService.addToWishlist(req.user.id, productId);
    }
    removeFromWishlist(req, wishlistId) {
        return this.wishlistService.removeFromWishlist(req.user.id, wishlistId);
    }
    getShopRequests(req) {
        return this.wishlistService.getShopWishlistRequests(req.user.id);
    }
    markDone(req, id) {
        return this.wishlistService.markAsDone(req.user.id, id);
    }
    reject(req, id) {
        return this.wishlistService.reject(req.user.id, id);
    }
};
exports.WishlistController = WishlistController;
__decorate([
    (0, common_1.Get)('customer/wishlist'),
    (0, roles_decorator_1.Roles)('CUSTOMER'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "getCustomerWishlist", null);
__decorate([
    (0, common_1.Post)('customer/wishlist/:productId'),
    (0, roles_decorator_1.Roles)('CUSTOMER'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "addToWishlist", null);
__decorate([
    (0, common_1.Delete)('customer/wishlist/:wishlistId'),
    (0, roles_decorator_1.Roles)('CUSTOMER'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('wishlistId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "removeFromWishlist", null);
__decorate([
    (0, common_1.Get)('shop/wishlist-requests'),
    (0, roles_decorator_1.Roles)('SHOP'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "getShopRequests", null);
__decorate([
    (0, common_1.Patch)('shop/wishlist-requests/:id/done'),
    (0, roles_decorator_1.Roles)('SHOP'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "markDone", null);
__decorate([
    (0, common_1.Patch)('shop/wishlist-requests/:id/reject'),
    (0, roles_decorator_1.Roles)('SHOP'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "reject", null);
exports.WishlistController = WishlistController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(token_guard_1.TokenGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [wishlist_service_1.WishlistService])
], WishlistController);
//# sourceMappingURL=wishlist.controller.js.map