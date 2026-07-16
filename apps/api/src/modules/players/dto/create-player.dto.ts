import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreatePlayerDto {
    @ApiProperty({
        description: "ID de l'utilisateur lié",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    userId?: number;

    @ApiProperty({
        description: 'Prénom du joueur',
        example: 'John',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @MinLength(1, { message: 'First name is required' })
    @MaxLength(100)
    firstName: string;

    @ApiProperty({
        description: 'Nom du joueur',
        example: 'Doe',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @MinLength(1, { message: 'Last name is required' })
    @MaxLength(100)
    lastName: string;

    @ApiProperty({
        description: 'Surnom du joueur',
        required: false,
        example: 'Johnny',
        minLength: 1,
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    nickName?: string;

    @ApiProperty({
        description: 'URL de la photo du joueur',
        required: false,
        example: 'http://example.com/photo.jpg',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    photoUrl?: string;

    @ApiProperty({
        description: 'ID du club',
        example: 1,
    })
    @IsInt()
    @Min(1, { message: 'Club is required' })
    clubId: number;

    @ApiProperty({
        description: "ID de l'équipe",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    teamId?: number;

    @ApiProperty({
        description: 'ID de la position',
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    positionId?: number;

    @ApiProperty({
        description: 'Joueur actif',
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
