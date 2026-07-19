import { NotFoundException } from '@nestjs/common';
import { QuestionTemplatesService } from './question-templates.service';

describe('QuestionTemplatesService', () => {
    let service: QuestionTemplatesService;
    let prisma: any;

    const templateRecord = {
        id: 1,
        title: 'Niveau de fatigue',
        type: 'SCALE',
        sportId: 1,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    };

    beforeEach(() => {
        prisma = {
            questionTemplate: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        service = new QuestionTemplatesService(prisma);
    });

    it('findAll returns the template list', async () => {
        prisma.questionTemplate.findMany.mockResolvedValue([templateRecord]);

        const result = await service.findAll();

        expect(result).toHaveLength(1);
    });

    describe('findOne', () => {
        it('returns the template when found', async () => {
            prisma.questionTemplate.findUnique.mockResolvedValue(templateRecord);

            const result = await service.findOne(1);

            expect(result.title).toBe('Niveau de fatigue');
        });

        it('throws NotFoundException when not found', async () => {
            prisma.questionTemplate.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    it('create persists the template', async () => {
        prisma.questionTemplate.create.mockResolvedValue(templateRecord);

        const result = await service.create({ title: 'Niveau de fatigue' } as any);

        expect(result.title).toBe('Niveau de fatigue');
    });

    it('update persists changes', async () => {
        prisma.questionTemplate.update.mockResolvedValue({ ...templateRecord, title: 'Modifié' });

        const result = await service.update(1, { title: 'Modifié' } as any);

        expect(result.title).toBe('Modifié');
    });

    it('remove deletes the template', async () => {
        prisma.questionTemplate.delete.mockResolvedValue(templateRecord);

        const result = await service.remove(1);

        expect(result.id).toBe(1);
    });
});
