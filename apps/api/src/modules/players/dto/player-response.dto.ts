import { ApiProperty } from '@nestjs/swagger';

class UserNestedDto {
    @ApiProperty({ description: 'User ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Email address', example: 'john.doe@example.com' })
    email: string;

    @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg', nullable: true })
    avatarUrl: string | null;

    @ApiProperty({ description: 'Is email verified', example: true })
    isEmailVerified: boolean;

    @ApiProperty({ description: 'Last login timestamp', example: '2024-01-15T10:30:00Z', nullable: true })
    lastLoginAt: Date | null;

    @ApiProperty({ description: 'User role', example: 'PLAYER', enum: ['PLAYER', 'STAFF', 'ADMIN'] })
    role: string;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;
}

class ClubNestedDto {
    @ApiProperty({ description: 'Club ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Club name', example: 'FC Barcelona' })
    name: string;

    @ApiProperty({ description: 'Club address', example: '123 Main St', nullable: true })
    address: string | null;

    @ApiProperty({ description: 'Phone number', example: '+34 123 456 789', nullable: true })
    phone: string | null;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;
}

class TeamNestedDto {
    @ApiProperty({ description: 'Team ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Team name', example: 'First Team' })
    name: string;

    @ApiProperty({
        type: String,
        description: 'Team logo URL',
        example: 'https://example.com/logo.png',
        nullable: true,
    })
    logoUrl: string | null;

    @ApiProperty({ description: 'Club ID', example: 1 })
    clubId: number;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;
}

class PositionNestedDto {
    @ApiProperty({ description: 'Position ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Position name', example: 'Forward' })
    name: string;

    @ApiProperty({ description: 'Sport ID', example: 1 })
    sportId: number;
}

export class SensitivePlayerDataNestedDto {
    @ApiProperty({ description: 'Record ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Player ID', example: 10 })
    playerId: number;

    @ApiProperty({ type: Number, description: 'Weight in kg', example: 78.5, nullable: true })
    weight: number | null;

    @ApiProperty({ type: Number, description: 'Height in cm', example: 182, nullable: true })
    height: number | null;

    @ApiProperty({ type: Date, description: 'Birthdate', example: '2000-05-12T00:00:00.000Z', nullable: true })
    birthDate: Date | null;

    @ApiProperty({ type: String, description: 'Nationality (ISO-2 code)', example: 'FR', nullable: true })
    nationality: string | null;

    @ApiProperty({ type: String, description: 'Medical notes', example: 'Asthma', nullable: true })
    medicalNotes: string | null;

    @ApiProperty({ description: 'Gender', example: 'MALE', enum: ['MALE', 'FEMALE', 'OTHER'] })
    gender: string;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;
}

export class PlayerListItemDto {
    @ApiProperty({ description: 'Player ID', example: 1 })
    id: number;

    @ApiProperty({ type: Number, description: 'User ID', example: 1, nullable: true })
    userId: number | null;

    @ApiProperty({ description: 'First name', example: 'John' })
    firstName: string;

    @ApiProperty({ description: 'Last name', example: 'Doe' })
    lastName: string;

    @ApiProperty({ type: String, description: 'Nickname', example: 'Johnny', nullable: true })
    nickName: string | null;

    @ApiProperty({ type: String, description: 'Photo URL', example: 'https://example.com/photo.jpg', nullable: true })
    photoUrl: string | null;

    @ApiProperty({ description: 'Club ID', example: 1 })
    clubId: number;

    @ApiProperty({ type: Number, description: 'Team ID', example: 1, nullable: true })
    teamId: number | null;

    @ApiProperty({ type: Number, description: 'Position ID', example: 1, nullable: true })
    positionId: number | null;

    @ApiProperty({ description: 'Is active', example: true })
    isActive: boolean;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'Club details', type: ClubNestedDto })
    club: ClubNestedDto;

    @ApiProperty({ description: 'Team details', type: TeamNestedDto, nullable: true })
    team: TeamNestedDto | null;

    @ApiProperty({ description: 'Position details', type: PositionNestedDto, nullable: true })
    position: PositionNestedDto | null;
}

export class PlayerResponseDto {
    @ApiProperty({ description: 'Player ID', example: 1 })
    id: number;

    @ApiProperty({ type: Number, description: 'User ID', example: 1, nullable: true })
    userId: number | null;

    @ApiProperty({ description: 'First name', example: 'John' })
    firstName: string;

    @ApiProperty({ description: 'Last name', example: 'Doe' })
    lastName: string;

    @ApiProperty({ type: String, description: 'Nickname', example: 'Johnny', nullable: true })
    nickName: string | null;

    @ApiProperty({ type: String, description: 'Photo URL', example: 'https://example.com/photo.jpg', nullable: true })
    photoUrl: string | null;

    @ApiProperty({ description: 'Club ID', example: 1 })
    clubId: number;

    @ApiProperty({ type: Number, description: 'Team ID', example: 1, nullable: true })
    teamId: number | null;

    @ApiProperty({ type: Number, description: 'Position ID', example: 1, nullable: true })
    positionId: number | null;

    @ApiProperty({ description: 'Is active', example: true })
    isActive: boolean;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'User details', type: UserNestedDto, nullable: true })
    user: UserNestedDto | null;

    @ApiProperty({ description: 'Club details', type: ClubNestedDto })
    club: ClubNestedDto;

    @ApiProperty({ description: 'Team details', type: TeamNestedDto, nullable: true })
    team: TeamNestedDto | null;

    @ApiProperty({ description: 'Position details', type: PositionNestedDto, nullable: true })
    position: PositionNestedDto | null;

    @ApiProperty({
        description: 'Sensitive player data (PII/health)',
        nullable: true,
        type: () => SensitivePlayerDataNestedDto,
    })
    sensitiveData: SensitivePlayerDataNestedDto | null;
}
