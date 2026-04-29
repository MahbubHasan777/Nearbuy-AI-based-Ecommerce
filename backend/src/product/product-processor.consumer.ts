import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import * as fs from 'fs';
import * as path from 'path';

@Processor('product-processing')
export class ProductProcessor extends WorkerHost {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {
    super();
  }

  async process(job: Job<{ productId: string; images: string[] }>) {
    const { productId, images } = job.data;

    try {
      const keywords = await this.generateKeywords(images);

      await this.productModel.findByIdAndUpdate(productId, {
        imageKeywords: keywords,
      });

    } catch (error) {
      console.error('Failed to process product images:', error);
    }
  }

  private async generateKeywords(images: string[]): Promise<string[]> {
    const allKeywords: string[] = [];

    for (const imagePath of images.slice(0, 3)) {
      const fullPath = path.join(process.cwd(), 'uploads', imagePath);
      if (!fs.existsSync(fullPath)) continue;

      const imageBuffer = fs.readFileSync(fullPath);
      const description = await this.getDescription(imageBuffer);
      const keywords = await this.extractKeywords(description);
      allKeywords.push(...keywords);
    }

    const unique = [...new Set(allKeywords)].slice(0, 10);
    return unique;
  }

  private async getDescription(imageBuffer: Buffer): Promise<string> {
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

    const data = (await response.json()) as { response: string };
    return data.response || '';
  }

  private async extractKeywords(description: string): Promise<string[]> {
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

    const data = (await response.json()) as { response: string };
    const raw = data.response || '';

    return raw
      .split(',')
      .map((k) => k.trim().replace(/\n/g, '').replace(/[.*#]/g, ''))
      .filter((k) => k.length > 2)
      .slice(0, 10);
  }
}
