import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from '../prisma/prisma.service';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { Wishlist, WishlistDocument } from '../wishlist/schemas/wishlist.schema';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ManageService {
  constructor(
    private prisma: PrismaService,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
    private upload: UploadService,
  ) {}

  async listShops(query: any) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';

    return this.prisma.shop.findMany({
      where,
      select: {
        id: true, ownerName: true, ownerEmail: true, shopName: true,
        shopAddress: true, phone: true, lat: true, lng: true,
        status: true, isActive: true, profilePic: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getShop(id: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
      select: {
        id: true, ownerName: true, ownerEmail: true, shopName: true,
        shopAddress: true, phone: true, lat: true, lng: true,
        status: true, isActive: true, profilePic: true, bannerMsg: true, createdAt: true,
      },
    });
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async updateShop(id: string, data: any) {
    return this.prisma.shop.update({ where: { id }, data });
  }

  async deleteShop(id: string) {
    await this.prisma.shop.delete({ where: { id } });
    return { message: 'Shop deleted' };
  }

  async approveShop(id: string) {
    return this.prisma.shop.update({ where: { id }, data: { status: 'APPROVED' } });
  }

  async rejectShop(id: string) {
    return this.prisma.shop.update({ where: { id }, data: { status: 'REJECTED' } });
  }

  async toggleShopActive(id: string) {
    const shop = await this.prisma.shop.findUnique({ where: { id } });
    if (!shop) throw new NotFoundException('Shop not found');

    return this.prisma.shop.update({
      where: { id },
      data: { isActive: !shop.isActive },
      select: { id: true, isActive: true },
    });
  }

  async getShopProducts(shopId: string) {
    return this.productModel.find({ shopId }).sort({ createdAt: -1 });
  }

  async createProductForShop(shopId: string, data: any, files: Express.Multer.File[]) {
    const imagePaths: string[] = [];
    for (const file of files || []) {
      const path = await this.upload.compressAndSave(file, 'products');
      imagePaths.push(path);
    }
    return this.productModel.create({ shopId, ...data, images: imagePaths });
  }

  async updateProductForShop(shopId: string, pid: string, data: any) {
    return this.productModel.findOneAndUpdate({ _id: pid, shopId }, data, { new: true });
  }

  async deleteProductForShop(shopId: string, pid: string) {
    const product = await this.productModel.findOne({ _id: pid, shopId });
    if (!product) throw new NotFoundException('Product not found');
    for (const img of product.images) this.upload.deleteFile(img);
    await product.deleteOne();
    return { message: 'Product deleted' };
  }

  async listCustomers(query: any) {
    const where: any = {};
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';

    return this.prisma.customer.findMany({
      where,
      select: {
        id: true, username: true, email: true, fullName: true,
        phone: true, isActive: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleCustomerActive(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');

    return this.prisma.customer.update({
      where: { id },
      data: { isActive: !customer.isActive },
      select: { id: true, isActive: true },
    });
  }

  async getWishlistByContact(query: any) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          ...(query.email ? [{ email: query.email }] : []),
          ...(query.phone ? [{ phone: query.phone }] : []),
        ],
      },
    });

    if (!customer) throw new NotFoundException('Customer not found');
    return this.wishlistModel.find({ customerId: customer.id }).sort({ createdAt: -1 });
  }

  async deleteWishlistItem(id: string) {
    await this.wishlistModel.findByIdAndDelete(id);
    return { message: 'Wishlist item deleted' };
  }
}
