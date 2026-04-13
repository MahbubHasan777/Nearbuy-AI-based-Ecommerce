import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  shopId: string;

  @Prop({ min: 1, max: 5 })
  rating: number;

  @Prop({ maxlength: 1000 })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
