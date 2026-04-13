"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bullmq_1 = require("@nestjs/bullmq");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const mailer_module_1 = require("./mailer/mailer.module");
const customer_module_1 = require("./customer/customer.module");
const shop_module_1 = require("./shop/shop.module");
const category_module_1 = require("./category/category.module");
const brand_module_1 = require("./brand/brand.module");
const product_module_1 = require("./product/product.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const review_module_1 = require("./review/review.module");
const admin_module_1 = require("./admin/admin.module");
const manage_module_1 = require("./manage/manage.module");
const search_module_1 = require("./search/search.module");
const geo_module_1 = require("./geo/geo.module");
const upload_module_1 = require("./upload/upload.module");
const shops_public_module_1 = require("./shop/shops-public.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/nearbuy'),
            bullmq_1.BullModule.forRoot({
                connection: {
                    host: 'localhost',
                    port: 6379,
                },
            }),
            prisma_module_1.PrismaModule,
            mailer_module_1.MailerModule,
            auth_module_1.AuthModule,
            customer_module_1.CustomerModule,
            shop_module_1.ShopModule,
            category_module_1.CategoryModule,
            brand_module_1.BrandModule,
            product_module_1.ProductModule,
            wishlist_module_1.WishlistModule,
            review_module_1.ReviewModule,
            admin_module_1.AdminModule,
            manage_module_1.ManageModule,
            search_module_1.SearchModule,
            geo_module_1.GeoModule,
            upload_module_1.UploadModule,
            shops_public_module_1.ShopsPublicModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map