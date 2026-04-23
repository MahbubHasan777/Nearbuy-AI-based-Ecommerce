import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductProcessor } from './product-processor.consumer';
import { Product, ProductSchema } from './schemas/product.schema';
import { Category, CategorySchema } from '../category/schemas/category.schema';
import { Brand, BrandSchema } from '../brand/schemas/brand.schema';
import { UploadModule } from '../upload/upload.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Brand.name, schema: BrandSchema },
    ]),
    BullModule.registerQueue({ name: 'product-processing' }),
    UploadModule,
    AuthModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductProcessor],
  exports: [ProductService, MongooseModule],
})
export class ProductModule {}
