import { ApiProperty } from '@nestjs/swagger';

class QuestionnaireTeamDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'First Team' })
    name: string;
    @ApiProperty({ example: 'Main team', nullable: true })
    description: string | null;
    @ApiProperty({ example: 'https://example.com/logo.png', nullable: true })
    logoUrl: string | null;
    @ApiProperty({ example: 1 })
    clubId: number;
}

class CreatorNestedDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'John', nullable: true })
    firstName: string | null;
    @ApiProperty({ example: 'Doe', nullable: true })
    lastName: string | null;
    @ApiProperty({ example: 'Physiotherapist', nullable: true })
    specialty: string | null;
}

class QuestionNestedDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'How are you feeling?' })
    title: string;
    @ApiProperty({ example: 'TEXT' })
    type: string;
    @ApiProperty({ example: true })
    isRequired: boolean;
    @ApiProperty({ example: 1 })
    order: number;
}

class QuestionnaireCountDto {
    @ApiProperty({ example: 10 })
    questions: number;
}

export class QuestionnaireListItemDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'Weekly Check-in' })
    title: string;
    @ApiProperty({ example: 'Check your wellness', nullable: true })
    description: string | null;
    @ApiProperty({ example: 'DRAFT', enum: ['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'] })
    status: string;
    @ApiProperty({ example: 1 })
    teamId: number;
    @ApiProperty({ example: 1 })
    createdBy: number;
    @ApiProperty({ example: 1 })
    staffId: number;
    @ApiProperty({ example: '2026-04-29T08:00:00.000Z', nullable: true })
    scheduledAt: Date | null;
    @ApiProperty({ example: '2026-04-29T12:00:00.000Z', nullable: true })
    closesAt: Date | null;
    @ApiProperty({ example: 1, nullable: true })
    eventId: number | null;
    @ApiProperty({ example: '2024-01-01T00:00:00Z' })
    createdAt: Date;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;
    @ApiProperty({ type: QuestionnaireTeamDto })
    team: QuestionnaireTeamDto;
    @ApiProperty({ type: QuestionnaireCountDto })
    _count: QuestionnaireCountDto;
}

export class QuestionnaireResponseDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'Weekly Check-in' })
    title: string;
    @ApiProperty({ example: 'Check your wellness', nullable: true })
    description: string | null;
    @ApiProperty({ example: 'DRAFT', enum: ['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'] })
    status: string;
    @ApiProperty({ example: 1 })
    teamId: number;
    @ApiProperty({ example: 1 })
    createdBy: number;
    @ApiProperty({ example: 1 })
    staffId: number;
    @ApiProperty({ example: '2026-04-29T08:00:00.000Z', nullable: true })
    scheduledAt: Date | null;
    @ApiProperty({ example: '2026-04-29T12:00:00.000Z', nullable: true })
    closesAt: Date | null;
    @ApiProperty({ example: 1, nullable: true })
    eventId: number | null;
    @ApiProperty({ example: '2024-01-01T00:00:00Z' })
    createdAt: Date;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;
    @ApiProperty({ type: QuestionnaireTeamDto })
    team: QuestionnaireTeamDto;
    @ApiProperty({ type: CreatorNestedDto })
    creator: CreatorNestedDto;
    @ApiProperty({ type: [QuestionNestedDto] })
    questions: QuestionNestedDto[];
}
