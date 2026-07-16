import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class UpdatePlayersOrderDto {
    @ApiProperty({
        type: [Number],
        description: 'IDs des joueurs dans le nouvel ordre',
        example: [1, 2, 3],
    })
    @IsArray()
    @IsNumber({}, { each: true })
    playerIds: number[];
}
