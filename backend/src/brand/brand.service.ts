import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private brandModel: Model<BrandDocument>,
  ) {}

  async findAll(shopId: string) {
    return this.brandModel.find({ shopId }).sort({ createdAt: -1 });
  }

  async create(shopId: string, name: string) {
    return this.brandModel.create({ shopId, name });
  }

  async update(shopId: string, id: string, name: string) {
    const brand = await this.brandModel.findById(id);
    if (!brand) throw new NotFoundException('Brand not found');
    if (brand.shopId !== shopId) throw new ForbiddenException();

    brand.name = name;
    return brand.save();
  }

  async remove(shopId: string, id: string, productModel: Model<any>) {
    const brand = await this.brandModel.findById(id);
    if (!brand) throw new NotFoundException('Brand not found');
    if (brand.shopId !== shopId) throw new ForbiddenException();

    await productModel.deleteMany({ brandId: id });
    await brand.deleteOne();
    return { message: 'Brand and associated products deleted' };
  }
}
