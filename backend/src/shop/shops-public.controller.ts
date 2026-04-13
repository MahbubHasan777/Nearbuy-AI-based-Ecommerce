import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../product/schemas/product.schema';
import { CustomerService } from '../customer/customer.service';
import { TokenGuard } from '../auth/guards/token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('shops')
export class ShopsPublicController {
  constructor(
    private prisma: PrismaService,
    @InjectModel(Product.name)
    private productModel: Model<any>,
    private customerService: CustomerService,
  ) {}

  @Get(':id')
  getShop(@Param('id') id: string) {
    return this.prisma.shop.findUnique({
      where: { id },
      select: {
        id: true,
        shopName: true,
        shopAddress: true,
        lat: true,
        lng: true,
        profilePic: true,
        bannerMsg: true,
        status: true,
      },
    });
  }

  @Get(':id/products/popular')
  getPopular(@Param('id') id: string) {
    return this.productModel.find({ shopId: id }).sort({ totalSold: -1 }).limit(20);
  }

  @Get(':id/products/top-rated')
  getTopRated(@Param('id') id: string) {
    return this.productModel.find({ shopId: id }).sort({ averageRating: -1 }).limit(20);
  }

  @Get(':id/visit')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  recordVisit(@Param('id') id: string, @Req() req: any) {
    return this.customerService.recordRecentShop(req.user.id, id);
  }
}
