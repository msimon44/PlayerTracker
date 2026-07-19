import { BadRequestException, NotFoundException } from '@nestjs/common';
import { QuestionsService } from './questions.service';

describe('QuestionsService', () => {
    let service: QuestionsService;
    let prisma: any;

    const questionRecord = {
        id: 1,
        title: 'Niveau de fatigue',
        type: 'SCALE',
        isRequired: true,
        order: 1,
        questionnaireId: 10,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
        questionnaire: { id: 10, title: 'Ressenti', status: 'DRAFT', teamId: 1 },
        answers: [],
    };

    beforeEach(() => {
        prisma = {
            question: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
            questionnaire: {
                findUnique: jest.fn(),
            },
        };
        service = new QuestionsService(prisma);
    });

    describe('findAll / findOne', () => {
        it('findAll maps questions with their answer count', async () => {
            prisma.question.findMany.mockResolvedValue([questionRecord]);

            const result = await service.findAll();

            expect(result).toHaveLength(1);
        });

        it('findOne returns the question when found', async () => {
            prisma.question.findUnique.mockResolvedValue(questionRecord);

            const result = await service.findOne(1);

            expect(result.title).toBe('Niveau de fatigue');
        });

        it('findOne throws NotFoundException when not found', async () => {
            prisma.question.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('creates a question on a draft questionnaire', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue({ status: 'DRAFT', closesAt: null });
            prisma.question.create.mockResolvedValue(questionRecord);

            const result = await service.create({ title: 'Niveau de fatigue', questionnaireId: 10 } as any);

            expect(result.title).toBe('Niveau de fatigue');
        });

        it('rejects when the target questionnaire does not exist', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue(null);

            await expect(service.create({ questionnaireId: 999 } as any)).rejects.toThrow(NotFoundException);
        });

        it('rejects adding a question to a non-draft questionnaire', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue({ status: 'PUBLISHED', closesAt: null });

            await expect(service.create({ questionnaireId: 10 } as any)).rejects.toThrow(BadRequestException);
        });

        it('rejects adding a question to a questionnaire past its closing date', async () => {
            prisma.questionnaire.findUnique.mockResolvedValue({
                status: 'DRAFT',
                closesAt: new Date(Date.now() - 1000),
            });

            await expect(service.create({ questionnaireId: 10 } as any)).rejects.toThrow(BadRequestException);
        });
    });

    describe('update', () => {
        it('updates a question belonging to a draft questionnaire', async () => {
            prisma.question.findUnique.mockResolvedValue({ questionnaireId: 10 });
            prisma.questionnaire.findUnique.mockResolvedValue({ status: 'DRAFT', closesAt: null });
            prisma.question.update.mockResolvedValue({ ...questionRecord, title: 'Modifié' });

            const result = await service.update(1, { title: 'Modifié' } as any);

            expect(result.title).toBe('Modifié');
        });

        it('throws NotFoundException when the question does not exist', async () => {
            prisma.question.findUnique.mockResolvedValue(null);

            await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
        });

        it('rejects updating a question whose questionnaire is no longer editable', async () => {
            prisma.question.findUnique.mockResolvedValue({ questionnaireId: 10 });
            prisma.questionnaire.findUnique.mockResolvedValue({ status: 'COMPLETED', closesAt: null });

            await expect(service.update(1, {} as any)).rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('deletes a question belonging to a draft questionnaire', async () => {
            prisma.question.findUnique.mockResolvedValue({ questionnaireId: 10 });
            prisma.questionnaire.findUnique.mockResolvedValue({ status: 'DRAFT', closesAt: null });
            prisma.question.delete.mockResolvedValue(questionRecord);

            await service.remove(1);

            expect(prisma.question.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('throws NotFoundException when the question does not exist', async () => {
            prisma.question.findUnique.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });

        it('rejects deleting a question whose questionnaire is no longer editable', async () => {
            prisma.question.findUnique.mockResolvedValue({ questionnaireId: 10 });
            prisma.questionnaire.findUnique.mockResolvedValue({ status: 'ARCHIVED', closesAt: null });

            await expect(service.remove(1)).rejects.toThrow(BadRequestException);
        });
    });
});
