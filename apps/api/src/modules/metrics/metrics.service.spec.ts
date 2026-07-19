import { NotFoundException } from '@nestjs/common';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
    let service: MetricsService;
    let prisma: any;

    const metricRecord = {
        id: 1,
        playerId: 1,
        questionnaireId: 10,
        type: 'WEIGHT',
        value: 78,
        unit: 'kg',
        capturedAt: new Date('2026-01-01'),
        player: { id: 1, firstName: 'Alice', lastName: 'A', clubId: 1 },
    };

    beforeEach(() => {
        prisma = {
            metric: {
                findMany: jest.fn(),
                findFirst: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        service = new MetricsService(prisma);
    });

    it('findAll only queries metrics from completed questionnaires and aliases capturedAt', async () => {
        prisma.metric.findMany.mockResolvedValue([metricRecord]);

        const result = await service.findAll();

        expect(prisma.metric.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: { questionnaire: { status: 'COMPLETED' } } }),
        );
        expect(result[0].recordedAt).toEqual(metricRecord.capturedAt);
    });

    describe('findOne', () => {
        it('returns the metric when it belongs to a completed questionnaire', async () => {
            prisma.metric.findFirst.mockResolvedValue(metricRecord);

            const result = await service.findOne(1);

            expect(result.value).toBe(78);
            expect(prisma.metric.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 1, AND: [{ questionnaire: { status: 'COMPLETED' } }] },
                }),
            );
        });

        it('throws NotFoundException when the metric does not exist or its questionnaire is not completed', async () => {
            prisma.metric.findFirst.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    it('create persists the metric', async () => {
        prisma.metric.create.mockResolvedValue(metricRecord);

        const result = await service.create({ playerId: 1, type: 'WEIGHT', value: 78 } as any);

        expect(result.value).toBe(78);
    });

    it('update persists changes', async () => {
        prisma.metric.update.mockResolvedValue({ ...metricRecord, value: 80 });

        const result = await service.update(1, { value: 80 } as any);

        expect(result.value).toBe(80);
    });

    it('remove deletes the metric', async () => {
        prisma.metric.delete.mockResolvedValue(metricRecord);

        const result = await service.remove(1);

        expect(result.id).toBe(1);
    });
});
