import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsBoolean, IsEnum, IsUrl, IsDate } from 'class-validator';
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
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password?: string;

    @ApiProperty({
        description: "URL de l'avatar",
        required: false,
        example: 'https://example.com/avatar.jpg',
    })
    @IsOptional()
    @IsUrl({}, { message: 'Invalid URL format' })
    avatarUrl?: string;

    @ApiProperty({
        description: 'Email vérifié',
        required: false,
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    isEmailVerified?: boolean;

    @ApiProperty({
        description: 'Consentement donné',
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    consentGiven?: boolean;

    @ApiProperty({
        description: 'Date du consentement',
        required: false,
        example: '2024-01-01T00:00:00.000Z',
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    consentGivenAt?: Date;

    @ApiProperty({
        description: "Rôle de l'utilisateur",
        enum: ['PLAYER', 'STAFF', 'ADMIN'],
        example: 'PLAYER',
    })
    @IsEnum(['PLAYER', 'STAFF', 'ADMIN'])
    role: 'PLAYER' | 'STAFF' | 'ADMIN';
}
