import { ApiProperty } from '@nestjs/swagger';

class CalendarEventTeamDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Karmine Corp LEC' })
    name: string;

    @ApiProperty({ example: 1 })
    clubId: number;
}

class CalendarEventQuestionnaireDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Daily wellness check' })
    title: string;

    @ApiProperty({ example: 'ACTIVE' })
    status: string;

    @ApiProperty({ example: '2026-04-29T08:00:00.000Z', nullable: true })
    scheduledAt: Date | null;

    @ApiProperty({ example: '2026-04-29T12:00:00.000Z', nullable: true })
    closesAt: Date | null;
}

export class CalendarEventResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    teamId: number;

    @ApiProperty({ example: 'LEC match day vs Team Vitality' })
    title: string;

    @ApiProperty({ example: 'Match officiel LEC', nullable: true })
    description: string | null;

    @ApiProperty({ example: 'MATCH', enum: ['MATCH', 'TRAINING', 'REVIEW', 'OTHER'] })
    type: string;

    @ApiProperty({ example: '2026-04-29T18:00:00.000Z' })
    startsAt: Date;

    @ApiProperty({ example: '2026-04-29T21:00:00.000Z' })
    endsAt: Date;

    @ApiProperty({ example: 'Team Vitality', nullable: true })
    opponent: string | null;

    @ApiProperty({ example: 'Riot Games Arena Berlin', nullable: true })
    location: string | null;

    @ApiProperty({ example: true })
    isOfficial: boolean;

    @ApiProperty({ type: CalendarEventTeamDto })
    team: CalendarEventTeamDto;

    @ApiProperty({ type: [CalendarEventQuestionnaireDto] })
    questionnaires: CalendarEventQuestionnaireDto[];
}
