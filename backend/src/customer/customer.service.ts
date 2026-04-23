import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeoService } from '../geo/geo.service';
import { UploadService } from '../upload/upload.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(
    private prisma: PrismaService,
    private geo: GeoService,
    private upload: UploadService,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async register(dto: CreateCustomerDto) {
    const existing = await this.prisma.customer.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) throw new ConflictException('Email or username already taken');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const customer = await this.prisma.customer.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        address: dto.address,
        gender: dto.gender,
        phone: dto.phone,
      },
    });

    const { passwordHash: _, ...result } = customer;
    return result;
  }

  async getProfile(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        address: true,
        gender: true,
        phone: true,
        lat: true,
        lng: true,
        radiusMeters: true,
        profilePic: true,
        isActive: true,
        createdAt: true,
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async updateProfile(customerId: string, data: Partial<CreateCustomerDto>) {
    const { password, ...rest } = data as any;
    return this.prisma.customer.update({
      where: { id: customerId },
      data: rest,
      select: { id: true, username: true, email: true, fullName: true, address: true, phone: true },
    });
  }

  async uploadProfilePic(customerId: string, file: Express.Multer.File) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    if (customer.profilePic) {
      this.upload.deleteFile(customer.profilePic);
    }

    const path = await this.upload.compressAndSave(file, 'profiles/customers');
    await this.prisma.customer.update({ where: { id: customerId }, data: { profilePic: path } });
    return { profilePic: path };
  }

  async deleteProfilePic(customerId: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    if (customer.profilePic) {
      this.upload.deleteFile(customer.profilePic);
      await this.prisma.customer.update({ where: { id: customerId }, data: { profilePic: null } });
    }
    return { message: 'Profile picture deleted' };
  }

  async updateLocation(customerId: string, dto: UpdateLocationDto) {
    return this.prisma.customer.update({
      where: { id: customerId },
      data: { lat: dto.lat, lng: dto.lng, ...(dto.radiusMeters && { radiusMeters: dto.radiusMeters }) },
      select: { lat: true, lng: true, radiusMeters: true },
    });
  }

  async getNearbyShops(customerId: string, query?: any) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });

    const lat = query?.lat ? parseFloat(query.lat) : customer?.lat;
    const lng = query?.lng ? parseFloat(query.lng) : customer?.lng;
    const radius = query?.radius ? parseFloat(query.radius) : (customer?.radiusMeters ?? 5000);

    const shops = await this.prisma.shop.findMany({
      where: { status: 'APPROVED', isActive: true },
      select: {
        id: true,
        shopName: true,
        shopAddress: true,
        lat: true,
        lng: true,
        profilePic: true,
        bannerMsg: true,
      },
    });

    if (!lat || !lng) {
      return this.attachShopRatings(shops);
    }

    const filtered = this.geo.filterByRadius(shops, lat, lng, radius);
    return this.attachShopRatings(filtered);
  }

  private async attachShopRatings(shops: any[]) {
    if (shops.length === 0) return shops;

    const shopIds = shops.map(s => s.id || s._id);
    
    // Aggregate ratings from products for these shops
    const aggregations = await this.productModel.aggregate([
      { $match: { shopId: { $in: shopIds }, totalRatings: { $gt: 0 } } },
      { $group: {
          _id: '$shopId',
          totalRatings: { $sum: '$totalRatings' },
          totalScore: { $sum: { $multiply: ['$averageRating', '$totalRatings'] } }
        }
      }
    ]);

    const ratingMap = new Map(aggregations.map(a => [
      a._id, 
      { 
        totalRatings: a.totalRatings, 
        averageRating: a.totalRatings > 0 ? Math.round((a.totalScore / a.totalRatings) * 10) / 10 : 0 
      }
    ]));

    return shops.map(shop => {
      const stats = ratingMap.get(shop.id || shop._id) || { totalRatings: 0, averageRating: 0 };
      return {
        ...shop,
        averageRating: stats.averageRating,
        totalRatings: stats.totalRatings,
      };
    });
  }

  async getFavourites(customerId: string) {
    return this.prisma.favouriteShop.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addFavourite(customerId: string, shopId: string) {
    const existing = await this.prisma.favouriteShop.findUnique({
      where: { customerId_shopId: { customerId, shopId } },
    });
    if (existing) throw new ConflictException('Already in favourites');

    return this.prisma.favouriteShop.create({ data: { customerId, shopId } });
  }

  async removeFavourite(customerId: string, shopId: string) {
    await this.prisma.favouriteShop.delete({
      where: { customerId_shopId: { customerId, shopId } },
    });
    return { message: 'Removed from favourites' };
  }

  async getRecentShops(customerId: string) {
    return this.prisma.recentShop.findMany({
      where: { customerId },
      orderBy: { visitedAt: 'desc' },
      take: 20,
    });
  }

  async recordRecentShop(customerId: string, shopId: string) {
    const existing = await this.prisma.recentShop.findUnique({
      where: { customerId_shopId: { customerId, shopId } },
    });

    if (existing) {
      return this.prisma.recentShop.update({
        where: { customerId_shopId: { customerId, shopId } },
        data: { visitedAt: new Date() },
      });
    }

    return this.prisma.recentShop.create({ data: { customerId, shopId } });
  }

  async getOrders(customerId: string) {
    const orders = await this.prisma.orderHistory.findMany({
      where: { customerId },
      orderBy: { markedAt: 'desc' },
    });

    return Promise.all(
      orders.map(async (order) => {
        const product = await this.productModel.findById(order.productId).lean();
        const shop = await this.prisma.shop.findUnique({ where: { id: order.shopId }, select: { shopName: true } });
        return {
          ...order,
          status: 'DELIVERED', // Since it's fulfilled wishlist
          product,
          shop,
        };
      }),
    );
  }

  async deactivateAccount(customerId: string) {
    await this.prisma.customer.update({
      where: { id: customerId },
      data: { isActive: false },
    });
    return { message: 'Account deactivated' };
  }
}
