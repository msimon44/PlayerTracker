import { NotFoundException } from '@nestjs/common';
import { TeamsService } from './teams.service';

describe('TeamsService', () => {
    let service: TeamsService;
    let prisma: any;

    const teamRecord = {
        id: 1,
        name: 'U18',
        description: null,
        logoUrl: null,
        sportId: 1,
        clubId: 1,
        club: { id: 1, name: 'FC Test', logoUrl: null },
        players: [],
        questionnaires: [],
        _count: { players: 0, questionnaires: 0 },
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    };

    beforeEach(() => {
        prisma = {
            team: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
            $transaction: jest.fn(),
        };
        service = new TeamsService(prisma);
    });

    describe('findAll', () => {
        it('filters by clubId when provided', async () => {
            prisma.team.findMany.mockResolvedValue([teamRecord]);

            await service.findAll(1);

            expect(prisma.team.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { clubId: 1 } }));
        });

        it('does not filter when clubId is not provided', async () => {
            prisma.team.findMany.mockResolvedValue([teamRecord]);

            await service.findAll();

            expect(prisma.team.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: undefined }));
        });
    });

    describe('findOne', () => {
        it('returns the team when it exists', async () => {
            prisma.team.findUnique.mockResolvedValue(teamRecord);

            const result = await service.findOne(1);

            expect(result?.id).toBe(1);
        });

        it('returns null when the team does not exist', async () => {
            prisma.team.findUnique.mockResolvedValue(null);

            const result = await service.findOne(999);

            expect(result).toBeNull();
        });
    });

    describe('remove', () => {
        it('deletes the team by id', async () => {
            prisma.team.delete.mockResolvedValue(teamRecord);

            await service.remove(1);

            expect(prisma.team.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });

    describe('assignPlayerToTeam', () => {
        it('connects the player, marks them active, and returns the updated team', async () => {
            const teamUpdate = jest.fn();
            const playerUpdate = jest.fn();
            const teamFindUnique = jest.fn().mockResolvedValue(teamRecord);
            prisma.$transaction.mockImplementation(async (cb: any) =>
                cb({
                    team: { update: teamUpdate, findUnique: teamFindUnique },
                    player: { update: playerUpdate },
                }),
            );

            const result = await service.assignPlayerToTeam(1, 5);

            expect(teamUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 1 },
                    data: { players: { connect: { id: 5 } } },
                }),
            );
            expect(playerUpdate).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 5 }, data: { isActive: true } }),
            );
            expect(result.id).toBe(1);
        });

        it('throws NotFoundException (not a generic Error) if the team disappears mid-transaction', async () => {
            prisma.$transaction.mockImplementation(async (cb: any) =>
                cb({
                    team: { update: jest.fn(), findUnique: jest.fn().mockResolvedValue(null) },
                    player: { update: jest.fn() },
                }),
            );

            await expect(service.assignPlayerToTeam(1, 5)).rejects.toThrow(NotFoundException);
        });
    });

    describe('removePlayerFromTeam', () => {
        it('disconnects the player and marks them inactive', async () => {
            const teamUpdate = jest.fn();
            const playerUpdate = jest.fn();
            prisma.$transaction.mockImplementation(async (cb: any) =>
                cb({
                    team: { update: teamUpdate, findUnique: jest.fn().mockResolvedValue(teamRecord) },
                    player: { update: playerUpdate },
                }),
            );

            await service.removePlayerFromTeam(1, 5);

            expect(teamUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 1 },
                    data: { players: { disconnect: { id: 5 } } },
                }),
            );
            expect(playerUpdate).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 5 }, data: { isActive: false } }),
            );
        });

        it('throws NotFoundException if the team disappears mid-transaction', async () => {
            prisma.$transaction.mockImplementation(async (cb: any) =>
                cb({
                    team: { update: jest.fn(), findUnique: jest.fn().mockResolvedValue(null) },
                    player: { update: jest.fn() },
                }),
            );

            await expect(service.removePlayerFromTeam(1, 5)).rejects.toThrow(NotFoundException);
        });
    });
});
