import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class CustomerController {
    private customerService;
    constructor(customerService: CustomerService);
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
    getProfile(req: any): Promise<{
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
    updateProfile(req: any, body: any): Promise<{
        id: string;
        email: string;
        phone: string;
        username: string;
        fullName: string;
        address: string;
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
    updateLocation(req: any, dto: UpdateLocationDto): Promise<{
        lat: number | null;
        lng: number | null;
        radiusMeters: number;
    }>;
    nearbyShops(req: any): Promise<({
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
    getFavourites(req: any): Promise<{
        id: string;
        createdAt: Date;
        customerId: string;
        shopId: string;
    }[]>;
    addFavourite(req: any, shopId: string): Promise<{
        id: string;
        createdAt: Date;
        customerId: string;
        shopId: string;
    }>;
    removeFavourite(req: any, shopId: string): Promise<{
        message: string;
    }>;
    getRecentShops(req: any): Promise<{
        id: string;
        customerId: string;
        shopId: string;
        visitedAt: Date;
    }[]>;
    getOrders(req: any): Promise<{
        id: string;
        customerId: string;
        shopId: string;
        productId: string;
        productName: string;
        price: number;
        markedAt: Date;
    }[]>;
    deactivate(req: any): Promise<{
        message: string;
    }>;
}
