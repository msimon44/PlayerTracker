import { NotFoundException } from '@nestjs/common';
import { MatchPlayerNotesService } from './match-player-notes.service';

describe('MatchPlayerNotesService', () => {
    let service: MatchPlayerNotesService;
    let prisma: any;

    const noteRecord = {
        id: 1,
        eventId: 1,
        playerId: 1,
        staffId: 5,
        rating: 8,
        comment: 'Bon match',
        player: { id: 1, firstName: 'Alice', lastName: 'A', nickName: null },
        event: { id: 1, title: 'Match amical', type: 'MATCH', startsAt: new Date('2026-01-01') },
    };

    beforeEach(() => {
        prisma = {
            matchPlayerNote: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                upsert: jest.fn(),
                update: jest.fn(),
            },
        };
        service = new MatchPlayerNotesService(prisma);
    });

    describe('findAll', () => {
        it('filters by both eventId and playerId when provided', async () => {
            prisma.matchPlayerNote.findMany.mockResolvedValue([noteRecord]);

            await service.findAll(1, 1);

            expect(prisma.matchPlayerNote.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { eventId: 1, playerId: 1 } }),
            );
        });

        it('filters by eventId only when playerId is not provided', async () => {
            prisma.matchPlayerNote.findMany.mockResolvedValue([noteRecord]);

            await service.findAll(1);

            expect(prisma.matchPlayerNote.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { eventId: 1 } }),
            );
        });

        it('applies no filter when neither is provided', async () => {
            prisma.matchPlayerNote.findMany.mockResolvedValue([noteRecord]);

            await service.findAll();

            expect(prisma.matchPlayerNote.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {} }));
        });
    });

    describe('create', () => {
        it('upserts on the unique (eventId, playerId) pair', async () => {
            prisma.matchPlayerNote.upsert.mockResolvedValue(noteRecord);

            await service.create({ eventId: 1, playerId: 1, staffId: 5, rating: 8, comment: 'Bon match' } as any);

            expect(prisma.matchPlayerNote.upsert).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { eventId_playerId: { eventId: 1, playerId: 1 } },
                    update: expect.objectContaining({ staffId: 5, rating: 8, comment: 'Bon match' }),
                }),
            );
        });
    });

    describe('update', () => {
        it('updates an existing note', async () => {
            prisma.matchPlayerNote.findUnique.mockResolvedValue(noteRecord);
            prisma.matchPlayerNote.update.mockResolvedValue({ ...noteRecord, rating: 9 });

            const result = await service.update(1, { rating: 9 } as any);

            expect(result.rating).toBe(9);
        });

        it('throws NotFoundException when the note does not exist', async () => {
            prisma.matchPlayerNote.findUnique.mockResolvedValue(null);

            await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
        });
    });
});
