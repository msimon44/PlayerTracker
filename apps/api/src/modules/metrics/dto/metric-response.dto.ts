import { ApiProperty } from '@nestjs/swagger';

class MetricPlayerDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'John' })
    firstName: string;
    @ApiProperty({ example: 'Doe' })
    lastName: string;
    @ApiProperty({ example: 1 })
    clubId: number;
}

export class MetricListItemDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 1 })
    playerId: number;
    @ApiProperty({ example: 1, nullable: true })
    questionnaireId: number | null;
    @ApiProperty({ example: 'WEIGHT' })
    type: string;
    @ApiProperty({ example: 75.5 })
    value: number;
    @ApiProperty({ example: 'kg', nullable: true })
    unit: string | null;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    recordedAt: Date;
    @ApiProperty({ type: MetricPlayerDto })
    player: MetricPlayerDto;
}

export class MetricResponseDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 1 })
    playerId: number;
    @ApiProperty({ example: 1, nullable: true })
    questionnaireId: number | null;
    @ApiProperty({ example: 'WEIGHT' })
    type: string;
    @ApiProperty({ example: 75.5 })
    value: number;
    @ApiProperty({ example: 'kg', nullable: true })
    unit: string | null;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    recordedAt: Date;
    @ApiProperty({ type: MetricPlayerDto })
    player: MetricPlayerDto;
}
