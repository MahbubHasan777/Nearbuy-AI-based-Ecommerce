import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopMessageDto } from './dto/shop-message.dto';
import { TokenGuard } from '../auth/guards/token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

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
  async deactivate(@Req() req: any) {
    return this.shopService.deactivateAccount(req.user.id);
  }
}
