import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, MaxLength } from 'class-validator';

export class CreatePositionDto {
    @ApiProperty({
        description: 'Nom de la position',
        example: 'Ailier gauche',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({
        description: 'ID du sport',
        example: 1,
    })
    @IsInt()
    @Min(1)
    sportId: number;
}
