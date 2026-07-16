import { ApiProperty } from '@nestjs/swagger';

class ClubNestedDto {
    @ApiProperty({ description: 'Club ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Club name', example: 'FC Barcelona' })
    name: string;

    @ApiProperty({ description: 'Logo URL', example: 'https://example.com/logo.png', nullable: true })
    logoUrl: string | null;
}

class UserNestedDto {
    @ApiProperty({ description: 'User ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Email address', example: 'john.doe@example.com' })
    email: string;

    @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg', nullable: true })
    avatarUrl: string | null;

    @ApiProperty({ description: 'User role', example: 'STAFF', enum: ['PLAYER', 'STAFF', 'ADMIN'] })
    role: string;
}

class CountDto {
    @ApiProperty({ description: 'Number of created questionnaires', example: 10 })
    createdQuestionnaires: number;
}

export class StaffListItemDto {
    @ApiProperty({ description: 'Staff ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'User ID', example: 1 })
    userId: number;

    @ApiProperty({ description: 'First name', example: 'John', nullable: true })
    firstName: string | null;

    @ApiProperty({ description: 'Last name', example: 'Doe', nullable: true })
    lastName: string | null;

    @ApiProperty({ description: 'Specialty', example: 'Physiotherapist', nullable: true })
    specialty: string | null;

    @ApiProperty({ description: 'Club ID', example: 1 })
    clubId: number;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'Club details', type: ClubNestedDto })
    club: ClubNestedDto;

    @ApiProperty({ description: 'Counts', type: CountDto })
    _count: CountDto;
}

export class StaffResponseDto {
    @ApiProperty({ description: 'Staff ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'User ID', example: 1 })
    userId: number;

    @ApiProperty({ description: 'First name', example: 'John', nullable: true })
    firstName: string | null;

    @ApiProperty({ description: 'Last name', example: 'Doe', nullable: true })
    lastName: string | null;

    @ApiProperty({ description: 'Specialty', example: 'Physiotherapist', nullable: true })
    specialty: string | null;

    @ApiProperty({ description: 'Club ID', example: 1 })
    clubId: number;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2024-01-15T12:00:00Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'Club details', type: ClubNestedDto })
    club: ClubNestedDto;

    @ApiProperty({ description: 'User details', type: UserNestedDto })
    user: UserNestedDto;
}
