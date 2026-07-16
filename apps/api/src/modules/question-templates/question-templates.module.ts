import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuestionTemplatesController } from './question-templates.controller';
import { QuestionTemplatesService } from './question-templates.service';

@Module({
    controllers: [QuestionTemplatesController],
    providers: [QuestionTemplatesService, PrismaService],
})
export class QuestionTemplatesModule {}
