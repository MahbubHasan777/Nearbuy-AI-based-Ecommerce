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

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private prisma: PrismaService,
  ) {}

  async getCustomerWishlist(customerId: string) {
    return this.wishlistModel.find({ customerId }).sort({ createdAt: -1 });
  }

  async addToWishlist(customerId: string, productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.wishlistModel.findOne({ customerId, productId });
    if (existing) throw new BadRequestException('Already in wishlist');

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
    return this.wishlistModel.find({ shopId }).sort({ createdAt: -1 });
  }

  async markAsDone(shopId: string, wishlistId: string) {
    const item = await this.wishlistModel.findById(wishlistId);
    if (!item) throw new NotFoundException('Wishlist item not found');
    if (item.shopId !== shopId) throw new ForbiddenException();
    if (item.status !== 'PENDING') {
      throw new BadRequestException('Item is not in PENDING state');
    }

    item.status = 'DONE';
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
    }

    return { message: 'Marked as done' };
  }

  async reject(shopId: string, wishlistId: string) {
    const item = await this.wishlistModel.findById(wishlistId);
    if (!item) throw new NotFoundException('Wishlist item not found');
    if (item.shopId !== shopId) throw new ForbiddenException();

    item.status = 'REJECTED';
    await item.save();
    return { message: 'Wishlist request rejected' };
  }
}
