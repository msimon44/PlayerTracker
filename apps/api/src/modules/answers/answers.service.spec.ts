import { NotFoundException } from '@nestjs/common';
import { AnswersService } from './answers.service';

describe('AnswersService', () => {
    let service: AnswersService;
    let prisma: any;

    const answerRecord = {
        id: 1,
        questionId: 1,
        playerId: 1,
        value: '7',
        submittedAt: new Date('2026-01-01'),
        player: { id: 1, firstName: 'Alice', lastName: 'A', teamId: 1 },
        question: { id: 1, title: 'Fatigue', type: 'SCALE', questionnaireId: 10 },
    };

    beforeEach(() => {
        prisma = {
            answer: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
            questionnaire: {
                findUnique: jest.fn(),
                update: jest.fn(),
            },
        };
        service = new AnswersService(prisma);
    });

    describe('findAll / findOne', () => {
        it('findAll returns all answers', async () => {
            prisma.answer.findMany.mockResolvedValue([answerRecord]);

            const result = await service.findAll();

            expect(result).toHaveLength(1);
        });

        it('findOne returns the answer when found', async () => {
            prisma.answer.findUnique.mockResolvedValue(answerRecord);

            const result = await service.findOne(1);

            expect(result.value).toBe('7');
        });

        it('findOne throws NotFoundException when not found', async () => {
            prisma.answer.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('auto-completion of a questionnaire once fully answered', () => {
        it('does nothing when the questionnaire is not ACTIVE', async () => {
            prisma.answer.create.mockResolvedValue(answerRecord);
            prisma.questionnaire.findUnique.mockResolvedValue({
                id: 10,
                status: 'DRAFT',
                team: { players: [] },
                questions: [],
            });

            await service.create({} as any);

            expect(prisma.questionnaire.update).not.toHaveBeenCalled();
        });

        it('does nothing when there are no active players or no required questions', async () => {
            prisma.answer.create.mockResolvedValue(answerRecord);
            prisma.questionnaire.findUnique.mockResolvedValue({
                id: 10,
                status: 'ACTIVE',
                team: { players: [] },
                questions: [{ id: 1 }],
            });

            await service.create({} as any);

            expect(prisma.questionnaire.update).not.toHaveBeenCalled();
        });

        it('does not complete the questionnaire while some answers are still missing', async () => {
            prisma.answer.create.mockResolvedValue(answerRecord);
            prisma.questionnaire.findUnique.mockResolvedValue({
                id: 10,
                status: 'ACTIVE',
                team: { players: [{ id: 1 }, { id: 2 }] },
                questions: [{ id: 1 }],
            });
            // Only 1 of the 2 expected (player x question) pairs has been answered
            prisma.answer.findMany.mockResolvedValue([{ playerId: 1, questionId: 1 }]);

            await service.create({} as any);

            expect(prisma.questionnaire.update).not.toHaveBeenCalled();
        });

        it('marks the questionnaire COMPLETED once every active player has answered every required question', async () => {
            prisma.answer.create.mockResolvedValue(answerRecord);
            prisma.questionnaire.findUnique.mockResolvedValue({
                id: 10,
                status: 'ACTIVE',
                team: { players: [{ id: 1 }, { id: 2 }] },
                questions: [{ id: 1 }],
            });
            prisma.answer.findMany.mockResolvedValue([
                { playerId: 1, questionId: 1 },
                { playerId: 2, questionId: 1 },
            ]);

            await service.create({} as any);

            expect(prisma.questionnaire.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 10 },
                    data: expect.objectContaining({ status: 'COMPLETED' }),
                }),
            );
        });

        it('does nothing when the questionnaire referenced by an answer no longer exists', async () => {
            prisma.answer.update.mockResolvedValue(answerRecord);
            prisma.questionnaire.findUnique.mockResolvedValue(null);

            await service.update(1, {} as any);

            expect(prisma.questionnaire.update).not.toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('deletes the answer', async () => {
            prisma.answer.delete.mockResolvedValue(answerRecord);

            await service.remove(1);

            expect(prisma.answer.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});
