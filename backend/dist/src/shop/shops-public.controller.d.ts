import { Model } from 'mongoose';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerService } from '../customer/customer.service';
export declare class ShopsPublicController {
    private prisma;
    private productModel;
    private customerService;
    constructor(prisma: PrismaService, productModel: Model<any>, customerService: CustomerService);
    getShop(id: string): import("@prisma/client").Prisma.Prisma__ShopClient<{
        id: string;
        shopName: string;
        shopAddress: string;
        lat: number;
        lng: number;
        status: import("@prisma/client").$Enums.ShopStatus;
        profilePic: string | null;
        bannerMsg: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getPopular(id: string): import("mongoose").Query<any[], any, {}, any, "find", {}>;
    getTopRated(id: string): import("mongoose").Query<any[], any, {}, any, "find", {}>;
    recordVisit(id: string, req: any): Promise<{
        id: string;
        customerId: string;
        shopId: string;
        visitedAt: Date;
    }>;
}
