import { NotFoundException } from '@nestjs/common';
import { QuestionnaireTemplatesService } from './questionnaire-templates.service';

describe('QuestionnaireTemplatesService', () => {
    let service: QuestionnaireTemplatesService;
    let prisma: any;

    const templateRecord = {
        id: 1,
        title: 'Modèle ressenti',
        description: null,
        sportId: 1,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    };

    beforeEach(() => {
        prisma = {
            questionnaireTemplate: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        service = new QuestionnaireTemplatesService(prisma);
    });

    it('findAll returns the template list', async () => {
        prisma.questionnaireTemplate.findMany.mockResolvedValue([templateRecord]);

        const result = await service.findAll();

        expect(result).toHaveLength(1);
    });

    describe('findOne', () => {
        it('returns the template when found', async () => {
            prisma.questionnaireTemplate.findUnique.mockResolvedValue(templateRecord);

            const result = await service.findOne(1);

            expect(result.title).toBe('Modèle ressenti');
        });

        it('throws NotFoundException when not found', async () => {
            prisma.questionnaireTemplate.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    it('create persists the template', async () => {
        prisma.questionnaireTemplate.create.mockResolvedValue(templateRecord);

        const result = await service.create({ title: 'Modèle ressenti' } as any);

        expect(result.title).toBe('Modèle ressenti');
    });

    it('update persists changes', async () => {
        prisma.questionnaireTemplate.update.mockResolvedValue({ ...templateRecord, title: 'Modifié' });

        const result = await service.update(1, { title: 'Modifié' } as any);

        expect(result.title).toBe('Modifié');
    });

    it('remove deletes the template', async () => {
        prisma.questionnaireTemplate.delete.mockResolvedValue(templateRecord);

        const result = await service.remove(1);

        expect(result.id).toBe(1);
    });
});
