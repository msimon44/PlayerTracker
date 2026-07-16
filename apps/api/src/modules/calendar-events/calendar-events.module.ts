import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CalendarEventsController } from './calendar-events.controller';
import { CalendarEventsService } from './calendar-events.service';

@Module({
    controllers: [CalendarEventsController],
    providers: [CalendarEventsService, PrismaService],
})
export class CalendarEventsModule {}
