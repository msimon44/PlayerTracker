import { Module } from '@nestjs/common';
import { QuestionnairesService } from './questionnaires.service';
import { QuestionnairesController } from './questionnaires.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    controllers: [QuestionnairesController],
    providers: [QuestionnairesService, PrismaService],
})
export class QuestionnairesModule {}
