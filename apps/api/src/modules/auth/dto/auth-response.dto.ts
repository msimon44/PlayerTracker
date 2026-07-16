import { ApiProperty } from '@nestjs/swagger';

export interface OAuthProviderData {
    provider: string;
    providerId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string | null;
    accessToken?: string;
    refreshToken?: string | null;
    platform: 'web' | 'mobile';
}

/**
 * Nested Player profile for auth responses
 */
class PlayerAuthDto {
    @ApiProperty({ description: 'Player ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'First name', example: 'John' })
    firstName: string;

    @ApiProperty({ description: 'Last name', example: 'Doe' })
    lastName: string;

    @ApiProperty({ description: 'Club ID', example: 1 })
    clubId: number;

    @ApiProperty({ description: 'Team ID', example: 1, nullable: true })
    teamId: number | null;

    @ApiProperty({ description: 'Position ID', example: 1, nullable: true })
    positionId: number | null;

    @ApiProperty({ description: 'Is active', example: true })
    isActive: boolean;
}

/**
 * Nested Staff profile for auth responses
 */
class StaffAuthDto {
    @ApiProperty({ description: 'Staff ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'First name', example: 'John', nullable: true })
    firstName: string | null;

    @ApiProperty({ description: 'Last name', example: 'Doe', nullable: true })
    lastName: string | null;

    @ApiProperty({ description: 'Specialty', example: 'Physiotherapist', nullable: true })
    specialty: string | null;

    @ApiProperty({ description: 'Club ID', example: 1 })
    clubId: number;
}

export class UserAuthDto {
    @ApiProperty({ description: 'User ID', example: 1 })
    id: number;
    @ApiProperty({ description: 'Email', example: 'john@example.com' })
    email: string;
    @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg', nullable: true })
    avatarUrl: string | null;
    @ApiProperty({ description: 'Is email verified', example: true })
    isEmailVerified: boolean;
    @ApiProperty({ description: 'Last login timestamp', nullable: true })
    lastLoginAt: Date | null;
    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;
    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;
    @ApiProperty({ description: 'Consent given', example: true })
    consentGiven: boolean;
    @ApiProperty({ description: 'Consent given timestamp', nullable: true })
    consentGivenAt: Date | null;
    @ApiProperty({ description: 'Deletion timestamp', nullable: true })
    deletedAt: Date | null;
    @ApiProperty({ description: 'Is deleted', example: false })
    isDeleted: boolean;
    @ApiProperty({ description: 'User role', example: 'PLAYER' })
    role: string;
    @ApiProperty({ description: 'Player profile', type: PlayerAuthDto, nullable: true })
    player: PlayerAuthDto | null;
    @ApiProperty({ description: 'Staff profile', type: StaffAuthDto, nullable: true })
    staff: StaffAuthDto | null;
}

class TokensDto {
    @ApiProperty({ description: 'Access token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    accessToken: string;
    @ApiProperty({ description: 'Refresh token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    refreshToken: string;
    @ApiProperty({ description: 'Token expiration time in seconds', example: 900 })
    expiresIn: number;
    @ApiProperty({ description: 'Token type', example: 'Bearer' })
    tokenType: string;
}

export class LoginResponse {
    @ApiProperty({ description: 'User details', type: UserAuthDto })
    user: UserAuthDto;
    @ApiProperty({ description: 'Authentication tokens', type: TokensDto })
    tokens: TokensDto;
}
