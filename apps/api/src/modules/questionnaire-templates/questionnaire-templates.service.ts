import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionnaireTemplateDto } from './dto/create-questionnaire-template.dto';
import { UpdateQuestionnaireTemplateDto } from './dto/update-questionnaire-template.dto';
import {
    QuestionnaireTemplateResponseDto,
    QuestionnaireTemplateListItemDto,
} from './dto/questionnaire-template-response.dto';

@Injectable()
export class QuestionnaireTemplatesService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<QuestionnaireTemplateListItemDto[]> {
        const templates = await this.prisma.questionnaireTemplate.findMany({
            select: {
                id: true,
                title: true,
                sportId: true,
                createdAt: true,
                updatedAt: true,
                sport: { select: { id: true, name: true } },
                _count: { select: { questions: true } },
            },
        });
        return templates.map((t) => ({ ...t, _count: t._count }));
    }

    async findOne(id: number): Promise<QuestionnaireTemplateResponseDto> {
        const template = await this.prisma.questionnaireTemplate.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                sportId: true,
                createdAt: true,
                updatedAt: true,
                sport: { select: { id: true, name: true } },
                questions: { select: { id: true, title: true, type: true, order: true }, orderBy: { order: 'asc' } },
            },
        });
        if (!template) throw new NotFoundException('Questionnaire template not found');
        return template;
    }

    async create(createDto: CreateQuestionnaireTemplateDto): Promise<QuestionnaireTemplateResponseDto> {
        const template = await this.prisma.questionnaireTemplate.create({
            data: createDto,
            select: {
                id: true,
                title: true,
                sportId: true,
                createdAt: true,
                updatedAt: true,
                sport: { select: { id: true, name: true } },
                questions: { select: { id: true, title: true, type: true, order: true }, orderBy: { order: 'asc' } },
            },
        });
        return template;
    }

    async update(id: number, updateDto: UpdateQuestionnaireTemplateDto): Promise<QuestionnaireTemplateResponseDto> {
        const template = await this.prisma.questionnaireTemplate.update({
            where: { id },
            data: updateDto,
            select: {
                id: true,
                title: true,
                sportId: true,
                createdAt: true,
                updatedAt: true,
                sport: { select: { id: true, name: true } },
                questions: { select: { id: true, title: true, type: true, order: true }, orderBy: { order: 'asc' } },
            },
        });
        return template;
    }

    async remove(id: number): Promise<QuestionnaireTemplateResponseDto> {
        const template = await this.prisma.questionnaireTemplate.delete({
            where: { id },
            select: {
                id: true,
                title: true,
                sportId: true,
                createdAt: true,
                updatedAt: true,
                sport: { select: { id: true, name: true } },
                questions: { select: { id: true, title: true, type: true, order: true }, orderBy: { order: 'asc' } },
            },
        });
        return template;
    }
}
