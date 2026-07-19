import { NotFoundException } from '@nestjs/common';
import { SportsService } from './sports.service';

describe('SportsService', () => {
    let service: SportsService;
    let prisma: any;

    const sportRecord = {
        id: 1,
        name: 'Football',
        createdAt: new Date('2026-01-01'),
        positions: [],
        templates: [],
        _count: { positions: 4, templates: 1 },
    };

    beforeEach(() => {
        prisma = {
            sport: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        service = new SportsService(prisma);
    });

    it('findAll maps sports with their counts', async () => {
        prisma.sport.findMany.mockResolvedValue([sportRecord]);

        const result = await service.findAll();

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Football');
    });

    describe('findOne', () => {
        it('returns the sport when found', async () => {
            prisma.sport.findUnique.mockResolvedValue(sportRecord);

            const result = await service.findOne(1);

            expect(result.name).toBe('Football');
        });

        it('throws NotFoundException when not found', async () => {
            prisma.sport.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    it('create persists the sport', async () => {
        prisma.sport.create.mockResolvedValue(sportRecord);

        const result = await service.create({ name: 'Football' } as any);

        expect(result.name).toBe('Football');
    });

    it('update persists changes', async () => {
        prisma.sport.update.mockResolvedValue({ ...sportRecord, name: 'Basketball' });

        const result = await service.update(1, { name: 'Basketball' } as any);

        expect(result.name).toBe('Basketball');
    });

    it('remove deletes the sport', async () => {
        prisma.sport.delete.mockResolvedValue(sportRecord);

        const result = await service.remove(1);

        expect(result.id).toBe(1);
        expect(prisma.sport.delete).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1 } }));
    });
});
