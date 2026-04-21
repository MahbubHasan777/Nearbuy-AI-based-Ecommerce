import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { TokenGuard } from '../auth/guards/token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller()
@UseGuards(TokenGuard, RolesGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get('customer/wishlist')
  @Roles('CUSTOMER')
  getCustomerWishlist(@Req() req: any) {
    return this.wishlistService.getCustomerWishlist(req.user.id);
  }

  @Post('customer/wishlist/:productId')
  @Roles('CUSTOMER')
  addToWishlist(@Req() req: any, @Param('productId') productId: string) {
    return this.wishlistService.addToWishlist(req.user.id, productId);
  }

  @Delete('customer/wishlist/:wishlistId')
  @Roles('CUSTOMER')
  removeFromWishlist(@Req() req: any, @Param('wishlistId') wishlistId: string) {
    return this.wishlistService.removeFromWishlist(req.user.id, wishlistId);
  }

  @Get('shop/wishlist-requests')
  @Roles('SHOP')
  getShopRequests(@Req() req: any) {
    return this.wishlistService.getShopWishlistRequests(req.user.id);
  }

  @Patch('shop/wishlist-requests/:id/done')
  @Roles('SHOP')
  markDone(@Req() req: any, @Param('id') id: string) {
    return this.wishlistService.markAsDone(req.user.id, id);
  }

  @Patch('shop/wishlist-requests/:id/reject')
  @Roles('SHOP')
  reject(@Req() req: any, @Param('id') id: string) {
    return this.wishlistService.reject(req.user.id, id);
  }

  @Delete('shop/wishlist-requests/:id')
  @Roles('SHOP')
  removeShopRequest(@Req() req: any, @Param('id') id: string) {
    return this.wishlistService.removeShopRequest(req.user.id, id);
  }
}
