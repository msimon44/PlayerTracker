import { ApiProperty } from '@nestjs/swagger';

export class UserListItemDto {
    @ApiProperty({ description: 'User ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Email address', example: 'john@example.com' })
    email: string;

    @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg', required: false })
    avatarUrl: string | null;

    @ApiProperty({ description: 'Is email verified', example: true })
    isEmailVerified: boolean;

    @ApiProperty({ description: 'Last login date', example: '2024-01-01T00:00:00.000Z', required: false })
    lastLoginAt: Date | null;

    @ApiProperty({ description: 'User role', enum: ['PLAYER', 'STAFF', 'ADMIN'], example: 'PLAYER' })
    role: string;

    @ApiProperty({ description: 'Is deleted', example: false })
    isDeleted: boolean;

    @ApiProperty({ description: 'Creation date', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;
}

export class UserDetailDto {
    @ApiProperty({ description: 'User ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Email address', example: 'john@example.com' })
    email: string;

    @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg', required: false })
    avatarUrl: string | null;

    @ApiProperty({ description: 'Is email verified', example: true })
    isEmailVerified: boolean;

    @ApiProperty({ description: 'Last login date', example: '2024-01-01T00:00:00.000Z', required: false })
    lastLoginAt: Date | null;

    @ApiProperty({ description: 'User role', enum: ['PLAYER', 'STAFF', 'ADMIN'], example: 'PLAYER' })
    role: string;

    @ApiProperty({ description: 'Consent given', example: true })
    consentGiven: boolean;

    @ApiProperty({ description: 'Consent given date', example: '2024-01-01T00:00:00.000Z', required: false })
    consentGivenAt: Date | null;

    @ApiProperty({ description: 'Is deleted', example: false })
    isDeleted: boolean;

    @ApiProperty({ description: 'Deletion date', example: '2024-01-01T00:00:00.000Z', required: false })
    deletedAt: Date | null;

    @ApiProperty({ description: 'Creation date', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update date', example: '2024-01-01T00:00:00.000Z' })
    updatedAt: Date;
}

class PlayerBasicDto {
    @ApiProperty({ description: 'Player ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'First name', example: 'John' })
    firstName: string;

    @ApiProperty({ description: 'Last name', example: 'Doe' })
    lastName: string;

    @ApiProperty({ description: 'Club ID', example: 1 })
    clubId: number;

    @ApiProperty({ description: 'Team ID', example: 1, required: false })
    teamId: number | null;

    @ApiProperty({ description: 'Position ID', example: 1, required: false })
    positionId: number | null;

    @ApiProperty({ description: 'Is active', example: true })
    isActive: boolean;
}

class StaffBasicDto {
    @ApiProperty({ description: 'Staff ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'First name', example: 'Jane', required: false })
    firstName: string | null;

    @ApiProperty({ description: 'Last name', example: 'Smith', required: false })
    lastName: string | null;

    @ApiProperty({ description: 'Club ID', example: 1 })
    clubId: number;

    @ApiProperty({ description: 'Specialty', example: 'Physical trainer', required: false })
    specialty: string | null;
}

class OAuthAccountBasicDto {
    @ApiProperty({ description: 'OAuth account ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'OAuth provider', example: 'google' })
    provider: string;

    @ApiProperty({ description: 'Provider user ID', example: '1234567890' })
    providerId: string;

    @ApiProperty({ description: 'Creation date', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;
}

export class UserWithRelationsDto {
    @ApiProperty({ description: 'User ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Email address', example: 'john@example.com' })
    email: string;

    @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg', required: false })
    avatarUrl: string | null;

    @ApiProperty({ description: 'Is email verified', example: true })
    isEmailVerified: boolean;

    @ApiProperty({ description: 'Last login date', example: '2024-01-01T00:00:00.000Z', required: false })
    lastLoginAt: Date | null;

    @ApiProperty({ description: 'User role', enum: ['PLAYER', 'STAFF', 'ADMIN'], example: 'PLAYER' })
    role: string;

    @ApiProperty({ description: 'Consent given', example: true })
    consentGiven: boolean;

    @ApiProperty({ description: 'Consent given date', example: '2024-01-01T00:00:00.000Z', required: false })
    consentGivenAt: Date | null;

    @ApiProperty({ description: 'Is deleted', example: false })
    isDeleted: boolean;

    @ApiProperty({ description: 'Deletion date', example: '2024-01-01T00:00:00.000Z', required: false })
    deletedAt: Date | null;

    @ApiProperty({ description: 'Creation date', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update date', example: '2024-01-01T00:00:00.000Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'Player profile', type: PlayerBasicDto, required: false })
    player: PlayerBasicDto | null;

    @ApiProperty({ description: 'Staff profile', type: StaffBasicDto, required: false })
    staff: StaffBasicDto | null;

    @ApiProperty({ description: 'OAuth accounts', type: [OAuthAccountBasicDto] })
    oauthAccounts: OAuthAccountBasicDto[];
}
