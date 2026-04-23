import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopMessageDto } from './dto/shop-message.dto';
import { TokenGuard } from '../auth/guards/token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Product } from '../product/schemas/product.schema';

@Controller('shop')
export class ShopController {
  constructor(
    private shopService: ShopService,
    @InjectModel(Product.name) private productModel: Model<any>,
  ) {}

  @Get('public/:id')
  async getPublicShop(@Param('id') id: string) {
    return this.shopService.getPublicProfile(id);
  }

  @Get('public/:id/products')
  async getPublicProducts(@Param('id') id: string, @Query('sort') sort?: string) {
    return this.productModel.find({ shopId: id, status: 'IN_STOCK' }).sort({ createdAt: -1 });
  }

  @Get('public/product/:id')
  async getPublicProduct(@Param('id') id: string) {
    const product = await this.productModel.findById(id).lean();
    if (!product) throw new NotFoundException('Product not found');
    const shop = await this.shopService.getPublicProfile(product.shopId);
    return { ...product, shop };
  }

  @Post('register')
  async register(@Body() dto: CreateShopDto) {
    return this.shopService.register(dto);
  }

  @Get('profile')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('SHOP')
  async getProfile(@Req() req: any) {
    return this.shopService.getProfile(req.user.id);
  }

  @Patch('profile')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('SHOP')
  async updateProfile(@Req() req: any, @Body() dto: UpdateShopDto) {
    return this.shopService.updateProfile(req.user.id, dto);
  }

  @Post('profile/picture')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('SHOP')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadPic(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.shopService.uploadProfilePic(req.user.id, file);
  }

  @Patch('profile/picture')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('SHOP')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async updatePic(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.shopService.uploadProfilePic(req.user.id, file);
  }

  @Delete('profile/picture')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('SHOP')
  async deletePic(@Req() req: any) {
    return this.shopService.deleteProfilePic(req.user.id);
  }

  @Patch('message')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('SHOP')
  async updateMessage(@Req() req: any, @Body() dto: ShopMessageDto) {
    return this.shopService.updateBannerMsg(req.user.id, dto);
  }

  @Delete('account')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('SHOP')
  @HttpCode(200)
  async deleteAccount(@Req() req: any) {
    return this.shopService.deleteAccount(req.user.id);
  }
}
