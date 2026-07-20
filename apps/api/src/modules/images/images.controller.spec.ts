import { NotFoundException } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

describe('ImagesController', () => {
    let controller: ImagesController;
    let service: { listImages: jest.Mock; getImagePath: jest.Mock };
    let res: { sendFile: jest.Mock };

    beforeEach(() => {
        service = { listImages: jest.fn(), getImagePath: jest.fn() };
        controller = new ImagesController(service as unknown as ImagesService);
        res = { sendFile: jest.fn() };
    });

    it('listImages delegates to the service', async () => {
        service.listImages.mockResolvedValue({ images: ['logo.png'], baseUrl: '/public/images' });

        const result = await controller.listImages();

        expect(result).toEqual({ images: ['logo.png'], baseUrl: '/public/images' });
    });

    describe('getImage', () => {
        it('sends the file when it exists', async () => {
            service.getImagePath.mockResolvedValue('/app/public/images/logo.png');

            await controller.getImage('logo.png', res as any);

            expect(res.sendFile).toHaveBeenCalledWith('/app/public/images/logo.png');
        });

        it('throws a NotFoundException when the underlying service rejects', async () => {
            service.getImagePath.mockRejectedValue(new NotFoundException('Image missing.png not found'));

            await expect(controller.getImage('missing.png', res as any)).rejects.toThrow(NotFoundException);
        });
    });
});
