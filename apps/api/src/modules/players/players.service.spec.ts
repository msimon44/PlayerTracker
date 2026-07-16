import { NotFoundException } from '@nestjs/common';
import { PlayersService } from './players.service';

describe('PlayersService', () => {
    let service: PlayersService;
    let prisma: any;

    const playerRecord = {
        id: 1,
        userId: null,
        firstName: 'John',
        lastName: 'Doe',
        nickName: null,
        photoUrl: null,
        clubId: 1,
        teamId: null,
        positionId: null,
        isActive: true,
        user: null,
        club: { id: 1, name: 'FC Test', address: null, phone: null, createdAt: new Date(), updatedAt: new Date() },
        team: null,
        position: null,
        sensitiveData: null,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    };

    beforeEach(() => {
        prisma = {
            player: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
            user: {
                delete: jest.fn(),
            },
        };
        service = new PlayersService(prisma);
    });

    describe('findAll', () => {
        it('filters players by clubId when provided', async () => {
            prisma.player.findMany.mockResolvedValue([playerRecord]);

            await service.findAll(1);

            expect(prisma.player.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { clubId: 1 } }));
        });
    });

    describe('findOne', () => {
        it('returns the player when found', async () => {
            prisma.player.findUnique.mockResolvedValue(playerRecord);

            const result = await service.findOne(1);

            expect(result.firstName).toBe('John');
        });

        it('throws NotFoundException when the player does not exist', async () => {
            prisma.player.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('defaults isActive to true when not provided', async () => {
            prisma.player.create.mockResolvedValue(playerRecord);

            await service.create({ firstName: 'John', lastName: 'Doe', clubId: 1 } as any);

            expect(prisma.player.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ isActive: true }) }),
            );
        });

        it('respects an explicit isActive: false', async () => {
            prisma.player.create.mockResolvedValue({ ...playerRecord, isActive: false });

            await service.create({ firstName: 'John', lastName: 'Doe', clubId: 1, isActive: false } as any);

            expect(prisma.player.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ isActive: false }) }),
            );
        });

        it('connects an optional team when teamId is provided', async () => {
            prisma.player.create.mockResolvedValue(playerRecord);

            await service.create({ firstName: 'John', lastName: 'Doe', clubId: 1, teamId: 7 } as any);

            expect(prisma.player.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ team: { connect: { id: 7 } } }),
                }),
            );
        });

        it('does not attempt to connect a team when teamId is not provided', async () => {
            prisma.player.create.mockResolvedValue(playerRecord);

            await service.create({ firstName: 'John', lastName: 'Doe', clubId: 1 } as any);

            expect(prisma.player.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ team: undefined }) }),
            );
        });
    });

    describe('remove', () => {
        it('throws NotFoundException when the player does not exist', async () => {
            prisma.player.findUnique.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
            expect(prisma.player.delete).not.toHaveBeenCalled();
        });

        it('deletes the player only (no linked user account)', async () => {
            prisma.player.findUnique.mockResolvedValue({ userId: null });

            await service.remove(1);

            expect(prisma.user.delete).not.toHaveBeenCalled();
            expect(prisma.player.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('deletes the linked user account before deleting the player', async () => {
            prisma.player.findUnique.mockResolvedValue({ userId: 42 });

            await service.remove(1);

            expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 42 } });
            expect(prisma.player.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});
