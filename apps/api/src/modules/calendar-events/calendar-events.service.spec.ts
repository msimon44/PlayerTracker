import { CalendarEventsService } from './calendar-events.service';

describe('CalendarEventsService', () => {
    let service: CalendarEventsService;
    let prisma: any;

    const eventRecord = {
        id: 1,
        teamId: 1,
        title: 'Match amical',
        description: null,
        type: 'MATCH',
        startsAt: new Date('2026-02-01T10:00:00Z'),
        endsAt: new Date('2026-02-01T12:00:00Z'),
        opponent: 'FC Rival',
        location: 'Stade municipal',
        isOfficial: false,
        team: { id: 1, name: 'U18', clubId: 1 },
        questionnaires: [],
    };

    beforeEach(() => {
        prisma = {
            calendarEvent: {
                findMany: jest.fn(),
            },
        };
        service = new CalendarEventsService(prisma);
    });

    it('filters by teamId when only teamId is provided', async () => {
        prisma.calendarEvent.findMany.mockResolvedValue([eventRecord]);

        await service.findAll(undefined, 1);

        expect(prisma.calendarEvent.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { teamId: 1 } }));
    });

    it('filters by club through the team relation when only clubId is provided', async () => {
        prisma.calendarEvent.findMany.mockResolvedValue([eventRecord]);

        await service.findAll(1);

        expect(prisma.calendarEvent.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: { team: { clubId: 1 } } }),
        );
    });

    it('combines both filters when clubId and teamId are provided', async () => {
        prisma.calendarEvent.findMany.mockResolvedValue([eventRecord]);

        await service.findAll(1, 1);

        expect(prisma.calendarEvent.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: { teamId: 1, team: { clubId: 1 } } }),
        );
    });

    it('applies no filter when neither is provided', async () => {
        prisma.calendarEvent.findMany.mockResolvedValue([eventRecord]);

        await service.findAll();

        expect(prisma.calendarEvent.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {} }));
    });

    it('orders events chronologically', async () => {
        prisma.calendarEvent.findMany.mockResolvedValue([eventRecord]);

        await service.findAll();

        expect(prisma.calendarEvent.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ orderBy: { startsAt: 'asc' } }),
        );
    });
});
