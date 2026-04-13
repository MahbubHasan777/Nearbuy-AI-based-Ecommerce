import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(shopId: string) {
    return this.categoryModel.find({ shopId }).sort({ createdAt: -1 });
  }

  async create(shopId: string, name: string) {
    return this.categoryModel.create({ shopId, name });
  }

  async update(shopId: string, id: string, name: string) {
    const cat = await this.categoryModel.findById(id);
    if (!cat) throw new NotFoundException('Category not found');
    if (cat.shopId !== shopId) throw new ForbiddenException();

    cat.name = name;
    return cat.save();
  }

  async remove(shopId: string, id: string) {
    const cat = await this.categoryModel.findById(id);
    if (!cat) throw new NotFoundException('Category not found');
    if (cat.shopId !== shopId) throw new ForbiddenException();

    await cat.deleteOne();
    return { message: 'Category deleted' };
  }
}
