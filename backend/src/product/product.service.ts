import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { UploadService } from '../upload/upload.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectQueue('product-processing')
    private productQueue: Queue,
    private upload: UploadService,
  ) {}

  async findByShop(shopId: string) {
    return this.productModel.find({ shopId }).sort({ createdAt: -1 });
  }

  async create(
    shopId: string,
    dto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    if (files && files.length > 3) {
      throw new BadRequestException('Maximum 3 images allowed');
    }

    const imagePaths: string[] = [];
    for (const file of files || []) {
      const path = await this.upload.compressAndSave(file, 'products');
      imagePaths.push(path);
    }

    const product = await this.productModel.create({
      shopId,
      ...dto,
      images: imagePaths,
      imageKeywords: [],
    });

    if (imagePaths.length > 0) {
      await this.productQueue.add('process-product', {
        productId: product._id.toString(),
        images: imagePaths,
      });
    }

    return product;
  }

  async update(shopId: string, id: string, dto: UpdateProductDto) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (product.shopId !== shopId) throw new ForbiddenException();

    Object.assign(product, dto);
    return product.save();
  }

  async remove(shopId: string, id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (product.shopId !== shopId) throw new ForbiddenException();

    for (const img of product.images) {
      this.upload.deleteFile(img);
    }

    await product.deleteOne();
    return { message: 'Product deleted' };
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findByShopPublic(shopId: string, sort: string) {
    const sortMap: Record<string, any> = {
      popular: { totalSold: -1 },
      top_rated: { averageRating: -1 },
    };
    return this.productModel.find({ shopId }).sort(sortMap[sort] || { createdAt: -1 });
  }
}
