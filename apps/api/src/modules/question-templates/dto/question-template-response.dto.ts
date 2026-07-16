import { ApiProperty } from '@nestjs/swagger';

class TemplateNestedDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'Weekly Check-in Template' })
    title: string;
    @ApiProperty({ example: 1 })
    sportId: number;
}

export class QuestionTemplateListItemDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'How are you feeling?' })
    title: string;
    @ApiProperty({ example: 'TEXT' })
    type: string;
    @ApiProperty({ example: 1 })
    order: number;
    @ApiProperty({ example: 1 })
    templateId: number;
    @ApiProperty({ type: TemplateNestedDto })
    template: TemplateNestedDto;
}

export class QuestionTemplateResponseDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'How are you feeling?' })
    title: string;
    @ApiProperty({ example: 'TEXT' })
    type: string;
    @ApiProperty({ example: 1 })
    order: number;
    @ApiProperty({ example: 1 })
    templateId: number;
    @ApiProperty({ type: TemplateNestedDto })
    template: TemplateNestedDto;
}
