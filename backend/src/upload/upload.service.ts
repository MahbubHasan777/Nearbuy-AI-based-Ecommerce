import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private readonly uploadDir = process.env.UPLOAD_DIR || 'uploads';

  private ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  async compressAndSave(
    file: Express.Multer.File,
    subDir: string,
  ): Promise<string> {
    const dir = path.join(process.cwd(), this.uploadDir, subDir);
    this.ensureDir(dir);

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const outputPath = path.join(dir, filename);

    await sharp(file.buffer)
      .resize(800, 600, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    return `${subDir}/${filename}`;
  }

  deleteFile(relativePath: string) {
    const fullPath = path.join(process.cwd(), this.uploadDir, relativePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
}
