import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsEnum, IsArray, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateQuestionTemplateDto {
    @ApiProperty({
        description: 'ID du template de questionnaire',
        example: 1,
    })
    @IsInt()
    @Min(1)
    templateId: number;

    @ApiProperty({
        description: 'Titre de la question',
        example: "Comment vous sentez-vous aujourd'hui ?",
        maxLength: 300,
    })
    @IsString()
    @MaxLength(300)
    title: string;

    @ApiProperty({
        description: 'Type de question',
        enum: ['TEXT', 'NUMBER', 'BOOLEAN', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'SCALE'],
        example: 'SINGLE_CHOICE',
    })
    @IsEnum(['TEXT', 'NUMBER', 'BOOLEAN', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'SCALE'])
    type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SCALE';

    @ApiProperty({
        description: 'Options de réponse (pour les questions à choix)',
        required: false,
        example: ['Très bien', 'Bien', 'Moyen', 'Fatigué'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    options?: string[];

    @ApiProperty({
        description: "Ordre d'affichage de la question",
        required: false,
        example: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;
}
