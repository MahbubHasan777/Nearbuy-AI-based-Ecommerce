"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopsPublicModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const shops_public_controller_1 = require("./shops-public.controller");
const product_schema_1 = require("../product/schemas/product.schema");
const prisma_module_1 = require("../prisma/prisma.module");
const customer_module_1 = require("../customer/customer.module");
const auth_module_1 = require("../auth/auth.module");
let ShopsPublicModule = class ShopsPublicModule {
};
exports.ShopsPublicModule = ShopsPublicModule;
exports.ShopsPublicModule = ShopsPublicModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema }]),
            prisma_module_1.PrismaModule,
            customer_module_1.CustomerModule,
            auth_module_1.AuthModule,
        ],
        controllers: [shops_public_controller_1.ShopsPublicController],
    })
], ShopsPublicModule);
//# sourceMappingURL=shops-public.module.js.map