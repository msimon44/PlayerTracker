import { ApiProperty } from '@nestjs/swagger';

class QuestionnaireNestedDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'Weekly Check-in' })
    title: string;
    @ApiProperty({ example: 'DRAFT' })
    status: string;
    @ApiProperty({ example: 1 })
    teamId: number;
}

class AnswerNestedDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 1 })
    playerId: number;
    @ApiProperty({ example: 'Good' })
    value: string;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    submittedAt: Date;
}

class CountDto {
    @ApiProperty({ example: 15 })
    answers: number;
}

export class QuestionListItemDto {
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
    @ApiProperty({ example: 1 })
    questionnaireId: number;
    @ApiProperty({ example: '2024-01-01T00:00:00Z' })
    createdAt: Date;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;
    @ApiProperty({ type: CountDto })
    _count: CountDto;
}

export class QuestionResponseDto {
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
    @ApiProperty({ example: 1 })
    questionnaireId: number;
    @ApiProperty({ example: '2024-01-01T00:00:00Z' })
    createdAt: Date;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;
    @ApiProperty({ type: QuestionnaireNestedDto })
    questionnaire: QuestionnaireNestedDto;
    @ApiProperty({ type: [AnswerNestedDto] })
    answers: AnswerNestedDto[];
}
