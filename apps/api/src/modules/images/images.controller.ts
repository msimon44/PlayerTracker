import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ImagesService } from './images.service';

@ApiTags('images')
@Controller('images')
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    @Get()
    @ApiOperation({ summary: 'List all available images' })
    @ApiResponse({ status: 200, description: 'List of image filenames' })
    async listImages() {
        return this.imagesService.listImages();
    }

    @Get(':filename')
    @ApiOperation({ summary: 'Get an image by filename' })
    @ApiParam({ name: 'filename', description: 'Name of the image file' })
    @ApiResponse({ status: 200, description: 'Image file' })
    @ApiResponse({ status: 404, description: 'Image not found' })
    async getImage(@Param('filename') filename: string, @Res() res: Response) {
        try {
            const imagePath = await this.imagesService.getImagePath(filename);
            return res.sendFile(imagePath);
        } catch (error) {
            throw new NotFoundException(`Image ${filename} not found`);
        }
    }
}
