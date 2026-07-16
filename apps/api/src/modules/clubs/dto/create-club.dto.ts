import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateClubDto {
    @ApiProperty({
        description: 'Nom du club',
        example: 'FC Barcelona',
        minLength: 1,
        maxLength: 200,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    name: string;

    @ApiProperty({
        description: 'Description du club',
        required: false,
        example: 'Club de football professionnel',
        maxLength: 1000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @ApiProperty({
        description: 'URL du logo',
        required: false,
        example: 'https://example.com/logo.png',
    })
    @IsOptional()
    @IsUrl()
    logoUrl?: string;

    @ApiProperty({
        description: 'Site web',
        required: false,
        example: 'https://fcbarcelona.com',
    })
    @IsOptional()
    @IsUrl()
    website?: string;

    @ApiProperty({
        description: 'Adresse',
        required: false,
        example: '123 Rue du Stade',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    address?: string;

    @ApiProperty({
        description: 'Téléphone',
        required: false,
        example: '+33 1 23 45 67 89',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    phone?: string;

    @ApiProperty({
        description: 'Email',
        required: false,
        example: 'contact@club.com',
    })
    @IsOptional()
    @IsEmail()
    email?: string;
}
