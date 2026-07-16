import { ApiProperty } from '@nestjs/swagger';

class AnswerPlayerDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'John' })
    firstName: string;
    @ApiProperty({ example: 'Doe' })
    lastName: string;
    @ApiProperty({ example: 1, nullable: true })
    teamId: number | null;
}

class QuestionNestedDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'How are you feeling?' })
    title: string;
    @ApiProperty({ example: 'TEXT' })
    type: string;
    @ApiProperty({ example: 1 })
    questionnaireId: number;
}

export class AnswerListItemDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 1 })
    questionId: number;
    @ApiProperty({ example: 1 })
    playerId: number;
    @ApiProperty({ example: 'Good' })
    value: string;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    submittedAt: Date;
    @ApiProperty({ type: AnswerPlayerDto })
    player: AnswerPlayerDto;
    @ApiProperty({ type: QuestionNestedDto })
    question: QuestionNestedDto;
}

export class AnswerResponseDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 1 })
    questionId: number;
    @ApiProperty({ example: 1 })
    playerId: number;
    @ApiProperty({ example: 'Good' })
    value: string;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    submittedAt: Date;
    @ApiProperty({ type: AnswerPlayerDto })
    player: AnswerPlayerDto;
    @ApiProperty({ type: QuestionNestedDto })
    question: QuestionNestedDto;
}
