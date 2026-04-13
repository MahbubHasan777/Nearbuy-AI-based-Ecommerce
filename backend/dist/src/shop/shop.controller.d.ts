import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopMessageDto } from './dto/shop-message.dto';
export declare class ShopController {
    private shopService;
    constructor(shopService: ShopService);
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
    getProfile(req: any): Promise<{
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
    updateProfile(req: any, dto: UpdateShopDto): Promise<{
        id: string;
        shopName: string;
        ownerName: string;
        shopAddress: string;
        phone: string;
        lat: number;
        lng: number;
    }>;
    uploadPic(req: any, file: Express.Multer.File): Promise<{
        profilePic: string;
    }>;
    updatePic(req: any, file: Express.Multer.File): Promise<{
        profilePic: string;
    }>;
    deletePic(req: any): Promise<{
        message: string;
    }>;
    updateMessage(req: any, dto: ShopMessageDto): Promise<{
        bannerMsg: string | null;
    }>;
    deactivate(req: any): Promise<{
        message: string;
    }>;
}
