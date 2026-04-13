import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { LoginDto } from './dto/login.dto';
import { UserType } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private mailer;
    constructor(prisma: PrismaService, mailer: MailerService);
    private generateToken;
    private cleanExpiredTokens;
    login(dto: LoginDto): Promise<string>;
    logout(token: string): Promise<void>;
    logoutAll(userId: string, userType: UserType): Promise<void>;
    getSessions(userId: string, userType: UserType): Promise<{
        id: string;
        createdAt: Date;
        expiresAt: Date;
    }[]>;
    forgotPassword(email: string): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<void>;
}
