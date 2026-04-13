import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BrandService } from './brand.service';
import { TokenGuard } from '../auth/guards/token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Product } from '../product/schemas/product.schema';

@Controller('shop/brands')
@UseGuards(TokenGuard, RolesGuard)
@Roles('SHOP')
export class BrandController {
  constructor(
    private brandService: BrandService,
    @InjectModel(Product.name) private productModel: Model<any>,
  ) {}

  @Get()
  findAll(@Req() req: any) {
    return this.brandService.findAll(req.user.id);
  }

  @Post()
  create(@Req() req: any, @Body('name') name: string) {
    return this.brandService.create(req.user.id, name);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    return this.brandService.update(req.user.id, id, name);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.brandService.remove(req.user.id, id, this.productModel);
  }
}
