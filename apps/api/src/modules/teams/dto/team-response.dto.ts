import { ApiProperty } from '@nestjs/swagger';

class ClubNestedDto {
    @ApiProperty({ description: 'Club ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Club name', example: 'FC Barcelona' })
    name: string;

    @ApiProperty({ type: String, description: 'Logo URL', example: 'https://example.com/logo.png', nullable: true })
    logoUrl: string | null;
}

class PlayerNestedDto {
    @ApiProperty({ description: 'Player ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'First name', example: 'John' })
    firstName: string;

    @ApiProperty({ description: 'Last name', example: 'Doe' })
    lastName: string;

    @ApiProperty({ type: String, description: 'Nickname', example: 'Johnny', nullable: true })
    nickName: string | null;

    @ApiProperty({ description: 'Is active', example: true })
    isActive: boolean;

    @ApiProperty({ type: Number, description: 'Position ID', example: 1, nullable: true })
    positionId: number | null;
}

class QuestionnaireNestedDto {
    @ApiProperty({ description: 'Questionnaire ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Title', example: 'Weekly Check-in' })
    title: string;

    @ApiProperty({ description: 'Status', example: 'DRAFT', enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'] })
    status: string;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    createdAt: Date;
}

class CountDto {
    @ApiProperty({ description: 'Number of players', example: 15 })
    players: number;

    @ApiProperty({ description: 'Number of questionnaires', example: 5 })
    questionnaires: number;
}

export class TeamListItemDto {
    @ApiProperty({ description: 'Team ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Team name', example: 'First Team' })
    name: string;

    @ApiProperty({
        type: String,
        description: 'Team description',
        example: 'Senior football team',
        nullable: true,
        required: false,
    })
    description?: string | null;

    @ApiProperty({
        type: String,
        description: 'Team logo URL',
        example: 'https://example.com/logo.png',
        nullable: true,
        required: false,
    })
    logoUrl?: string | null;

    @ApiProperty({ description: 'Sport ID', example: 1 })
    sportId: number;

    @ApiProperty({ description: 'Club ID', example: 1 })
    clubId: number;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'Club details', type: ClubNestedDto })
    club: ClubNestedDto;

    @ApiProperty({ description: 'Counts', type: CountDto })
    _count: CountDto;
}

export class TeamResponseDto {
    @ApiProperty({ description: 'Team ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Team name', example: 'First Team' })
    name: string;

    @ApiProperty({
        type: String,
        description: 'Team description',
        example: 'Senior football team',
        nullable: true,
        required: false,
    })
    description?: string | null;

    @ApiProperty({
        type: String,
        description: 'Team logo URL',
        example: 'https://example.com/logo.png',
        nullable: true,
        required: false,
    })
    logoUrl?: string | null;

    @ApiProperty({ description: 'Sport ID', example: 1 })
    sportId: number;

    @ApiProperty({ description: 'Club ID', example: 1 })
    clubId: number;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'Club details', type: ClubNestedDto })
    club: ClubNestedDto;

    @ApiProperty({ description: 'Players', type: [PlayerNestedDto] })
    players: PlayerNestedDto[];

    @ApiProperty({ description: 'Questionnaires', type: [QuestionnaireNestedDto] })
    questionnaires: QuestionnaireNestedDto[];
}
