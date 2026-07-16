import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Questionnaire } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { QuestionnaireListItemDto, QuestionnaireResponseDto } from './dto/questionnaire-response.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';

@Injectable()
export class QuestionnairesService {
    constructor(private readonly prisma: PrismaService) {}

    private isClosed(questionnaire: Pick<Questionnaire, 'status' | 'closesAt'>): boolean {
        return (
            questionnaire.status === 'COMPLETED' ||
            questionnaire.status === 'ARCHIVED' ||
            (questionnaire.closesAt !== null && questionnaire.closesAt <= new Date())
        );
    }

    private isEditable(questionnaire: Pick<Questionnaire, 'status' | 'closesAt'>): boolean {
        return questionnaire.status === 'DRAFT' && !this.isClosed(questionnaire);
    }

    async findAll(clubId?: number): Promise<QuestionnaireListItemDto[]> {
        const questionnaires = await this.prisma.questionnaire.findMany({
            where: clubId ? { team: { clubId } } : undefined,
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                teamId: true,
                createdBy: true,
                staffId: true,
                scheduledAt: true,
                closesAt: true,
                eventId: true,
                createdAt: true,
                updatedAt: true,
                team: { select: { id: true, name: true, description: true, logoUrl: true, clubId: true } },
                _count: { select: { questions: true } },
            },
        });
        return questionnaires.map((q) => ({ ...q, _count: q._count }));
    }

    async findOne(id: number): Promise<QuestionnaireResponseDto> {
        const questionnaire = await this.prisma.questionnaire.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                teamId: true,
                createdBy: true,
                staffId: true,
                scheduledAt: true,
                closesAt: true,
                eventId: true,
                createdAt: true,
                updatedAt: true,
                team: { select: { id: true, name: true, description: true, logoUrl: true, clubId: true } },
                creator: { select: { id: true, firstName: true, lastName: true, specialty: true } },
                questions: { select: { id: true, title: true, type: true, isRequired: true, order: true } },
            },
        });
        if (!questionnaire) throw new NotFoundException('Questionnaire not found');
        return questionnaire;
    }

    async findResults(id: number) {
        const questionnaire = await this.prisma.questionnaire.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                scheduledAt: true,
                closesAt: true,
                team: { select: { id: true, name: true } },
                questions: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        order: true,
                        answers: {
                            orderBy: { submittedAt: 'desc' },
                            select: {
                                id: true,
                                value: true,
                                submittedAt: true,
                                player: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        nickName: true,
                                        photoUrl: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!questionnaire) throw new NotFoundException('Questionnaire not found');
        if (!this.isClosed(questionnaire)) {
            throw new BadRequestException('Questionnaire results are available only after closure');
        }
        return questionnaire;
    }

    async findRespondents(id: number) {
        const questionnaire = await this.prisma.questionnaire.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                status: true,
                team: {
                    select: {
                        players: {
                            where: { isActive: true, isDeleted: false },
                            orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                nickName: true,
                                photoUrl: true,
                            },
                        },
                    },
                },
                questions: {
                    select: {
                        answers: {
                            select: {
                                playerId: true,
                                submittedAt: true,
                            },
                        },
                    },
                },
            },
        });
        if (!questionnaire) throw new NotFoundException('Questionnaire not found');

        const answersByPlayer = new Map<number, Date>();
        questionnaire.questions.forEach((question) => {
            question.answers.forEach((answer) => {
                const previous = answersByPlayer.get(answer.playerId);
                if (!previous || answer.submittedAt > previous) {
                    answersByPlayer.set(answer.playerId, answer.submittedAt);
                }
            });
        });

        const players = questionnaire.team.players.map((player) => ({
            ...player,
            hasAnswered: answersByPlayer.has(player.id),
            submittedAt: answersByPlayer.get(player.id) ?? null,
        }));

        return {
            id: questionnaire.id,
            title: questionnaire.title,
            status: questionnaire.status,
            players,
            answeredCount: players.filter((player) => player.hasAnswered).length,
            totalPlayers: players.length,
        };
    }

    async create(createQuestionnaireDto: CreateQuestionnaireDto): Promise<QuestionnaireResponseDto> {
        const { teamId, createdBy, ...rest } = createQuestionnaireDto;
        const questionnaire = await this.prisma.questionnaire.create({
            data: { ...rest, staffId: createdBy, teamId: teamId, createdBy: createdBy },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                teamId: true,
                createdBy: true,
                staffId: true,
                scheduledAt: true,
                closesAt: true,
                eventId: true,
                createdAt: true,
                updatedAt: true,
                team: { select: { id: true, name: true, description: true, logoUrl: true, clubId: true } },
                creator: { select: { id: true, firstName: true, lastName: true, specialty: true } },
                questions: { select: { id: true, title: true, type: true, isRequired: true, order: true } },
            },
        });
        return questionnaire;
    }

    async update(id: number, updateQuestionnaireDto: UpdateQuestionnaireDto): Promise<QuestionnaireResponseDto> {
        const existing = await this.prisma.questionnaire.findUnique({
            where: { id },
            select: { status: true, closesAt: true },
        });
        if (!existing) throw new NotFoundException('Questionnaire not found');
        if (!this.isEditable(existing)) {
            throw new BadRequestException('Only draft questionnaires can be edited');
        }

        const questionnaire = await this.prisma.questionnaire.update({
            where: { id },
            data: updateQuestionnaireDto,
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                teamId: true,
                createdBy: true,
                staffId: true,
                scheduledAt: true,
                closesAt: true,
                eventId: true,
                createdAt: true,
                updatedAt: true,
                team: { select: { id: true, name: true, description: true, logoUrl: true, clubId: true } },
                creator: { select: { id: true, firstName: true, lastName: true, specialty: true } },
                questions: { select: { id: true, title: true, type: true, isRequired: true, order: true } },
            },
        });
        return questionnaire;
    }

    async remove(id: number) {
        const existing = await this.prisma.questionnaire.findUnique({
            where: { id },
            select: { status: true, closesAt: true },
        });
        if (!existing) throw new NotFoundException('Questionnaire not found');
        if (!this.isEditable(existing)) {
            throw new BadRequestException('Only draft questionnaires can be deleted');
        }

        await this.prisma.question.deleteMany({ where: { questionnaireId: id } });
        return this.prisma.questionnaire.delete({ where: { id } });
    }
}
