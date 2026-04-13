import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true })
  shopId: string;

  @Prop({ required: true })
  name: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
