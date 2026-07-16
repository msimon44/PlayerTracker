import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ClubListItemDto, ClubResponseDto } from './dto/club-response.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<ClubListItemDto[]> {
        const clubs = await this.prisma.club.findMany({
            include: {
                _count: {
                    select: {
                        players: true,
                        teams: true,
                        staffs: true,
                    },
                },
            },
        });

        return clubs.map((club) => ({
            id: club.id,
            name: club.name,
            description: club.description,
            logoUrl: club.logoUrl,
            website: club.website,
            address: club.address,
            phone: club.phone,
            email: club.email,
            _count: club._count,
            createdAt: club.createdAt,
            updatedAt: club.updatedAt,
        }));
    }

    async findOne(id: number): Promise<ClubResponseDto> {
        const club = await this.prisma.club.findUnique({
            where: { id },
            include: {
                players: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        isActive: true,
                    },
                },
                teams: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        logoUrl: true,
                    },
                },
                staffs: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialty: true,
                    },
                },
            },
        });

        if (!club) {
            throw new Error(`Club with ID ${id} not found`);
        }

        return {
            id: club.id,
            name: club.name,
            description: club.description,
            logoUrl: club.logoUrl,
            website: club.website,
            address: club.address,
            phone: club.phone,
            email: club.email,
            players: club.players,
            teams: club.teams,
            staffs: club.staffs,
            createdAt: club.createdAt,
            updatedAt: club.updatedAt,
        };
    }

    async create(createClubDto: CreateClubDto): Promise<ClubResponseDto> {
        const club = await this.prisma.club.create({
            data: {
                name: createClubDto.name,
                description: createClubDto.description,
                logoUrl: createClubDto.logoUrl,
                website: createClubDto.website,
                address: createClubDto.address,
                phone: createClubDto.phone,
                email: createClubDto.email,
            },
            include: {
                players: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        isActive: true,
                    },
                },
                teams: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        logoUrl: true,
                    },
                },
                staffs: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialty: true,
                    },
                },
            },
        });

        return {
            id: club.id,
            name: club.name,
            description: club.description,
            logoUrl: club.logoUrl,
            website: club.website,
            address: club.address,
            phone: club.phone,
            email: club.email,
            players: club.players,
            teams: club.teams,
            staffs: club.staffs,
            createdAt: club.createdAt,
            updatedAt: club.updatedAt,
        };
    }

    async update(id: number, updateClubDto: UpdateClubDto): Promise<ClubResponseDto> {
        const club = await this.prisma.club.update({
            where: { id },
            data: updateClubDto,
            include: {
                players: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        isActive: true,
                    },
                },
                teams: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        logoUrl: true,
                    },
                },
                staffs: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialty: true,
                    },
                },
            },
        });

        return {
            id: club.id,
            name: club.name,
            description: club.description,
            logoUrl: club.logoUrl,
            website: club.website,
            address: club.address,
            phone: club.phone,
            email: club.email,
            players: club.players,
            teams: club.teams,
            staffs: club.staffs,
            createdAt: club.createdAt,
            updatedAt: club.updatedAt,
        };
    }

    async remove(id: number): Promise<void> {
        await this.prisma.club.delete({
            where: { id },
        });
    }
}
