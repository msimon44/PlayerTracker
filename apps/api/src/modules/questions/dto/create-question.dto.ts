import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min, IsEnum, IsBoolean, IsArray, MaxLength } from 'class-validator';

export class CreateQuestionDto {
    @ApiProperty({
        description: 'ID du questionnaire',
        example: 1,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    questionnaireId: number;

    @ApiProperty({
        description: 'Titre de la question',
        example: 'Comment vous sentez-vous après le match ?',
        maxLength: 500,
    })
    @IsString()
    @MaxLength(500)
    title: string;

    @ApiProperty({
        description: 'Type de question',
        enum: ['TEXT', 'NUMBER', 'BOOLEAN', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'SCALE'],
        example: 'SINGLE_CHOICE',
    })
    @IsEnum(['TEXT', 'NUMBER', 'BOOLEAN', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'SCALE'])
    type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SCALE';

    @ApiProperty({
        description: 'Options de réponse (pour SINGLE_CHOICE, MULTIPLE_CHOICE)',
        type: [String],
        example: ['Très bien', 'Bien', 'Moyen', 'Fatigué'],
        default: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    options?: string[];

    @ApiProperty({
        description: 'Question obligatoire',
        example: true,
        default: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isRequired?: boolean;

    @ApiProperty({
        description: "Ordre d'affichage de la question",
        example: 1,
        default: 0,
        required: false,
    })
    @IsOptional()
    @IsInt()
    order?: number;
}
