import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopsPublicController } from './shops-public.controller';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { PrismaModule } from '../prisma/prisma.module';
import { CustomerModule } from '../customer/customer.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    PrismaModule,
    CustomerModule,
    AuthModule,
  ],
  controllers: [ShopsPublicController],
})
export class ShopsPublicModule {}
