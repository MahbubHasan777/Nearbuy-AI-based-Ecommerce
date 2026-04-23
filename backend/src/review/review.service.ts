import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Wishlist, WishlistDocument } from '../wishlist/schemas/wishlist.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private prisma: PrismaService,
  ) {}

  async createReview(
    customerId: string,
    productId: string,
    rating: number,
    comment: string,
  ) {
    const purchaseCount = await this.wishlistModel.countDocuments({
      customerId,
      productId,
      status: { $in: ['FULFILLED', 'DONE'] },
    });

    if (purchaseCount === 0) {
      throw new BadRequestException('You can only review products you have purchased');
    }

    const reviewCount = await this.reviewModel.countDocuments({ customerId, productId });
    if (reviewCount >= purchaseCount) {
      throw new BadRequestException('You have already reviewed all your purchases for this product');
    }

    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const review = await this.reviewModel.create({
      customerId,
      productId,
      shopId: product.shopId,
      rating,
      comment,
    });

    const newTotal = product.totalRatings + 1;
    const newAvg =
      (product.averageRating * product.totalRatings + rating) / newTotal;

    await this.productModel.findByIdAndUpdate(productId, {
      averageRating: Math.round(newAvg * 10) / 10,
      totalRatings: newTotal,
    });

    return review;
  }

  async getProductReviews(productId: string) {
    const reviews = await this.reviewModel.find({ productId }).sort({ createdAt: -1 }).lean();
    if (reviews.length === 0) return reviews;

    const customerIds = [...new Set(reviews.map(r => r.customerId))];
    const customers = await this.prisma.customer.findMany({
      where: { id: { in: customerIds } },
      select: { id: true, fullName: true, profilePic: true },
    });

    const customerMap = new Map(customers.map(c => [c.id, c]));

    return reviews.map(r => ({
      ...r,
      customer: customerMap.get(r.customerId) || { fullName: 'Unknown Customer' }
    }));
  }
}
