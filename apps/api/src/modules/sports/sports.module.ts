import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SportsController } from './sports.controller';
import { SportsService } from './sports.service';

@Module({
    controllers: [SportsController],
    providers: [SportsService, PrismaService],
})
export class SportsModule {}
