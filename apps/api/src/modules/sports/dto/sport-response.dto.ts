import { ApiProperty } from '@nestjs/swagger';

class PositionNestedDto {
    @ApiProperty({ description: 'Position ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Position name', example: 'Forward' })
    name: string;

    @ApiProperty({ description: 'Sport ID', example: 1 })
    sportId: number;
}

class TemplateNestedDto {
    @ApiProperty({ description: 'Template ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Sport ID', example: 1 })
    sportId: number;

    @ApiProperty({ description: 'Template title', example: 'Weekly Check-in' })
    title: string;
}

class CountDto {
    @ApiProperty({ description: 'Number of positions', example: 15 })
    positions: number;

    @ApiProperty({ description: 'Number of templates', example: 3 })
    templates: number;
}

export class SportListItemDto {
    @ApiProperty({ description: 'Sport ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Sport name', example: 'Football' })
    name: string;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Counts', type: CountDto })
    _count: CountDto;
}

export class SportResponseDto {
    @ApiProperty({ description: 'Sport ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Sport name', example: 'Football' })
    name: string;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Positions', type: [PositionNestedDto] })
    positions: PositionNestedDto[];

    @ApiProperty({ description: 'Templates', type: [TemplateNestedDto] })
    templates: TemplateNestedDto[];
}
