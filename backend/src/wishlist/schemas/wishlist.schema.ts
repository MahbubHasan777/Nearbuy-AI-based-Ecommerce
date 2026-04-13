import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  shopId: string;

  @Prop({ enum: ['PENDING', 'REJECTED', 'DONE'], default: 'PENDING' })
  status: string;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
