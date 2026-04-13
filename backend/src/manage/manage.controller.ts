import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ManageService } from './manage.service';
import { TokenGuard } from '../auth/guards/token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('manage')
@UseGuards(TokenGuard, RolesGuard)
@Roles('ADMIN', 'MODERATOR')
export class ManageController {
  constructor(private manageService: ManageService) {}

  @Get('shops')
  listShops(@Query() query: any) {
    return this.manageService.listShops(query);
  }

  @Get('shops/:id')
  getShop(@Param('id') id: string) {
    return this.manageService.getShop(id);
  }

  @Patch('shops/:id')
  updateShop(@Param('id') id: string, @Body() body: any) {
    return this.manageService.updateShop(id, body);
  }

  @Delete('shops/:id')
  deleteShop(@Param('id') id: string) {
    return this.manageService.deleteShop(id);
  }

  @Patch('shops/:id/approve')
  approveShop(@Param('id') id: string) {
    return this.manageService.approveShop(id);
  }

  @Patch('shops/:id/reject')
  rejectShop(@Param('id') id: string) {
    return this.manageService.rejectShop(id);
  }

  @Patch('shops/:id/toggle-active')
  toggleShop(@Param('id') id: string) {
    return this.manageService.toggleShopActive(id);
  }

  @Get('shops/:id/products')
  getShopProducts(@Param('id') id: string) {
    return this.manageService.getShopProducts(id);
  }

  @Post('shops/:id/products')
  @UseInterceptors(FilesInterceptor('images', 3, { storage: memoryStorage() }))
  createProductForShop(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.manageService.createProductForShop(id, body, files);
  }

  @Patch('shops/:id/products/:pid')
  updateProduct(
    @Param('id') id: string,
    @Param('pid') pid: string,
    @Body() body: any,
  ) {
    return this.manageService.updateProductForShop(id, pid, body);
  }

  @Delete('shops/:id/products/:pid')
  deleteProduct(@Param('id') id: string, @Param('pid') pid: string) {
    return this.manageService.deleteProductForShop(id, pid);
  }

  @Get('customers')
  listCustomers(@Query() query: any) {
    return this.manageService.listCustomers(query);
  }

  @Patch('customers/:id/toggle-active')
  toggleCustomer(@Param('id') id: string) {
    return this.manageService.toggleCustomerActive(id);
  }

  @Get('wishlist')
  getWishlist(@Query() query: any) {
    return this.manageService.getWishlistByContact(query);
  }

  @Delete('wishlist/:id')
  deleteWishlist(@Param('id') id: string) {
    return this.manageService.deleteWishlistItem(id);
  }
}
