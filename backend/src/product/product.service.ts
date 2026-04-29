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
    @InjectModel('Category') private categoryModel: Model<any>,
    @InjectModel('Brand') private brandModel: Model<any>,
  ) {}

  async findByShop(shopId: string) {
    const products = await this.productModel.find({ shopId }).sort({ createdAt: -1 }).lean();
    
    // Fetch all categories and brands for this shop to manually populate
    const categories = await this.categoryModel.find({ shopId }).lean();
    const brands = await this.brandModel.find({ shopId }).lean();
    
    const catMap = new Map(categories.map(c => [c._id.toString(), c]));
    const brandMap = new Map(brands.map(b => [b._id.toString(), b]));

    return products.map(p => ({
      ...p,
      category: catMap.get(p.categoryId as string) || null,
      brand: brandMap.get(p.brandId as string) || null
    }));
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

  async update(shopId: string, id: string, dto: UpdateProductDto, files?: Express.Multer.File[]) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (product.shopId !== shopId) throw new ForbiddenException();

    if (files && files.length > 0) {
      for (const img of product.images) {
        this.upload.deleteFile(img);
      }
      const imagePaths: string[] = [];
      for (const file of files) {
        const path = await this.upload.compressAndSave(file, 'products');
        imagePaths.push(path);
      }
      product.images = imagePaths;
    }

    Object.assign(product, dto);
    const saved = await product.save();

    return saved;
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

  async findOne(shopId: string, id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (product.shopId !== shopId) throw new ForbiddenException();
    return product;
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
