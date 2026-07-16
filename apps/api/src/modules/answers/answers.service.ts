import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionnaireStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { AnswerResponseDto, AnswerListItemDto } from './dto/answer-response.dto';

@Injectable()
export class AnswersService {
    constructor(private readonly prisma: PrismaService) {}

    private readonly select = {
        id: true,
        questionId: true,
        playerId: true,
        value: true,
        submittedAt: true,
        player: { select: { id: true, firstName: true, lastName: true, teamId: true } },
        question: { select: { id: true, title: true, type: true, questionnaireId: true } },
    };

    private async completeQuestionnaireIfFullyAnswered(questionnaireId: number) {
        const questionnaire = await this.prisma.questionnaire.findUnique({
            where: { id: questionnaireId },
            select: {
                id: true,
                status: true,
                team: {
                    select: {
                        players: {
                            where: { isActive: true, isDeleted: false },
                            select: { id: true },
                        },
                    },
                },
                questions: {
                    where: { isRequired: true },
                    select: { id: true },
                },
            },
        });

        if (!questionnaire || questionnaire.status !== QuestionnaireStatus.ACTIVE) return;

        const playerIds = questionnaire.team.players.map((player) => player.id);
        const questionIds = questionnaire.questions.map((question) => question.id);
        if (playerIds.length === 0 || questionIds.length === 0) return;

        const answers = await this.prisma.answer.findMany({
            where: {
                playerId: { in: playerIds },
                questionId: { in: questionIds },
                question: { questionnaireId },
            },
            select: {
                playerId: true,
                questionId: true,
            },
        });

        const answeredPairs = new Set(answers.map((answer) => `${answer.playerId}:${answer.questionId}`));
        const expectedAnswers = playerIds.length * questionIds.length;

        if (answeredPairs.size < expectedAnswers) return;

        await this.prisma.questionnaire.update({
            where: { id: questionnaireId },
            data: {
                status: QuestionnaireStatus.COMPLETED,
                closesAt: new Date(),
            },
        });
    }

    async findAll(): Promise<AnswerListItemDto[]> {
        const answers = await this.prisma.answer.findMany({
            select: this.select,
        });
        return answers;
    }

    async findOne(id: number): Promise<AnswerResponseDto> {
        const answer = await this.prisma.answer.findUnique({
            where: { id },
            select: this.select,
        });
        if (!answer) throw new NotFoundException('Answer not found');
        return answer;
    }

    async create(createAnswerDto: CreateAnswerDto): Promise<AnswerResponseDto> {
        const answer = await this.prisma.answer.create({
            data: createAnswerDto,
            select: this.select,
        });
        await this.completeQuestionnaireIfFullyAnswered(answer.question.questionnaireId);
        return answer;
    }

    async update(id: number, updateAnswerDto: UpdateAnswerDto): Promise<AnswerResponseDto> {
        const answer = await this.prisma.answer.update({
            where: { id },
            data: updateAnswerDto,
            select: this.select,
        });
        await this.completeQuestionnaireIfFullyAnswered(answer.question.questionnaireId);
        return answer;
    }

    async remove(id: number) {
        return this.prisma.answer.delete({ where: { id } });
    }
}
