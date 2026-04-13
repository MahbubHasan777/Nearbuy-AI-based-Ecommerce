import { PrismaService } from '../prisma/prisma.service';
import { GeoService } from '../geo/geo.service';
import { UploadService } from '../upload/upload.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class CustomerService {
    private prisma;
    private geo;
    private upload;
    constructor(prisma: PrismaService, geo: GeoService, upload: UploadService);
    register(dto: CreateCustomerDto): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        phone: string;
        lat: number | null;
        lng: number | null;
        isActive: boolean;
        profilePic: string | null;
        updatedAt: Date;
        username: string;
        fullName: string;
        address: string;
        gender: import("@prisma/client").$Enums.Gender;
        radiusMeters: number;
    }>;
    getProfile(customerId: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        phone: string;
        lat: number | null;
        lng: number | null;
        isActive: boolean;
        profilePic: string | null;
        username: string;
        fullName: string;
        address: string;
        gender: import("@prisma/client").$Enums.Gender;
        radiusMeters: number;
    }>;
    updateProfile(customerId: string, data: Partial<CreateCustomerDto>): Promise<{
        id: string;
        email: string;
        phone: string;
        username: string;
        fullName: string;
        address: string;
    }>;
    uploadProfilePic(customerId: string, file: Express.Multer.File): Promise<{
        profilePic: string;
    }>;
    deleteProfilePic(customerId: string): Promise<{
        message: string;
    }>;
    updateLocation(customerId: string, dto: UpdateLocationDto): Promise<{
        lat: number | null;
        lng: number | null;
        radiusMeters: number;
    }>;
    getNearbyShops(customerId: string): Promise<({
        id: string;
        shopName: string;
        shopAddress: string;
        lat: number;
        lng: number;
        profilePic: string | null;
        bannerMsg: string | null;
    } & {
        distanceMeters: number;
    })[]>;
    getFavourites(customerId: string): Promise<{
        id: string;
        createdAt: Date;
        customerId: string;
        shopId: string;
    }[]>;
    addFavourite(customerId: string, shopId: string): Promise<{
        id: string;
        createdAt: Date;
        customerId: string;
        shopId: string;
    }>;
    removeFavourite(customerId: string, shopId: string): Promise<{
        message: string;
    }>;
    getRecentShops(customerId: string): Promise<{
        id: string;
        customerId: string;
        shopId: string;
        visitedAt: Date;
    }[]>;
    recordRecentShop(customerId: string, shopId: string): Promise<{
        id: string;
        customerId: string;
        shopId: string;
        visitedAt: Date;
    }>;
    getOrders(customerId: string): Promise<{
        id: string;
        customerId: string;
        shopId: string;
        productId: string;
        productName: string;
        price: number;
        markedAt: Date;
    }[]>;
    deactivateAccount(customerId: string): Promise<{
        message: string;
    }>;
}
