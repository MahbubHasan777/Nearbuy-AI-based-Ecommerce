import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { CustomerModule } from './customer/customer.module';
import { ShopModule } from './shop/shop.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ReviewModule } from './review/review.module';
import { AdminModule } from './admin/admin.module';
import { ManageModule } from './manage/manage.module';
import { SearchModule } from './search/search.module';
import { GeoModule } from './geo/geo.module';
import { UploadModule } from './upload/upload.module';
import { ShopsPublicModule } from './shop/shops-public.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/nearbuy'),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrismaModule,
    MailerModule,
    AuthModule,
    CustomerModule,
    ShopModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    WishlistModule,
    ReviewModule,
    AdminModule,
    ManageModule,
    SearchModule,
    GeoModule,
    UploadModule,
    ShopsPublicModule,
    NotificationModule,
  ],
})
export class AppModule {}
