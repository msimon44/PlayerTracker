import { NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { ImagesService } from './images.service';

jest.mock('fs', () => ({
    promises: {
        readdir: jest.fn(),
        access: jest.fn(),
    },
}));
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('ImagesService', () => {
    let service: ImagesService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new ImagesService();
    });

    describe('listImages', () => {
        it('returns only image files, filtering out other file types', async () => {
            mockedFs.readdir.mockResolvedValue(['logo.png', 'photo.jpg', 'readme.txt', 'archive.zip'] as any);

            const result = await service.listImages();

            expect(result.images).toEqual(['logo.png', 'photo.jpg']);
            expect(result.baseUrl).toBe('/public/images');
        });

        it('returns an empty list when the directory cannot be read', async () => {
            mockedFs.readdir.mockRejectedValue(new Error('ENOENT'));

            const result = await service.listImages();

            expect(result.images).toEqual([]);
            expect(result.baseUrl).toBe('/public/images');
        });
    });

    describe('getImagePath', () => {
        it('returns the full path when the file exists', async () => {
            mockedFs.access.mockResolvedValue(undefined);

            const result = await service.getImagePath('logo.png');

            expect(result).toContain('logo.png');
        });

        it('throws NotFoundException when the file does not exist', async () => {
            mockedFs.access.mockRejectedValue(new Error('ENOENT'));

            await expect(service.getImagePath('missing.png')).rejects.toThrow(NotFoundException);
        });
    });
});
