import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, VerifyOtpDto, ResetPasswordDto } from './dto/forgot-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, res: Response): Promise<{
        message: string;
    }>;
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
    logoutAll(req: any, res: Response): Promise<{
        message: string;
    }>;
    getSessions(req: any): Promise<{
        id: string;
        createdAt: Date;
        expiresAt: Date;
    }[]>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
