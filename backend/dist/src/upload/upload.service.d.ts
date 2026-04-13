export declare class UploadService {
    private readonly uploadDir;
    private ensureDir;
    compressAndSave(file: Express.Multer.File, subDir: string): Promise<string>;
    deleteFile(relativePath: string): void;
}
