import { BadRequestException, NotFoundException } from '@nestjs/common';
import { QuestionnairesService } from './questionnaires.service';

describe('QuestionnairesService', () => {
    let service: QuestionnairesService;
    let prisma: any;

    const draftQuestionnaire = {
        id: 1,
        title: 'Ressenti post-match',
        description: null,
        status: 'DRAFT',
        teamId: 1,
        createdBy: 5,
        staffId: 5,
        scheduledAt: null,
        closesAt: null,
        eventId: null,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
        team: { id: 1, name: 'U18', description: null, logoUrl: null, clubId: 1 },
        creator: { id: 5, firstName: 'John', lastName: 'Coach', specialty: null },
        questions: [],
    };

    beforeEach(() => {
        prisma = {
            questionnaire: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
            question: {
                deleteMany: jest.fn(),
            },
        };
        service = new QuestionnairesService(prisma);
    });

    describe('findAll', () => {
        it('filters by club through the team relation', async () => {
            prisma.questionnaire.findMany.mockResolvedValue([draftQuestionnaire]);

            await service.findAll(1);

            expect(prisma.questionnaire.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { team: { clubId: 1 } } }),
            );
        });
    });

    describe('findOne', () => {
        it('returns the questionnaire when found', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue(draftQuestionnaire);

            const result = await service.findOne(1);

            expect(result.title).toBe('Ressenti post-match');
        });

        it('throws NotFoundException when not found', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findResults', () => {
        it('throws NotFoundException when the questionnaire does not exist', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue(null);

            await expect(service.findResults(999)).rejects.toThrow(NotFoundException);
        });

        it('rejects when the questionnaire is still a draft (not closed)', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue({ ...draftQuestionnaire, status: 'DRAFT' });

            await expect(service.findResults(1)).rejects.toThrow(BadRequestException);
        });

        it('rejects when the questionnaire is published but not yet closed', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue({
                ...draftQuestionnaire,
                status: 'PUBLISHED',
                closesAt: new Date(Date.now() + 60 * 60 * 1000),
            });

            await expect(service.findResults(1)).rejects.toThrow(BadRequestException);
        });

        it('returns the results once the questionnaire status is COMPLETED', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue({ ...draftQuestionnaire, status: 'COMPLETED' });

            const result = await service.findResults(1);

            expect(result.status).toBe('COMPLETED');
        });

        it('returns the results once the closing date has passed, even if status was not updated', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue({
                ...draftQuestionnaire,
                status: 'PUBLISHED',
                closesAt: new Date(Date.now() - 1000),
            });

            const result = await service.findResults(1);

            expect(result.status).toBe('PUBLISHED');
        });
    });

    describe('findRespondents', () => {
        it('throws NotFoundException when the questionnaire does not exist', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue(null);

            await expect(service.findRespondents(999)).rejects.toThrow(NotFoundException);
        });

        it('computes who has answered, using the most recent answer per player across questions', async () => {
            const older = new Date('2026-01-01T10:00:00Z');
            const newer = new Date('2026-01-02T10:00:00Z');
            prisma.questionnaire.findUnique.mockResolvedValue({
                id: 1,
                title: 'Ressenti post-match',
                status: 'PUBLISHED',
                team: {
                    players: [
                        { id: 1, firstName: 'Alice', lastName: 'A', nickName: null, photoUrl: null },
                        { id: 2, firstName: 'Bob', lastName: 'B', nickName: null, photoUrl: null },
                    ],
                },
                questions: [
                    { answers: [{ playerId: 1, submittedAt: older }] },
                    { answers: [{ playerId: 1, submittedAt: newer }] },
                ],
            });

            const result = await service.findRespondents(1);

            expect(result.answeredCount).toBe(1);
            expect(result.totalPlayers).toBe(2);
            const alice = result.players.find((p) => p.id === 1)!;
            const bob = result.players.find((p) => p.id === 2)!;
            expect(alice.hasAnswered).toBe(true);
            expect(alice.submittedAt).toEqual(newer);
            expect(bob.hasAnswered).toBe(false);
            expect(bob.submittedAt).toBeNull();
        });
    });

    describe('create', () => {
        it('maps createdBy to both staffId and createdBy', async () => {
            prisma.questionnaire.create.mockResolvedValue(draftQuestionnaire);

            await service.create({ title: 'Nouveau', teamId: 1, createdBy: 5 } as any);

            expect(prisma.questionnaire.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ staffId: 5, createdBy: 5, teamId: 1 }),
                }),
            );
        });
    });

    describe('update', () => {
        it('updates a draft questionnaire', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue({ status: 'DRAFT', closesAt: null });
            prisma.questionnaire.update.mockResolvedValue({ ...draftQuestionnaire, title: 'Modifié' });

            const result = await service.update(1, { title: 'Modifié' } as any);

            expect(result.title).toBe('Modifié');
        });

        it('throws NotFoundException when the questionnaire does not exist', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue(null);

            await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
        });

        it('rejects editing a published questionnaire', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue({ status: 'PUBLISHED', closesAt: null });

            await expect(service.update(1, {} as any)).rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('deletes a draft questionnaire and its questions', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue({ status: 'DRAFT', closesAt: null });
            prisma.questionnaire.delete.mockResolvedValue(draftQuestionnaire);

            await service.remove(1);

            expect(prisma.question.deleteMany).toHaveBeenCalledWith({ where: { questionnaireId: 1 } });
            expect(prisma.questionnaire.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('throws NotFoundException when the questionnaire does not exist', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });

        it('rejects deleting a non-draft questionnaire', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue({ status: 'COMPLETED', closesAt: null });

            await expect(service.remove(1)).rejects.toThrow(BadRequestException);
        });
    });
});
