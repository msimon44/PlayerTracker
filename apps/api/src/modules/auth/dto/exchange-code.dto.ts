import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ExchangeCodeDto {
    @ApiProperty({
        description: 'Temporary authorization code from OAuth callback',
        example: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
        minLength: 64,
        maxLength: 64,
    })
    @IsString()
    @Length(64, 64, { message: 'Authorization code must be exactly 64 characters' })
    code: string;
}
