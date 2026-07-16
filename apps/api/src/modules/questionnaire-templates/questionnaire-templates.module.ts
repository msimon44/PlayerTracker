import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuestionnaireTemplatesController } from './questionnaire-templates.controller';
import { QuestionnaireTemplatesService } from './questionnaire-templates.service';

@Module({
    controllers: [QuestionnaireTemplatesController],
    providers: [QuestionnaireTemplatesService, PrismaService],
})
export class QuestionnaireTemplatesModule {}
