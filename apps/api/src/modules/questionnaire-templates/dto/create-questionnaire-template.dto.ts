import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, MaxLength } from 'class-validator';

export class CreateQuestionnaireTemplateDto {
    @ApiProperty({
        description: 'Titre du template de questionnaire',
        example: 'Questionnaire de suivi quotidien',
        maxLength: 200,
    })
    @IsString()
    @MaxLength(200)
    title: string;

    @ApiProperty({
        description: 'ID du sport',
        example: 1,
    })
    @IsInt()
    @Min(1)
    sportId: number;
}
