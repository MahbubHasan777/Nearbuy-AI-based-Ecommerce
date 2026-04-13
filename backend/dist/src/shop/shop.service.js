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
exports.ShopService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const upload_service_1 = require("../upload/upload.service");
const bcrypt = __importStar(require("bcrypt"));
let ShopService = class ShopService {
    prisma;
    upload;
    constructor(prisma, upload) {
        this.prisma = prisma;
        this.upload = upload;
    }
    async register(dto) {
        const existing = await this.prisma.shop.findFirst({
            where: { OR: [{ ownerEmail: dto.ownerEmail }, { shopName: dto.shopName }] },
        });
        if (existing)
            throw new common_1.ConflictException('Email or shop name already taken');
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
    async getProfile(shopId) {
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
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        return shop;
    }
    async updateProfile(shopId, dto) {
        return this.prisma.shop.update({
            where: { id: shopId },
            data: dto,
            select: { id: true, ownerName: true, shopName: true, shopAddress: true, phone: true, lat: true, lng: true },
        });
    }
    async uploadProfilePic(shopId, file) {
        const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        if (shop.profilePic)
            this.upload.deleteFile(shop.profilePic);
        const path = await this.upload.compressAndSave(file, 'profiles/shops');
        await this.prisma.shop.update({ where: { id: shopId }, data: { profilePic: path } });
        return { profilePic: path };
    }
    async deleteProfilePic(shopId) {
        const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        if (shop.profilePic) {
            this.upload.deleteFile(shop.profilePic);
            await this.prisma.shop.update({ where: { id: shopId }, data: { profilePic: null } });
        }
        return { message: 'Profile picture deleted' };
    }
    async updateBannerMsg(shopId, dto) {
        return this.prisma.shop.update({
            where: { id: shopId },
            data: { bannerMsg: dto.bannerMsg },
            select: { bannerMsg: true },
        });
    }
    async deactivateAccount(shopId) {
        await this.prisma.shop.update({ where: { id: shopId }, data: { isActive: false } });
        return { message: 'Account deactivated' };
    }
};
exports.ShopService = ShopService;
exports.ShopService = ShopService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        upload_service_1.UploadService])
], ShopService);
//# sourceMappingURL=shop.service.js.map