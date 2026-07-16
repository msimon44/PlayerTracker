import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalendarEventsService } from './calendar-events.service';
import { CalendarEventResponseDto } from './dto/calendar-event-response.dto';

@ApiTags('calendar-events')
@Controller('calendar-events')
@UseGuards(JwtAuthGuard)
export class CalendarEventsController {
    constructor(private readonly calendarEventsService: CalendarEventsService) {}

    @Get()
    @ApiOperation({ summary: 'Get calendar events' })
    @ApiResponse({ status: 200, description: 'List of calendar events', type: [CalendarEventResponseDto] })
    findAll(@Query('clubId') clubId?: string, @Query('teamId') teamId?: string): Promise<CalendarEventResponseDto[]> {
        return this.calendarEventsService.findAll(
            clubId ? Number(clubId) : undefined,
            teamId ? Number(teamId) : undefined,
        );
    }
}
