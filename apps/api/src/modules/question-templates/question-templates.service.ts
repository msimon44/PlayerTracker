import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionTemplateDto } from './dto/create-question-template.dto';
import { UpdateQuestionTemplateDto } from './dto/update-question-template.dto';
import { QuestionTemplateResponseDto, QuestionTemplateListItemDto } from './dto/question-template-response.dto';

@Injectable()
export class QuestionTemplatesService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<QuestionTemplateListItemDto[]> {
        const templates = await this.prisma.questionTemplate.findMany({
            select: {
                id: true,
                title: true,
                type: true,
                order: true,
                templateId: true,
                template: { select: { id: true, title: true, sportId: true } },
            },
            orderBy: { order: 'asc' },
        });
        return templates;
    }

    async findOne(id: number): Promise<QuestionTemplateResponseDto> {
        const template = await this.prisma.questionTemplate.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                type: true,
                order: true,
                templateId: true,
                template: { select: { id: true, title: true, sportId: true } },
            },
        });
        if (!template) throw new NotFoundException('Question template not found');
        return template;
    }

    async create(createDto: CreateQuestionTemplateDto): Promise<QuestionTemplateResponseDto> {
        const template = await this.prisma.questionTemplate.create({
            data: createDto,
            select: {
                id: true,
                title: true,
                type: true,
                order: true,
                templateId: true,
                template: { select: { id: true, title: true, sportId: true } },
            },
        });
        return template;
    }

    async update(id: number, updateDto: UpdateQuestionTemplateDto): Promise<QuestionTemplateResponseDto> {
        const template = await this.prisma.questionTemplate.update({
            where: { id },
            data: updateDto,
            select: {
                id: true,
                title: true,
                type: true,
                order: true,
                templateId: true,
                template: { select: { id: true, title: true, sportId: true } },
            },
        });
        return template;
    }

    async remove(id: number): Promise<QuestionTemplateResponseDto> {
        const template = await this.prisma.questionTemplate.delete({
            where: { id },
            select: {
                id: true,
                title: true,
                type: true,
                order: true,
                templateId: true,
                template: { select: { id: true, title: true, sportId: true } },
            },
        });
        return template;
    }
}
