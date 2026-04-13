"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const manage_controller_1 = require("./manage.controller");
const manage_service_1 = require("./manage.service");
const product_schema_1 = require("../product/schemas/product.schema");
const wishlist_schema_1 = require("../wishlist/schemas/wishlist.schema");
const prisma_module_1 = require("../prisma/prisma.module");
const upload_module_1 = require("../upload/upload.module");
const auth_module_1 = require("../auth/auth.module");
let ManageModule = class ManageModule {
};
exports.ManageModule = ManageModule;
exports.ManageModule = ManageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: wishlist_schema_1.Wishlist.name, schema: wishlist_schema_1.WishlistSchema },
            ]),
            prisma_module_1.PrismaModule,
            upload_module_1.UploadModule,
            auth_module_1.AuthModule,
        ],
        controllers: [manage_controller_1.ManageController],
        providers: [manage_service_1.ManageService],
    })
], ManageModule);
//# sourceMappingURL=manage.module.js.map