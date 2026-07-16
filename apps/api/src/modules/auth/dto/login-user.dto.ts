import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({
        description: "Email de l'utilisateur",
        example: 'john.doe@example.com',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({
        description: 'Mot de passe',
        example: 'Password123!',
        minLength: 1,
    })
    @IsString()
    @MinLength(1, { message: 'Password is required' })
    password: string;

    @ApiProperty({
        description: 'Se souvenir de moi',
        required: false,
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    rememberMe?: boolean;
}
