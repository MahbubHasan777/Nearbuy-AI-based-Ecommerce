import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    createModerator(email: string, password: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
    }>;
    listModerators(): Promise<{
        id: string;
        email: string;
        createdAt: Date;
    }[]>;
    deleteModerator(id: string): Promise<{
        message: string;
    }>;
}
