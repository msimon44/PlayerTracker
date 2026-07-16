import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min, IsEnum, MaxLength, IsDateString } from 'class-validator';

export class CreateQuestionnaireDto {
    @ApiProperty({
        description: 'Titre du questionnaire',
        example: 'Questionnaire post-match',
        maxLength: 200,
    })
    @IsString()
    @MaxLength(200)
    title: string;

    @ApiProperty({
        description: 'Description du questionnaire',
        example: 'Évaluation de la condition physique et mentale après le match',
        maxLength: 1000,
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @ApiProperty({
        description: "ID de l'équipe",
        example: 1,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    teamId: number;

    @ApiProperty({
        description: 'ID du staff créateur',
        example: 1,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    createdBy: number;

    @ApiProperty({
        description: 'Statut du questionnaire',
        enum: ['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'],
        example: 'DRAFT',
        default: 'DRAFT',
        required: false,
    })
    @IsOptional()
    @IsEnum(['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'])
    status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

    @ApiProperty({
        description: 'Date de planification',
        example: '2026-04-29T08:00:00.000Z',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    scheduledAt?: string;

    @ApiProperty({
        description: 'Date limite de réponse',
        example: '2026-04-29T12:00:00.000Z',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    closesAt?: string;

    @ApiProperty({
        description: "ID de l'événement calendrier associé",
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    eventId?: number;
}
