"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mailer_service_1 = require("../mailer/mailer.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    prisma;
    mailer;
    constructor(prisma, mailer) {
        this.prisma = prisma;
        this.mailer = mailer;
    }
    generateToken() {
        return crypto.randomBytes(48).toString('hex');
    }
    async cleanExpiredTokens(userId, userType) {
        const tokens = await this.prisma.authToken.findMany({
            where: { userId, userType },
            orderBy: { createdAt: 'asc' },
        });
        if (tokens.length > 10) {
            const expired = tokens.filter((t) => t.expiresAt < new Date());
            if (expired.length > 0) {
                await this.prisma.authToken.deleteMany({
                    where: { id: { in: expired.map((t) => t.id) } },
                });
            }
        }
    }
    async login(dto) {
        const { email, password, userType } = dto;
        let user = null;
        if (userType === 'ADMIN') {
            user = await this.prisma.admin.findUnique({ where: { email } });
        }
        else if (userType === 'MODERATOR') {
            user = await this.prisma.moderator.findUnique({ where: { email } });
        }
        else if (userType === 'SHOP') {
            user = await this.prisma.shop.findUnique({ where: { ownerEmail: email } });
            if (user && user.status !== 'APPROVED') {
                throw new common_1.UnauthorizedException('Shop not approved yet');
            }
        }
        else if (userType === 'CUSTOMER') {
            user = await this.prisma.customer.findUnique({ where: { email } });
            if (user && !user.isActive) {
                throw new common_1.UnauthorizedException('Account is deactivated');
            }
        }
        else {
            throw new common_1.BadRequestException('Invalid userType');
        }
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const token = this.generateToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.prisma.authToken.create({
            data: {
                token,
                userId: user.id,
                userType: userType,
                expiresAt,
            },
        });
        await this.cleanExpiredTokens(user.id, userType);
        return token;
    }
    async logout(token) {
        await this.prisma.authToken.delete({ where: { token } });
    }
    async logoutAll(userId, userType) {
        await this.prisma.authToken.deleteMany({ where: { userId, userType } });
    }
    async getSessions(userId, userType) {
        return this.prisma.authToken.findMany({
            where: { userId, userType, expiresAt: { gt: new Date() } },
            select: { id: true, createdAt: true, expiresAt: true },
        });
    }
    async forgotPassword(email) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.oTP.create({ data: { email, otp, expiresAt } });
        await this.mailer.sendOtp(email, otp);
    }
    async verifyOtp(email, otp) {
        const record = await this.prisma.oTP.findFirst({
            where: { email, otp, used: false, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'desc' },
        });
        if (!record)
            throw new common_1.BadRequestException('Invalid or expired OTP');
        return true;
    }
    async resetPassword(email, otp, newPassword) {
        const record = await this.prisma.oTP.findFirst({
            where: { email, otp, used: false, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'desc' },
        });
        if (!record)
            throw new common_1.BadRequestException('Invalid or expired OTP');
        const hash = await bcrypt.hash(newPassword, 12);
        const customer = await this.prisma.customer.findUnique({ where: { email } });
        if (customer) {
            await this.prisma.customer.update({ where: { email }, data: { passwordHash: hash } });
        }
        else {
            const shop = await this.prisma.shop.findUnique({ where: { ownerEmail: email } });
            if (shop) {
                await this.prisma.shop.update({ where: { ownerEmail: email }, data: { passwordHash: hash } });
            }
        }
        await this.prisma.oTP.update({ where: { id: record.id }, data: { used: true } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailer_service_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map