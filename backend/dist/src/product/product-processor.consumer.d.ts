import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Model } from 'mongoose';
import { ProductDocument } from './schemas/product.schema';
export declare class ProductProcessor extends WorkerHost {
    private productModel;
    constructor(productModel: Model<ProductDocument>);
    process(job: Job<{
        productId: string;
        images: string[];
    }>): Promise<void>;
    private generateKeywords;
    private getDescription;
    private extractKeywords;
}
