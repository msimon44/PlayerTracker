import { ApiProperty } from '@nestjs/swagger';

class PlayerBasicDto {
    @ApiProperty({ description: 'Player ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'First name', example: 'John' })
    firstName: string;

    @ApiProperty({ description: 'Last name', example: 'Doe' })
    lastName: string;

    @ApiProperty({ description: 'Is active', example: true })
    isActive: boolean;
}

class TeamBasicDto {
    @ApiProperty({ description: 'Team ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Team name', example: 'Senior A' })
    name: string;

    @ApiProperty({ description: 'Description', example: 'First team', required: false })
    description: string | null;

    @ApiProperty({ description: 'Logo URL', example: 'https://example.com/logo.png', required: false })
    logoUrl: string | null;
}

class StaffBasicDto {
    @ApiProperty({ description: 'Staff ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'First name', example: 'Jane', required: false })
    firstName: string | null;

    @ApiProperty({ description: 'Last name', example: 'Smith', required: false })
    lastName: string | null;

    @ApiProperty({ description: 'Specialty', example: 'Physical trainer', required: false })
    specialty: string | null;
}

class ClubCountDto {
    @ApiProperty({ description: 'Number of players', example: 25 })
    players: number;

    @ApiProperty({ description: 'Number of teams', example: 3 })
    teams: number;

    @ApiProperty({ description: 'Number of staff members', example: 5 })
    staffs: number;
}

export class ClubListItemDto {
    @ApiProperty({ description: 'Club ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Club name', example: 'Rugby Club Paris' })
    name: string;

    @ApiProperty({ description: 'Description', example: 'Professional rugby club', required: false })
    description: string | null;

    @ApiProperty({ description: 'Logo URL', example: 'https://example.com/logo.png', required: false })
    logoUrl: string | null;

    @ApiProperty({ description: 'Website', example: 'https://rugbyclubparis.fr', required: false })
    website: string | null;

    @ApiProperty({ description: 'Address', example: '123 Main St, Paris', required: false })
    address: string | null;

    @ApiProperty({ description: 'Phone number', example: '+33123456789', required: false })
    phone: string | null;

    @ApiProperty({ description: 'Email', example: 'contact@rugbyclubparis.fr', required: false })
    email: string | null;

    @ApiProperty({ description: 'Counters', type: ClubCountDto })
    _count: ClubCountDto;

    @ApiProperty({ description: 'Creation date', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update date', example: '2024-01-01T00:00:00.000Z' })
    updatedAt: Date;
}

export class ClubResponseDto {
    @ApiProperty({ description: 'Club ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Club name', example: 'Rugby Club Paris' })
    name: string;

    @ApiProperty({ description: 'Description', example: 'Professional rugby club', required: false })
    description: string | null;

    @ApiProperty({ description: 'Logo URL', example: 'https://example.com/logo.png', required: false })
    logoUrl: string | null;

    @ApiProperty({ description: 'Website', example: 'https://rugbyclubparis.fr', required: false })
    website: string | null;

    @ApiProperty({ description: 'Address', example: '123 Main St, Paris', required: false })
    address: string | null;

    @ApiProperty({ description: 'Phone number', example: '+33123456789', required: false })
    phone: string | null;

    @ApiProperty({ description: 'Email', example: 'contact@rugbyclubparis.fr', required: false })
    email: string | null;

    @ApiProperty({ description: 'Players', type: [PlayerBasicDto] })
    players: PlayerBasicDto[];

    @ApiProperty({ description: 'Teams', type: [TeamBasicDto] })
    teams: TeamBasicDto[];

    @ApiProperty({ description: 'Staff members', type: [StaffBasicDto] })
    staffs: StaffBasicDto[];

    @ApiProperty({ description: 'Creation date', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update date', example: '2024-01-01T00:00:00.000Z' })
    updatedAt: Date;
}
