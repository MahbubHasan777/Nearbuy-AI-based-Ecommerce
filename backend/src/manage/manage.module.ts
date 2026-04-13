import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManageController } from './manage.controller';
import { ManageService } from './manage.service';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { Wishlist, WishlistSchema } from '../wishlist/schemas/wishlist.schema';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Wishlist.name, schema: WishlistSchema },
    ]),
    PrismaModule,
    UploadModule,
    AuthModule,
  ],
  controllers: [ManageController],
  providers: [ManageService],
})
export class ManageModule {}
