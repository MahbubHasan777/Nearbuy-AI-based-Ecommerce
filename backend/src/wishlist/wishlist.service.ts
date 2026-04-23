import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async getCustomerWishlist(customerId: string) {
    const list = await this.wishlistModel.find({ customerId, status: { $ne: 'FULFILLED' } }).sort({ createdAt: -1 }).lean();
    return Promise.all(list.map(async item => {
      const product = await this.productModel.findById(item.productId).lean();
      const shop = await this.prisma.shop.findUnique({ where: { id: item.shopId }, select: { shopName: true } });
      return { ...item, product, shop };
    }));
  }

  async addToWishlist(customerId: string, productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.wishlistModel.findOne({ customerId, productId, status: 'PENDING' });
    if (existing) throw new BadRequestException('Already in pending wishlist');

    return this.wishlistModel.create({
      customerId,
      productId,
      shopId: product.shopId,
    });
  }

  async removeFromWishlist(customerId: string, wishlistId: string) {
    const item = await this.wishlistModel.findById(wishlistId);
    if (!item) throw new NotFoundException('Wishlist item not found');
    if (item.customerId !== customerId) throw new ForbiddenException();

    await item.deleteOne();
    return { message: 'Removed from wishlist' };
  }

  async getShopWishlistRequests(shopId: string) {
    const list = await this.wishlistModel.find({ shopId }).sort({ createdAt: -1 }).lean();
    return Promise.all(list.map(async item => {
      const product = await this.productModel.findById(item.productId).lean();
      const customer = await this.prisma.customer.findUnique({ where: { id: item.customerId }, select: { fullName: true, username: true } });
      return { ...item, product, customer };
    }));
  }

  async markAsDone(shopId: string, wishlistId: string) {
    const item = await this.wishlistModel.findById(wishlistId);
    if (!item) throw new NotFoundException('Wishlist item not found');
    if (item.shopId !== shopId) throw new ForbiddenException();
    if (item.status !== 'PENDING') {
      throw new BadRequestException('Item is not in PENDING state');
    }

    item.status = 'FULFILLED';
    await item.save();

    const product = await this.productModel.findById(item.productId);
    if (product) {
      await this.productModel.findByIdAndUpdate(item.productId, {
        $inc: { totalSold: 1 },
      });

      await this.prisma.orderHistory.create({
        data: {
          customerId: item.customerId,
          productId: item.productId.toString(),
          shopId: item.shopId,
          productName: product.name,
          price: product.discountPrice || product.price,
        },
      });
      
      const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
      await this.notificationService.create(
        item.customerId,
        'CUSTOMER',
        'Wishlist Fulfilled',
        `Your wishlist item "${product.name}" has been fulfilled by ${shop?.shopName || 'the shop'}. You can now pick it up!`
      );
    }

    return { message: 'Marked as done' };
  }

  async reject(shopId: string, wishlistId: string) {
    const item = await this.wishlistModel.findById(wishlistId);
    if (!item) throw new NotFoundException('Wishlist item not found');
    if (item.shopId !== shopId) throw new ForbiddenException();

    item.status = 'REJECTED';
    await item.save();

    const product = await this.productModel.findById(item.productId);
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (product) {
      await this.notificationService.create(
        item.customerId,
        'CUSTOMER',
        'Wishlist Rejected',
        `Your wishlist request for "${product.name}" was rejected by ${shop?.shopName || 'the shop'}.`
      );
    }

    return { message: 'Wishlist request rejected' };
  }

  async removeShopRequest(shopId: string, wishlistId: string) {
    const item = await this.wishlistModel.findById(wishlistId);
    if (!item) throw new NotFoundException('Wishlist item not found');
    if (item.shopId !== shopId) throw new ForbiddenException();

    await item.deleteOne();
    return { message: 'Removed from dashboard' };
  }
}
