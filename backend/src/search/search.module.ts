import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { PrismaModule } from '../prisma/prisma.module';
import { GeoModule } from '../geo/geo.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    PrismaModule,
    GeoModule,
    AuthModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
