import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: 'Date de dernière connexion',
        required: false,
        example: '2024-01-01T00:00:00.000Z',
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    lastLoginAt?: Date;
}
