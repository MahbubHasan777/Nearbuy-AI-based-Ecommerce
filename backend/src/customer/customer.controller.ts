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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { TokenGuard } from '../auth/guards/token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post('register')
  async register(@Body() dto: CreateCustomerDto) {
    return this.customerService.register(dto);
  }

  @Get('profile')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  async getProfile(@Req() req: any) {
    return this.customerService.getProfile(req.user.id);
  }

  @Patch('profile')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  async updateProfile(@Req() req: any, @Body() body: any) {
    return this.customerService.updateProfile(req.user.id, body);
  }

  @Post('profile/picture')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadPic(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.customerService.uploadProfilePic(req.user.id, file);
  }

  @Patch('profile/picture')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async updatePic(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.customerService.uploadProfilePic(req.user.id, file);
  }

  @Delete('profile/picture')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  async deletePic(@Req() req: any) {
    return this.customerService.deleteProfilePic(req.user.id);
  }

  @Patch('location')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  async updateLocation(@Req() req: any, @Body() dto: UpdateLocationDto) {
    return this.customerService.updateLocation(req.user.id, dto);
  }

  @Get('nearby-shops')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  async nearbyShops(@Req() req: any, @Query() query: any) {
    return this.customerService.getNearbyShops(req.user.id, query);
  }

  @Get('favourites')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  async getFavourites(@Req() req: any) {
    return this.customerService.getFavourites(req.user.id);
  }

  @Post('favourites/:shopId')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  async addFavourite(@Req() req: any, @Param('shopId') shopId: string) {
    return this.customerService.addFavourite(req.user.id, shopId);
  }

  @Delete('favourites/:shopId')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  async removeFavourite(@Req() req: any, @Param('shopId') shopId: string) {
    return this.customerService.removeFavourite(req.user.id, shopId);
  }

  @Get('recent-shops')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  async getRecentShops(@Req() req: any) {
    return this.customerService.getRecentShops(req.user.id);
  }

  @Get('orders')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  async getOrders(@Req() req: any) {
    return this.customerService.getOrders(req.user.id);
  }

  @Delete('account')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  @HttpCode(200)
  async deactivate(@Req() req: any) {
    return this.customerService.deactivateAccount(req.user.id);
  }
}
