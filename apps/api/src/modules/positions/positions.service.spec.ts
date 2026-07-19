import { NotFoundException } from '@nestjs/common';
import { PositionsService } from './positions.service';

describe('PositionsService', () => {
    let service: PositionsService;
    let prisma: any;

    const positionRecord = {
        id: 1,
        name: 'Gardien',
        sportId: 1,
        sport: { id: 1, name: 'Football' },
        _count: { players: 3 },
    };

    beforeEach(() => {
        prisma = {
            position: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        service = new PositionsService(prisma);
    });

    it('findAll maps positions with their sport and player count', async () => {
        prisma.position.findMany.mockResolvedValue([positionRecord]);

        const result = await service.findAll();

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Gardien');
    });

    describe('findOne', () => {
        it('returns the position when found', async () => {
            prisma.position.findUnique.mockResolvedValue(positionRecord);

            const result = await service.findOne(1);

            expect(result.name).toBe('Gardien');
        });

        it('throws NotFoundException when not found', async () => {
            prisma.position.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    it('create persists the position', async () => {
        prisma.position.create.mockResolvedValue(positionRecord);

        const result = await service.create({ name: 'Gardien', sportId: 1 } as any);

        expect(result.name).toBe('Gardien');
    });

    it('update persists changes', async () => {
        prisma.position.update.mockResolvedValue({ ...positionRecord, name: 'Défenseur' });

        const result = await service.update(1, { name: 'Défenseur' } as any);

        expect(result.name).toBe('Défenseur');
    });

    it('remove deletes the position', async () => {
        prisma.position.delete.mockResolvedValue(positionRecord);

        const result = await service.remove(1);

        expect(result.id).toBe(1);
        expect(prisma.position.delete).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1 } }));
    });
});
