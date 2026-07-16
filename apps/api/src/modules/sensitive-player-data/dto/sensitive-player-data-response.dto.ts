import { ApiProperty } from '@nestjs/swagger';

export class SensitivePlayerDataResponseDto {
    @ApiProperty({ description: 'ID of the sensitive player data', example: 1 })
    id: number;

    @ApiProperty({ description: 'ID of the player', example: 1 })
    playerId: number;

    @ApiProperty({ description: 'Weight in kg', example: 75.5, required: false })
    weight: number | null;

    @ApiProperty({ description: 'Height in cm', example: 180, required: false })
    height: number | null;

    @ApiProperty({ description: 'Birth date', example: '1995-05-15T00:00:00.000Z', required: false })
    birthDate: Date | null;

    @ApiProperty({ description: 'Nationality (ISO-2 code)', example: 'FR', required: false })
    nationality: string | null;

    @ApiProperty({ description: 'Gender', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE', required: false })
    gender: string | null;

    @ApiProperty({ description: 'Creation date', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update date', example: '2024-01-01T00:00:00.000Z' })
    updatedAt: Date;
}

export class SensitivePlayerDataListItemDto {
    @ApiProperty({ description: 'ID of the sensitive player data', example: 1 })
    id: number;

    @ApiProperty({ description: 'ID of the player', example: 1 })
    playerId: number;

    @ApiProperty({ description: 'Weight in kg', example: 75.5, required: false })
    weight: number | null;

    @ApiProperty({ description: 'Height in cm', example: 180, required: false })
    height: number | null;

    @ApiProperty({ description: 'Birth date', example: '1995-05-15T00:00:00.000Z', required: false })
    birthDate: Date | null;

    @ApiProperty({ description: 'Nationality (ISO-2 code)', example: 'FR', required: false })
    nationality: string | null;

    @ApiProperty({ description: 'Gender', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE', required: false })
    gender: string | null;
}
