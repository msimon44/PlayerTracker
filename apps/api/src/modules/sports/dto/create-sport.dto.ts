import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateSportDto {
    @ApiProperty({
        description: 'Nom du sport',
        example: 'Football',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;
}
