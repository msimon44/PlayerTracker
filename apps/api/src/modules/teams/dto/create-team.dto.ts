import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength } from 'class-validator';

export class CreateTeamDto {
    @ApiProperty({
        description: "Nom de l'équipe",
        example: 'Équipe première',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @ApiProperty({
        description: "Description de l'équipe",
        required: false,
        example: 'Équipe senior masculine de football',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({
        description: 'URL du logo',
        required: false,
        example: 'https://example.com/team-logo.png',
    })
    @IsOptional()
    @IsUrl()
    logoUrl?: string;

    @ApiProperty({
        description: 'ID du club',
        example: 1,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    clubId: number;

    @ApiProperty({
        description: 'ID du sport',
        example: 1,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    sportId: number;
}
