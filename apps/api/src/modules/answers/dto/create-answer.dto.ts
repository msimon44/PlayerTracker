import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateAnswerDto {
    @ApiProperty({
        description: 'ID du joueur',
        example: 1,
    })
    @IsInt()
    @Min(1)
    playerId: number;

    @ApiProperty({
        description: 'ID de la question',
        example: 1,
    })
    @IsInt()
    @Min(1)
    questionId: number;

    @ApiProperty({
        description: 'Valeur de la réponse',
        example: 'Très bien',
    })
    @IsString()
    value: string;
}
