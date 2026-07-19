import { NotFoundException } from '@nestjs/common';
import { SensitivePlayerDataService } from './sensitive-player-data.service';

describe('SensitivePlayerDataService', () => {
    let service: SensitivePlayerDataService;
    let prisma: any;

    const record = {
        id: 1,
        playerId: 1,
        weight: 78,
        height: 182,
        birthDate: new Date('2000-01-01'),
        nationality: 'FR',
        gender: 'M',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    };

    beforeEach(() => {
        prisma = {
            sensitivePlayerData: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        service = new SensitivePlayerDataService(prisma);
    });

    it('findAll maps the sensitive data list', async () => {
        prisma.sensitivePlayerData.findMany.mockResolvedValue([record]);

        const result = await service.findAll();

        expect(result).toHaveLength(1);
        expect(result[0].nationality).toBe('FR');
    });

    describe('findOne', () => {
        it('returns the record when found', async () => {
            prisma.sensitivePlayerData.findUnique.mockResolvedValue(record);

            const result = await service.findOne(1);

            expect(result.weight).toBe(78);
        });

        it('throws NotFoundException when not found', async () => {
            prisma.sensitivePlayerData.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    it('create persists the record', async () => {
        prisma.sensitivePlayerData.create.mockResolvedValue(record);

        const result = await service.create({ playerId: 1, weight: 78 } as any);

        expect(result.playerId).toBe(1);
    });

    it('update persists changes', async () => {
        prisma.sensitivePlayerData.update.mockResolvedValue({ ...record, weight: 80 });

        const result = await service.update(1, { weight: 80 } as any);

        expect(result.weight).toBe(80);
    });

    it('remove deletes the record', async () => {
        prisma.sensitivePlayerData.delete.mockResolvedValue(record);

        const result = await service.remove(1);

        expect(result.id).toBe(1);
        expect(prisma.sensitivePlayerData.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
});
