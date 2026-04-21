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

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async createReview(
    customerId: string,
    productId: string,
    rating: number,
    comment: string,
  ) {
    const purchased = await this.wishlistModel.findOne({
      customerId,
      productId,
      status: { $in: ['FULFILLED', 'DONE'] },
    });

    if (!purchased) {
      throw new BadRequestException('You can only review products you have purchased');
    }

    const existing = await this.reviewModel.findOne({ customerId, productId });
    if (existing) throw new BadRequestException('Already reviewed this product');

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
    return this.reviewModel.find({ productId }).sort({ createdAt: -1 });
  }
}
