import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { TokenGuard } from '../auth/guards/token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller()
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('customer/review/:productId')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles('CUSTOMER')
  createReview(
    @Req() req: any,
    @Param('productId') productId: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
  ) {
    return this.reviewService.createReview(req.user.id, productId, rating, comment);
  }

  @Get('products/:productId/reviews')
  getReviews(@Param('productId') productId: string) {
    return this.reviewService.getProductReviews(productId);
  }
}
