import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateMatchPlayerNoteDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    eventId: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    playerId: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    staffId: number;

    @ApiProperty({ example: 8.4, minimum: 0, maximum: 10 })
    @IsNumber()
    @Min(0)
    @Max(10)
    rating: number;

    @ApiProperty({ example: 'Très bon impact en teamfight.', required: false, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    comment?: string;
}
