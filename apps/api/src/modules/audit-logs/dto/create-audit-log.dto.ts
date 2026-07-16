import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateAuditLogDto {
    @ApiProperty({
        description: "ID de l'utilisateur",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    userId?: number;

    @ApiProperty({
        description: 'Action effectuée',
        example: 'CREATE_PLAYER',
        maxLength: 255,
    })
    @IsString()
    @MaxLength(255)
    action: string;

    @ApiProperty({
        description: 'Type de la cible',
        example: 'Player',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    targetType: string;

    @ApiProperty({
        description: 'ID de la cible',
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    targetId?: number;
}
