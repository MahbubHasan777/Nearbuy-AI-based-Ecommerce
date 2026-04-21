import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GeoModule } from '../geo/geo.module';
import { UploadModule } from '../upload/upload.module';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [PrismaModule, GeoModule, UploadModule, AuthModule, ProductModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
