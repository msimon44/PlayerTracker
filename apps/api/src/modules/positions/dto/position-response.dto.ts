import { ApiProperty } from '@nestjs/swagger';

class SportNestedDto {
    @ApiProperty({ description: 'Sport ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Sport name', example: 'Football' })
    name: string;
}

class CountDto {
    @ApiProperty({ description: 'Number of players', example: 15 })
    players: number;
}

export class PositionListItemDto {
    @ApiProperty({ description: 'Position ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Position name', example: 'Forward' })
    name: string;

    @ApiProperty({ description: 'Sport ID', example: 1 })
    sportId: number;

    @ApiProperty({ description: 'Sport details', type: SportNestedDto })
    sport: SportNestedDto;

    @ApiProperty({ description: 'Counts', type: CountDto })
    _count: CountDto;
}

export class PositionResponseDto {
    @ApiProperty({ description: 'Position ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Position name', example: 'Forward' })
    name: string;

    @ApiProperty({ description: 'Sport ID', example: 1 })
    sportId: number;

    @ApiProperty({ description: 'Sport details', type: SportNestedDto })
    sport: SportNestedDto;
}
