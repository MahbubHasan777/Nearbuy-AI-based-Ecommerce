import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopMessageDto } from './dto/shop-message.dto';
export declare class ShopService {
    private prisma;
    private upload;
    constructor(prisma: PrismaService, upload: UploadService);
    register(dto: CreateShopDto): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        ownerEmail: string;
        shopName: string;
        ownerName: string;
        shopAddress: string;
        phone: string;
        lat: number;
        lng: number;
        status: import("@prisma/client").$Enums.ShopStatus;
        isActive: boolean;
        profilePic: string | null;
        bannerMsg: string | null;
        updatedAt: Date;
    }>;
    getProfile(shopId: string): Promise<{
        id: string;
        createdAt: Date;
        ownerEmail: string;
        shopName: string;
        ownerName: string;
        shopAddress: string;
        phone: string;
        lat: number;
        lng: number;
        status: import("@prisma/client").$Enums.ShopStatus;
        isActive: boolean;
        profilePic: string | null;
        bannerMsg: string | null;
    }>;
    updateProfile(shopId: string, dto: UpdateShopDto): Promise<{
        id: string;
        shopName: string;
        ownerName: string;
        shopAddress: string;
        phone: string;
        lat: number;
        lng: number;
    }>;
    uploadProfilePic(shopId: string, file: Express.Multer.File): Promise<{
        profilePic: string;
    }>;
    deleteProfilePic(shopId: string): Promise<{
        message: string;
    }>;
    updateBannerMsg(shopId: string, dto: ShopMessageDto): Promise<{
        bannerMsg: string | null;
    }>;
    deactivateAccount(shopId: string): Promise<{
        message: string;
    }>;
}
