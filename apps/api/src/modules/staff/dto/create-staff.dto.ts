import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateStaffDto {
    @ApiProperty({
        description: "ID de l'utilisateur",
        example: 1,
    })
    @IsInt()
    @Min(1)
    userId: number;

    @ApiProperty({
        description: 'ID du club',
        example: 1,
    })
    @IsInt()
    @Min(1)
    clubId: number;

    @ApiProperty({
        description: 'Prénom',
        required: false,
        example: 'Jean',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    firstName?: string;

    @ApiProperty({
        description: 'Nom',
        required: false,
        example: 'Dupont',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    lastName?: string;

    @ApiProperty({
        description: 'Spécialité',
        required: false,
        example: 'Préparateur physique',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    specialty?: string;

    @ApiProperty({
        description: 'Téléphone',
        required: false,
        example: '+33612345678',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    phone?: string;

    @ApiProperty({
        description: 'Certifications',
        required: false,
        example: 'BEES 2, Diplôme de kinésithérapie',
        maxLength: 1000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    certifications?: string;
}
