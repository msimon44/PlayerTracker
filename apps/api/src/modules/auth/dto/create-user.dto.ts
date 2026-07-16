import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    MinLength,
    IsOptional,
    IsBoolean,
    IsEnum,
    IsInt,
    IsPositive,
    IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
    @ApiProperty({
        description: "Email de l'utilisateur",
        example: 'john.doe@example.com',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({
        description: 'Mot de passe',
        example: 'Password123!',
        minLength: 8,
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;

    @ApiProperty({
        description: 'Prénom',
        example: 'John',
    })
    @IsString()
    @MinLength(1, { message: 'First name is required' })
    firstName: string;

    @ApiProperty({
        description: 'Nom de famille',
        example: 'Doe',
    })
    @IsString()
    @MinLength(1, { message: 'Last name is required' })
    lastName: string;

    @ApiProperty({
        description: "Rôle de l'utilisateur",
        enum: ['PLAYER', 'STAFF', 'ADMIN'],
        default: 'PLAYER',
        example: 'PLAYER',
    })
    @IsEnum(['PLAYER', 'STAFF', 'ADMIN'])
    role: 'PLAYER' | 'STAFF' | 'ADMIN' = 'PLAYER';

    @ApiProperty({
        description: 'ID du club (optionnel)',
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    clubId?: number;

    @ApiProperty({
        description: 'Consentement donné pour le traitement des données',
        example: true,
    })
    @IsBoolean()
    consentGiven: boolean;

    @ApiProperty({
        description: 'Date du consentement (optionnel)',
        required: false,
        example: '2024-01-01T00:00:00.000Z',
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    consentGivenAt?: Date;
}
