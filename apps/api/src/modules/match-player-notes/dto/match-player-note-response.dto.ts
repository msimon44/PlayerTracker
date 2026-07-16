import { ApiProperty } from '@nestjs/swagger';

class MatchPlayerNotePlayerDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Caliste' })
    firstName: string;

    @ApiProperty({ example: 'Henry-Hennebert' })
    lastName: string;

    @ApiProperty({ example: 'Caliste', nullable: true })
    nickName: string | null;
}

class MatchPlayerNoteEventDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'LEC match day vs Team Vitality' })
    title: string;

    @ApiProperty({ example: 'MATCH' })
    type: string;

    @ApiProperty({ example: '2026-04-29T18:00:00.000Z' })
    startsAt: Date;
}

export class MatchPlayerNoteResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    eventId: number;

    @ApiProperty({ example: 1 })
    playerId: number;

    @ApiProperty({ example: 1 })
    staffId: number;

    @ApiProperty({ example: 8.4 })
    rating: number;

    @ApiProperty({ example: 'Très bon impact en teamfight.', nullable: true })
    comment: string | null;

    @ApiProperty({ type: MatchPlayerNotePlayerDto })
    player: MatchPlayerNotePlayerDto;

    @ApiProperty({ type: MatchPlayerNoteEventDto })
    event: MatchPlayerNoteEventDto;
}
