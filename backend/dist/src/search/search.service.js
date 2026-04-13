"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../product/schemas/product.schema");
const prisma_service_1 = require("../prisma/prisma.service");
const geo_service_1 = require("../geo/geo.service");
let SearchService = class SearchService {
    productModel;
    prisma;
    geo;
    constructor(productModel, prisma, geo) {
        this.productModel = productModel;
        this.prisma = prisma;
        this.geo = geo;
    }
    async search(query, customerId, params) {
        const customer = await this.prisma.customer.findUnique({
            where: { id: customerId },
        });
        const radius = params['radius'] ? Number(params['radius']) : (customer?.radiusMeters ?? 5000);
        const allShops = await this.prisma.shop.findMany({
            where: { status: 'APPROVED', isActive: true },
        });
        const nearbyShopIds = customer?.lat && customer?.lng
            ? this.geo
                .filterByRadius(allShops, customer.lat, customer.lng, radius)
                .map((s) => s.id)
            : allShops.map((s) => s.id);
        const products = await this.productModel.find({
            shopId: { $in: nearbyShopIds },
        });
        const q = query.toLowerCase().trim();
        const scored = products.map((p) => {
            const name = p.name.toLowerCase();
            const keywords = (p.imageKeywords || []).map((k) => k.toLowerCase());
            let score = 0;
            if (name === q) {
                score = 100;
            }
            else {
                const qTokens = q.split(' ');
                const nameTokens = name.split(' ');
                const prefixMatches = qTokens.filter((qt) => nameTokens.some((nt) => nt.startsWith(qt))).length;
                if (prefixMatches > 0)
                    score += (prefixMatches / qTokens.length) * 75;
                const fuzzyScore = this.maxSimilarity(q, name);
                if (fuzzyScore >= 0.6)
                    score += fuzzyScore * 50;
                const kwMatches = qTokens.filter((qt) => keywords.some((kw) => kw.includes(qt))).length;
                if (kwMatches === 1)
                    score += 10;
                else if (kwMatches === 2)
                    score += 30;
                else if (kwMatches >= 3)
                    score += 50;
            }
            if (params['minPrice'] && p.price < Number(params['minPrice']))
                return null;
            if (params['maxPrice'] && p.price > Number(params['maxPrice']))
                return null;
            if (params['minRating'] && p.averageRating < Number(params['minRating']))
                return null;
            if (params['maxRating'] && p.averageRating > Number(params['maxRating']))
                return null;
            if (score === 0)
                return null;
            return { product: p, score };
        });
        const filtered = scored.filter(Boolean);
        filtered.sort((a, b) => b.score - a.score);
        const sorted = this.applySort(filtered.map((f) => f.product), params['sort']);
        const shopMap = new Map(allShops.map((s) => [s.id, s]));
        return {
            query,
            radius_km: radius / 1000,
            total: sorted.length,
            results: sorted.map((p) => {
                const shop = shopMap.get(p.shopId);
                const dist = customer?.lat && customer?.lng && shop
                    ? this.geo.haversine(customer.lat, customer.lng, shop.lat, shop.lng)
                    : null;
                return {
                    productId: p._id,
                    productName: p.name,
                    price: p.price,
                    discountPrice: p.discountPrice,
                    discountPercentage: p.discountPercentage,
                    status: p.status,
                    images: p.images,
                    averageRating: p.averageRating,
                    totalRatings: p.totalRatings,
                    shop: shop
                        ? {
                            shopId: shop.id,
                            shopName: shop.shopName,
                            distance_km: dist ? Math.round((dist / 1000) * 10) / 10 : null,
                        }
                        : null,
                };
            }),
        };
    }
    async searchInShop(shopId, query, params) {
        const products = await this.productModel.find({ shopId });
        const q = query.toLowerCase().trim();
        const scored = products
            .map((p) => {
            const name = p.name.toLowerCase();
            let score = 0;
            if (name === q)
                score = 100;
            else {
                const qTokens = q.split(' ');
                const nameTokens = name.split(' ');
                const prefixMatches = qTokens.filter((qt) => nameTokens.some((nt) => nt.startsWith(qt))).length;
                if (prefixMatches > 0)
                    score += (prefixMatches / qTokens.length) * 75;
                const fuzzyScore = this.maxSimilarity(q, name);
                if (fuzzyScore >= 0.6)
                    score += fuzzyScore * 50;
            }
            return score > 0 ? { product: p, score } : null;
        })
            .filter(Boolean);
        scored.sort((a, b) => b.score - a.score);
        return { query, total: scored.length, results: scored.map((s) => s.product) };
    }
    applySort(products, sort) {
        if (!sort)
            return products;
        const map = {
            name_asc: (a, b) => a.name.localeCompare(b.name),
            name_desc: (a, b) => b.name.localeCompare(a.name),
            price_asc: (a, b) => a.price - b.price,
            price_desc: (a, b) => b.price - a.price,
            rating_desc: (a, b) => b.averageRating - a.averageRating,
            sold_desc: (a, b) => b.totalSold - a.totalSold,
            date_desc: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        };
        return [...products].sort(map[sort] || (() => 0));
    }
    levenshtein(a, b) {
        const dp = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                dp[i][j] =
                    a[i - 1] === b[j - 1]
                        ? dp[i - 1][j - 1]
                        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
        return dp[a.length][b.length];
    }
    similarity(a, b) {
        const maxLen = Math.max(a.length, b.length);
        if (maxLen === 0)
            return 1;
        return 1 - this.levenshtein(a, b) / maxLen;
    }
    maxSimilarity(query, name) {
        const qTokens = query.split(' ');
        const nTokens = name.split(' ');
        let max = 0;
        for (const qt of qTokens) {
            for (const nt of nTokens) {
                const s = this.similarity(qt, nt);
                if (s > max)
                    max = s;
            }
        }
        return max;
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        prisma_service_1.PrismaService,
        geo_service_1.GeoService])
], SearchService);
//# sourceMappingURL=search.service.js.map