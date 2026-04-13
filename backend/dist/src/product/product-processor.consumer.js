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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let ProductProcessor = class ProductProcessor extends bullmq_1.WorkerHost {
    productModel;
    constructor(productModel) {
        super();
        this.productModel = productModel;
    }
    async process(job) {
        const { productId, images } = job.data;
        try {
            const keywords = await this.generateKeywords(images);
            await this.productModel.findByIdAndUpdate(productId, {
                imageKeywords: keywords,
            });
        }
        catch {
        }
    }
    async generateKeywords(images) {
        const allKeywords = [];
        for (const imagePath of images.slice(0, 3)) {
            const fullPath = path.join(process.cwd(), 'uploads', imagePath);
            if (!fs.existsSync(fullPath))
                continue;
            const imageBuffer = fs.readFileSync(fullPath);
            const description = await this.getDescription(imageBuffer);
            const keywords = await this.extractKeywords(description);
            allKeywords.push(...keywords);
        }
        const unique = [...new Set(allKeywords)].slice(0, 10);
        return unique;
    }
    async getDescription(imageBuffer) {
        const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
        const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'moondream',
                prompt: 'Describe this image in detail focusing on objects, colors, and the environment.',
                images: [imageBuffer.toString('base64')],
                stream: false,
            }),
        });
        const data = (await response.json());
        return data.response || '';
    }
    async extractKeywords(description) {
        const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
        const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'phi3:mini',
                prompt: `Based on this description: "${description}", provide a list of 10-15 SEO keywords. Return ONLY the keywords separated by commas. No sentences, no numbers, no introduction. Make the keyword as small as possible.`,
                stream: false,
            }),
        });
        const data = (await response.json());
        const raw = data.response || '';
        return raw
            .split(',')
            .map((k) => k.trim().replace(/\n/g, '').replace(/[.*#]/g, ''))
            .filter((k) => k.length > 2)
            .slice(0, 10);
    }
};
exports.ProductProcessor = ProductProcessor;
exports.ProductProcessor = ProductProcessor = __decorate([
    (0, bullmq_1.Processor)('product-processing'),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductProcessor);
//# sourceMappingURL=product-processor.consumer.js.map