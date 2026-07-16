import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CalendarEventResponseDto } from './dto/calendar-event-response.dto';

@Injectable()
export class CalendarEventsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(clubId?: number, teamId?: number): Promise<CalendarEventResponseDto[]> {
        return this.prisma.calendarEvent.findMany({
            where: {
                ...(teamId ? { teamId } : {}),
                ...(clubId ? { team: { clubId } } : {}),
            },
            orderBy: { startsAt: 'asc' },
            select: {
                id: true,
                teamId: true,
                title: true,
                description: true,
                type: true,
                startsAt: true,
                endsAt: true,
                opponent: true,
                location: true,
                isOfficial: true,
                team: { select: { id: true, name: true, clubId: true } },
                questionnaires: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        scheduledAt: true,
                        closesAt: true,
                    },
                    orderBy: { scheduledAt: 'asc' },
                },
            },
        });
    }
}
