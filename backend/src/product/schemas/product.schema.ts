import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  shopId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brandId: string;

  @Prop({ required: true })
  categoryId: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  discountPrice: number;

  @Prop()
  discountPercentage: number;

  @Prop({ enum: ['IN_STOCK', 'OUT_OF_STOCK'], default: 'IN_STOCK' })
  status: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: [String] })
  imageKeywords: string[];

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalRatings: number;

  @Prop({ default: 0 })
  totalSold: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
