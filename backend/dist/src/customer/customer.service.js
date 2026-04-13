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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const geo_service_1 = require("../geo/geo.service");
const upload_service_1 = require("../upload/upload.service");
const bcrypt = __importStar(require("bcrypt"));
let CustomerService = class CustomerService {
    prisma;
    geo;
    upload;
    constructor(prisma, geo, upload) {
        this.prisma = prisma;
        this.geo = geo;
        this.upload = upload;
    }
    async register(dto) {
        const existing = await this.prisma.customer.findFirst({
            where: { OR: [{ email: dto.email }, { username: dto.username }] },
        });
        if (existing)
            throw new common_1.ConflictException('Email or username already taken');
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const customer = await this.prisma.customer.create({
            data: {
                username: dto.username,
                email: dto.email,
                passwordHash,
                fullName: dto.fullName,
                address: dto.address,
                gender: dto.gender,
                phone: dto.phone,
            },
        });
        const { passwordHash: _, ...result } = customer;
        return result;
    }
    async getProfile(customerId) {
        const customer = await this.prisma.customer.findUnique({
            where: { id: customerId },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                address: true,
                gender: true,
                phone: true,
                lat: true,
                lng: true,
                radiusMeters: true,
                profilePic: true,
                isActive: true,
                createdAt: true,
            },
        });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return customer;
    }
    async updateProfile(customerId, data) {
        const { password, ...rest } = data;
        return this.prisma.customer.update({
            where: { id: customerId },
            data: rest,
            select: { id: true, username: true, email: true, fullName: true, address: true, phone: true },
        });
    }
    async uploadProfilePic(customerId, file) {
        const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        if (customer.profilePic) {
            this.upload.deleteFile(customer.profilePic);
        }
        const path = await this.upload.compressAndSave(file, 'profiles/customers');
        await this.prisma.customer.update({ where: { id: customerId }, data: { profilePic: path } });
        return { profilePic: path };
    }
    async deleteProfilePic(customerId) {
        const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        if (customer.profilePic) {
            this.upload.deleteFile(customer.profilePic);
            await this.prisma.customer.update({ where: { id: customerId }, data: { profilePic: null } });
        }
        return { message: 'Profile picture deleted' };
    }
    async updateLocation(customerId, dto) {
        return this.prisma.customer.update({
            where: { id: customerId },
            data: { lat: dto.lat, lng: dto.lng, ...(dto.radiusMeters && { radiusMeters: dto.radiusMeters }) },
            select: { lat: true, lng: true, radiusMeters: true },
        });
    }
    async getNearbyShops(customerId) {
        const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
        if (!customer || !customer.lat || !customer.lng) {
            throw new common_1.BadRequestException('Location not set');
        }
        const shops = await this.prisma.shop.findMany({
            where: { status: 'APPROVED', isActive: true },
            select: {
                id: true,
                shopName: true,
                shopAddress: true,
                lat: true,
                lng: true,
                profilePic: true,
                bannerMsg: true,
            },
        });
        return this.geo.filterByRadius(shops, customer.lat, customer.lng, customer.radiusMeters);
    }
    async getFavourites(customerId) {
        return this.prisma.favouriteShop.findMany({
            where: { customerId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async addFavourite(customerId, shopId) {
        const existing = await this.prisma.favouriteShop.findUnique({
            where: { customerId_shopId: { customerId, shopId } },
        });
        if (existing)
            throw new common_1.ConflictException('Already in favourites');
        return this.prisma.favouriteShop.create({ data: { customerId, shopId } });
    }
    async removeFavourite(customerId, shopId) {
        await this.prisma.favouriteShop.delete({
            where: { customerId_shopId: { customerId, shopId } },
        });
        return { message: 'Removed from favourites' };
    }
    async getRecentShops(customerId) {
        return this.prisma.recentShop.findMany({
            where: { customerId },
            orderBy: { visitedAt: 'desc' },
            take: 20,
        });
    }
    async recordRecentShop(customerId, shopId) {
        const existing = await this.prisma.recentShop.findUnique({
            where: { customerId_shopId: { customerId, shopId } },
        });
        if (existing) {
            return this.prisma.recentShop.update({
                where: { customerId_shopId: { customerId, shopId } },
                data: { visitedAt: new Date() },
            });
        }
        return this.prisma.recentShop.create({ data: { customerId, shopId } });
    }
    async getOrders(customerId) {
        return this.prisma.orderHistory.findMany({
            where: { customerId },
            orderBy: { markedAt: 'desc' },
        });
    }
    async deactivateAccount(customerId) {
        await this.prisma.customer.update({
            where: { id: customerId },
            data: { isActive: false },
        });
        return { message: 'Account deactivated' };
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        geo_service_1.GeoService,
        upload_service_1.UploadService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map