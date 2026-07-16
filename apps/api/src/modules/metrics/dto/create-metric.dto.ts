import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsNumber, Min, MaxLength, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMetricDto {
    @ApiProperty({
        description: 'ID du joueur',
        example: 1,
    })
    @IsInt()
    @Min(1)
    playerId: number;

    @ApiProperty({
        description: "ID du questionnaire source si la métrique vient d'une réponse",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    questionnaireId?: number;

    @ApiProperty({
        description: 'Type de métrique',
        example: 'speed',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    type: string;

    @ApiProperty({
        description: 'Valeur de la métrique',
        example: 25.5,
    })
    @IsNumber()
    value: number;

    @ApiProperty({
        description: 'Unité de mesure',
        required: false,
        example: 'km/h',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    unit?: string;

    @ApiProperty({
        description: 'Date de capture de la métrique',
        example: '2024-01-01T10:00:00.000Z',
    })
    @IsDate()
    @Type(() => Date)
    capturedAt: Date;
}
