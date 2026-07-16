import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SensitivePlayerDataController } from './sensitive-player-data.controller';
import { SensitivePlayerDataService } from './sensitive-player-data.service';

@Module({
    controllers: [SensitivePlayerDataController],
    providers: [SensitivePlayerDataService, PrismaService],
})
export class SensitivePlayerDataModule {}
