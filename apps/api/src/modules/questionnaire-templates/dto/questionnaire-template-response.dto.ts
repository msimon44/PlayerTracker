import { ApiProperty } from '@nestjs/swagger';

class SportNestedDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'Football' })
    name: string;
}

class QuestionNestedDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'How are you feeling?' })
    title: string;
    @ApiProperty({ example: 'TEXT' })
    type: string;
    @ApiProperty({ example: 1 })
    order: number;
}

class CountDto {
    @ApiProperty({ example: 10 })
    questions: number;
}

export class QuestionnaireTemplateListItemDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'Weekly Check-in Template' })
    title: string;
    @ApiProperty({ example: 1 })
    sportId: number;
    @ApiProperty({ example: '2024-01-01T00:00:00Z' })
    createdAt: Date;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;
    @ApiProperty({ type: SportNestedDto })
    sport: SportNestedDto;
    @ApiProperty({ type: CountDto })
    _count: CountDto;
}

export class QuestionnaireTemplateResponseDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'Weekly Check-in Template' })
    title: string;
    @ApiProperty({ example: 1 })
    sportId: number;
    @ApiProperty({ example: '2024-01-01T00:00:00Z' })
    createdAt: Date;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;
    @ApiProperty({ type: SportNestedDto })
    sport: SportNestedDto;
    @ApiProperty({ type: [QuestionNestedDto] })
    questions: QuestionNestedDto[];
}
