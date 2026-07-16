import { NotFoundException } from '@nestjs/common';
import { ClubsService } from './clubs.service';

describe('ClubsService', () => {
    let service: ClubsService;
    let prisma: {
        club: { findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock };
    };

    const clubRecord = {
        id: 1,
        name: 'FC Test',
        description: null,
        logoUrl: null,
        website: null,
        address: null,
        phone: null,
        email: null,
        players: [],
        teams: [],
        staffs: [],
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    };

    beforeEach(() => {
        prisma = {
            club: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        service = new ClubsService(prisma as any);
    });

    describe('findAll', () => {
        it('maps clubs with their counts', async () => {
            prisma.club.findMany.mockResolvedValue([{ ...clubRecord, _count: { players: 3, teams: 1, staffs: 2 } }]);

            const result = await service.findAll();

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(expect.objectContaining({ id: 1, name: 'FC Test' }));
        });

        it('returns an empty list when there are no clubs', async () => {
            prisma.club.findMany.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('returns the club when it exists', async () => {
            prisma.club.findUnique.mockResolvedValue(clubRecord);

            const result = await service.findOne(1);

            expect(result.id).toBe(1);
        });

        it('throws NotFoundException (not a generic Error) when the club does not exist', async () => {
            prisma.club.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('creates a club from the provided data', async () => {
            prisma.club.create.mockResolvedValue(clubRecord);

            const result = await service.create({ name: 'FC Test' } as any);

            expect(result.name).toBe('FC Test');
            expect(prisma.club.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ name: 'FC Test' }) }),
            );
        });
    });

    describe('update', () => {
        it('updates the club with the provided data', async () => {
            prisma.club.update.mockResolvedValue({ ...clubRecord, name: 'FC Renamed' });

            const result = await service.update(1, { name: 'FC Renamed' } as any);

            expect(result.name).toBe('FC Renamed');
            expect(prisma.club.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 1 }, data: { name: 'FC Renamed' } }),
            );
        });
    });

    describe('remove', () => {
        it('deletes the club by id', async () => {
            prisma.club.delete.mockResolvedValue(clubRecord);

            await service.remove(1);

            expect(prisma.club.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});
