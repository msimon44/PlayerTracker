import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Questionnaire } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionResponseDto, QuestionListItemDto } from './dto/question-response.dto';

@Injectable()
export class QuestionsService {
    constructor(private readonly prisma: PrismaService) {}

    private isQuestionnaireClosed(questionnaire: Pick<Questionnaire, 'status' | 'closesAt'>): boolean {
        return (
            questionnaire.status === 'COMPLETED' ||
            questionnaire.status === 'ARCHIVED' ||
            (questionnaire.closesAt !== null && questionnaire.closesAt <= new Date())
        );
    }

    private isQuestionnaireEditable(questionnaire: Pick<Questionnaire, 'status' | 'closesAt'>): boolean {
        return questionnaire.status === 'DRAFT' && !this.isQuestionnaireClosed(questionnaire);
    }

    private async assertQuestionnaireEditable(questionnaireId: number) {
        const questionnaire = await this.prisma.questionnaire.findUnique({
            where: { id: questionnaireId },
            select: { status: true, closesAt: true },
        });
        if (!questionnaire) throw new NotFoundException('Questionnaire not found');
        if (!this.isQuestionnaireEditable(questionnaire)) {
            throw new BadRequestException('Only draft questionnaires can be edited');
        }
    }

    async findAll(): Promise<QuestionListItemDto[]> {
        const questions = await this.prisma.question.findMany({
            select: {
                id: true,
                title: true,
                type: true,
                isRequired: true,
                order: true,
                questionnaireId: true,
                createdAt: true,
                updatedAt: true,
                _count: { select: { answers: true } },
            },
        });
        return questions.map((q) => ({ ...q, _count: q._count }));
    }

    async findOne(id: number): Promise<QuestionResponseDto> {
        const question = await this.prisma.question.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                type: true,
                isRequired: true,
                order: true,
                questionnaireId: true,
                createdAt: true,
                updatedAt: true,
                questionnaire: { select: { id: true, title: true, status: true, teamId: true } },
                answers: { select: { id: true, playerId: true, value: true, submittedAt: true } },
            },
        });
        if (!question) throw new NotFoundException('Question not found');
        return question;
    }

    async create(createQuestionDto: CreateQuestionDto): Promise<QuestionResponseDto> {
        await this.assertQuestionnaireEditable(createQuestionDto.questionnaireId);

        const question = await this.prisma.question.create({
            data: createQuestionDto,
            select: {
                id: true,
                title: true,
                type: true,
                isRequired: true,
                order: true,
                questionnaireId: true,
                createdAt: true,
                updatedAt: true,
                questionnaire: { select: { id: true, title: true, status: true, teamId: true } },
                answers: { select: { id: true, playerId: true, value: true, submittedAt: true } },
            },
        });
        return question;
    }

    async update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<QuestionResponseDto> {
        const existing = await this.prisma.question.findUnique({
            where: { id },
            select: { questionnaireId: true },
        });
        if (!existing) throw new NotFoundException('Question not found');
        await this.assertQuestionnaireEditable(existing.questionnaireId);

        const question = await this.prisma.question.update({
            where: { id },
            data: updateQuestionDto,
            select: {
                id: true,
                title: true,
                type: true,
                isRequired: true,
                order: true,
                questionnaireId: true,
                createdAt: true,
                updatedAt: true,
                questionnaire: { select: { id: true, title: true, status: true, teamId: true } },
                answers: { select: { id: true, playerId: true, value: true, submittedAt: true } },
            },
        });
        return question;
    }

    async remove(id: number) {
        const existing = await this.prisma.question.findUnique({
            where: { id },
            select: { questionnaireId: true },
        });
        if (!existing) throw new NotFoundException('Question not found');
        await this.assertQuestionnaireEditable(existing.questionnaireId);

        return this.prisma.question.delete({ where: { id } });
    }
}
