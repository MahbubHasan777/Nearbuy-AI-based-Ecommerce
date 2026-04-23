import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopMessageDto } from './dto/shop-message.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ShopService {
  constructor(
    private prisma: PrismaService,
    private upload: UploadService,
  ) {}

  async register(dto: CreateShopDto) {
    const existing = await this.prisma.shop.findFirst({
      where: { OR: [{ ownerEmail: dto.ownerEmail }, { shopName: dto.shopName }] },
    });
    if (existing) throw new ConflictException('Email or shop name already taken');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const shop = await this.prisma.shop.create({
      data: {
        ownerName: dto.ownerName,
        ownerEmail: dto.ownerEmail,
        passwordHash,
        shopName: dto.shopName,
        shopAddress: dto.shopAddress,
        phone: dto.phone,
        lat: dto.lat,
        lng: dto.lng,
      },
    });

    const { passwordHash: _, ...result } = shop;
    return { ...result, message: 'Registration submitted. Awaiting approval.' };
  }

  async getProfile(shopId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
      select: {
        id: true,
        ownerName: true,
        ownerEmail: true,
        shopName: true,
        shopAddress: true,
        phone: true,
        lat: true,
        lng: true,
        status: true,
        isActive: true,
        profilePic: true,
        bannerMsg: true,
        createdAt: true,
      },
    });
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async getPublicProfile(shopId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId, status: 'APPROVED' },
      select: {
        id: true,
        shopName: true,
        shopAddress: true,
        profilePic: true,
        bannerMsg: true,
        lat: true,
        lng: true,
      },
    });
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async updateProfile(shopId: string, dto: UpdateShopDto) {
    return this.prisma.shop.update({
      where: { id: shopId },
      data: dto,
      select: { id: true, ownerName: true, shopName: true, shopAddress: true, phone: true, lat: true, lng: true },
    });
  }

  async uploadProfilePic(shopId: string, file: Express.Multer.File) {
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');

    if (shop.profilePic) this.upload.deleteFile(shop.profilePic);

    const path = await this.upload.compressAndSave(file, 'profiles/shops');
    await this.prisma.shop.update({ where: { id: shopId }, data: { profilePic: path } });
    return { profilePic: path };
  }

  async deleteProfilePic(shopId: string) {
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');

    if (shop.profilePic) {
      this.upload.deleteFile(shop.profilePic);
      await this.prisma.shop.update({ where: { id: shopId }, data: { profilePic: null } });
    }
    return { message: 'Profile picture deleted' };
  }

  async updateBannerMsg(shopId: string, dto: ShopMessageDto) {
    return this.prisma.shop.update({
      where: { id: shopId },
      data: { bannerMsg: dto.bannerMsg },
      select: { bannerMsg: true },
    });
  }

  async deleteAccount(shopId: string) {
    await this.prisma.shop.delete({ where: { id: shopId } });
    return { message: 'Account deleted successfully' };
  }
}
