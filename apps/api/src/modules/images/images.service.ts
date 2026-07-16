import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
    private readonly imagesPath = join(process.cwd(), 'public', 'images');

    async listImages(): Promise<{ images: string[]; baseUrl: string }> {
        try {
            const files = await fs.readdir(this.imagesPath);
            const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));

            return {
                images: imageFiles,
                baseUrl: '/public/images',
            };
        } catch (error) {
            return { images: [], baseUrl: '/public/images' };
        }
    }

    async getImagePath(filename: string): Promise<string> {
        const imagePath = join(this.imagesPath, filename);

        try {
            await fs.access(imagePath);
            return imagePath;
        } catch (error) {
            throw new NotFoundException(`Image ${filename} not found`);
        }
    }
}
