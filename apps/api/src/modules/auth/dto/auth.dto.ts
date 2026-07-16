import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsBoolean, IsEnum, IsDate, IsUrl, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { MatchPassword } from '../validators/match-password.validator';
import { IsStrongPassword } from '../validators/password-strength.validator';

// =============================================================================
// DTOs SWAGGER + CLASS-VALIDATOR
// =============================================================================
// These DTOs use Swagger decorators and class-validator for validation

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

    @ApiProperty({
        description: 'Plateforme de connexion (web = STAFF uniquement, mobile = PLAYER uniquement)',
        enum: ['web', 'mobile'],
        example: 'web',
    })
    @IsEnum(['web', 'mobile'], { message: 'Platform must be either web or mobile' })
    platform: 'web' | 'mobile';
}

export class RegisterUserDto {
    @ApiProperty({
        description: "Email de l'utilisateur",
        example: 'john.doe@example.com',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({
        description: 'Mot de passe (min 8 caractères, majuscule, minuscule, chiffre, caractère spécial)',
        example: 'Password123!',
        minLength: 8,
    })
    @IsString()
    @IsStrongPassword()
    password: string;

    @ApiProperty({
        description: "Rôle de l'utilisateur",
        enum: ['PLAYER', 'STAFF', 'ADMIN'],
        default: 'PLAYER',
        example: 'PLAYER',
    })
    @IsEnum(['PLAYER', 'STAFF', 'ADMIN'])
    role: 'PLAYER' | 'STAFF' | 'ADMIN' = 'PLAYER';

    @ApiProperty({
        description: 'Consentement donné pour le traitement des données',
        example: true,
    })
    @IsBoolean()
    consentGiven: boolean;

    @ApiProperty({
        description: "Plateforme d'inscription (web = STAFF uniquement, mobile = PLAYER uniquement)",
        enum: ['web', 'mobile'],
        example: 'web',
    })
    @IsEnum(['web', 'mobile'], { message: 'Platform must be either web or mobile' })
    platform: 'web' | 'mobile';

    @ApiProperty({
        description: 'Prénom (requis pour STAFF sur web)',
        example: 'John',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(1, { message: 'First name is required for staff registration' })
    firstName?: string;

    @ApiProperty({
        description: 'Nom de famille (requis pour STAFF sur web)',
        example: 'Doe',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(1, { message: 'Last name is required for staff registration' })
    lastName?: string;

    @ApiProperty({
        description: 'ID du club (pour rejoindre un club existant)',
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsInt({ message: 'Club ID must be an integer' })
    clubId?: number;

    @ApiProperty({
        description: "Nom du club à créer (si création d'un nouveau club)",
        example: 'FC Paris',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(1, { message: 'Club name must not be empty' })
    clubName?: string;
}

export class VerifyEmailDto {
    @ApiProperty({
        description: 'Token de vérification email',
        example: 'abc123xyz',
    })
    @IsString()
    @MinLength(1, { message: 'Verification token is required' })
    token: string;
}

export class ResendVerificationDto {
    @ApiProperty({
        description: "Email de l'utilisateur",
        example: 'john.doe@example.com',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;
}

export class ForgotPasswordDto {
    @ApiProperty({
        description: "Email de l'utilisateur",
        example: 'john.doe@example.com',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({
        description: 'Token de réinitialisation',
        example: 'abc123xyz',
    })
    @IsString()
    @MinLength(1, { message: 'Reset token is required' })
    token: string;

    @ApiProperty({
        description: 'Nouveau mot de passe (min 8 caractères, majuscule, minuscule, chiffre, caractère spécial)',
        example: 'NewPassword123!',
        minLength: 8,
    })
    @IsString()
    @IsStrongPassword()
    password: string;

    @ApiProperty({
        description: 'Confirmation du mot de passe',
        example: 'NewPassword123!',
        minLength: 8,
    })
    @IsString()
    @IsStrongPassword()
    @MatchPassword('password')
    confirmPassword: string;
}

export class ChangePasswordDto {
    @ApiProperty({
        description: 'Mot de passe actuel',
        example: 'OldPassword123!',
    })
    @IsString()
    @MinLength(1, { message: 'Current password is required' })
    currentPassword: string;

    @ApiProperty({
        description: 'Nouveau mot de passe (min 8 caractères, majuscule, minuscule, chiffre, caractère spécial)',
        example: 'NewPassword123!',
        minLength: 8,
    })
    @IsString()
    @IsStrongPassword()
    newPassword: string;

    @ApiProperty({
        description: 'Confirmation du nouveau mot de passe',
        example: 'NewPassword123!',
        minLength: 8,
    })
    @IsString()
    @IsStrongPassword()
    @MatchPassword('newPassword')
    confirmPassword: string;
}

export class ConfirmOAuthLinkingDto {
    @ApiProperty({
        description: 'Token de confirmation de liaison OAuth',
        example: 'abc123xyz',
    })
    @IsString()
    @MinLength(1, { message: 'Linking token is required' })
    token: string;
}

export class RefreshTokenDto {
    @ApiProperty({
        description: 'Token de rafraîchissement',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsString()
    @MinLength(1, { message: 'Refresh token is required' })
    refreshToken: string;
}

export class OAuthLoginDto {
    @ApiProperty({
        description: 'Fournisseur OAuth',
        enum: ['GOOGLE', 'APPLE'],
        example: 'GOOGLE',
    })
    @IsEnum(['GOOGLE', 'APPLE'])
    provider: 'GOOGLE' | 'APPLE';

    @ApiProperty({
        description: "Code d'autorisation OAuth",
        example: 'abc123xyz',
    })
    @IsString()
    @MinLength(1)
    code: string;

    @ApiProperty({
        description: 'URI de redirection (optionnel)',
        required: false,
        example: 'https://example.com/callback',
    })
    @IsOptional()
    @IsUrl()
    redirectUri?: string;
}

// =============================================================================
// TYPES OAUTH PROVIDER DATA
// =============================================================================

export class OAuthProviderDataDto {
    @ApiProperty({
        description: "Email de l'utilisateur",
        example: 'john.doe@example.com',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({
        description: 'Prénom (optionnel)',
        required: false,
        example: 'John',
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    firstName?: string;

    @ApiProperty({
        description: 'Nom de famille (optionnel)',
        required: false,
        example: 'Doe',
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    lastName?: string;

    @ApiProperty({
        description: "URL de l'avatar (optionnel)",
        required: false,
        example: 'https://example.com/avatar.jpg',
    })
    @IsOptional()
    @IsUrl()
    avatarUrl?: string;

    @ApiProperty({
        description: 'Nom du fournisseur',
        example: 'google',
    })
    @IsString()
    @MinLength(1)
    provider: string;

    @ApiProperty({
        description: 'ID du fournisseur',
        example: '1234567890',
    })
    @IsString()
    @MinLength(1)
    providerId: string;

    @ApiProperty({
        description: 'Access token (optionnel)',
        required: false,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsOptional()
    @IsString()
    accessToken?: string;

    @ApiProperty({
        description: 'Refresh token (optionnel)',
        required: false,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsOptional()
    @IsString()
    refreshToken?: string;

    @ApiProperty({
        description: "Date d'expiration (optionnel)",
        required: false,
        example: '2024-12-31T23:59:59.000Z',
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    expiresAt?: Date;
}

// =============================================================================
// EXPORTED TYPE FOR COMPATIBILITY
// =============================================================================

export type OAuthProviderData = {
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    provider: string;
    providerId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
};
