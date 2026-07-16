import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';

export class CreateSensitivePlayerDataDto {
    @ApiProperty({
        description: 'ID du joueur',
        example: 1,
    })
    @IsInt()
    @Min(1)
    playerId: number;

    @ApiProperty({
        description: 'Poids (kg)',
        required: false,
        example: 75.5,
    })
    @IsOptional()
    @IsNumber()
    weight?: number;

    @ApiProperty({
        description: 'Taille (cm)',
        required: false,
        example: 180,
    })
    @IsOptional()
    @IsNumber()
    height?: number;

    @ApiProperty({
        description: 'Date de naissance',
        required: false,
        example: '1995-01-01T00:00:00.000Z',
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    birthDate?: Date;

    @ApiProperty({
        description: 'Notes médicales',
        required: false,
        maxLength: 2000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    medicalNotes?: string;

    @ApiProperty({
        description: 'Nationalité (code pays ISO-2)',
        required: false,
        example: 'FR',
    })
    @IsOptional()
    @IsString()
    @Length(2, 2)
    nationality?: string;

    @ApiProperty({
        description: 'Genre',
        enum: ['MALE', 'FEMALE', 'OTHER'],
        example: 'MALE',
    })
    @IsEnum(['MALE', 'FEMALE', 'OTHER'])
    gender: 'MALE' | 'FEMALE' | 'OTHER';
}
