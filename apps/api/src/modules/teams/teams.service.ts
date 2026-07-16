import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamListItemDto, TeamResponseDto } from './dto/team-response.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(clubId?: number): Promise<TeamListItemDto[]> {
        const teams = await this.prisma.team.findMany({
            where: clubId ? { clubId } : undefined,
            select: {
                id: true,
                name: true,
                description: true,
                logoUrl: true,
                sportId: true,
                clubId: true,
                createdAt: true,
                updatedAt: true,
                club: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                    },
                },
                _count: {
                    select: {
                        players: true,
                        questionnaires: true,
                    },
                },
            },
        });

        return teams.map((team) => ({
            id: team.id,
            name: team.name,
            description: team.description,
            logoUrl: team.logoUrl,
            sportId: team.sportId,
            clubId: team.clubId,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            club: team.club,
            _count: team._count,
        }));
    }

    async findOne(id: number): Promise<TeamResponseDto | null> {
        const team = await this.prisma.team.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                logoUrl: true,
                sportId: true,
                clubId: true,
                createdAt: true,
                updatedAt: true,
                club: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                    },
                },
                players: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        nickName: true,
                        photoUrl: true,
                        isActive: true,
                        positionId: true,
                    },
                },
                questionnaires: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!team) return null;

        return {
            id: team.id,
            name: team.name,
            description: team.description,
            logoUrl: team.logoUrl,
            sportId: team.sportId,
            clubId: team.clubId,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            club: team.club,
            players: team.players,
            questionnaires: team.questionnaires,
        };
    }

    async findTeamsByClubId(clubId: number): Promise<TeamListItemDto[]> {
        const teams = await this.prisma.team.findMany({
            where: { clubId },
            select: {
                id: true,
                name: true,
                description: true,
                logoUrl: true,
                sportId: true,
                clubId: true,
                createdAt: true,
                updatedAt: true,
                club: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                    },
                },
                _count: {
                    select: {
                        players: true,
                        questionnaires: true,
                    },
                },
            },
        });

        return teams.map((team) => ({
            id: team.id,
            name: team.name,
            description: team.description,
            logoUrl: team.logoUrl,
            sportId: team.sportId,
            clubId: team.clubId,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            club: team.club,
            _count: team._count,
        }));
    }

    async create(createTeamDto: CreateTeamDto): Promise<TeamResponseDto> {
        const team = await this.prisma.team.create({
            data: createTeamDto,
            select: {
                id: true,
                name: true,
                description: true,
                logoUrl: true,
                sportId: true,
                clubId: true,
                createdAt: true,
                updatedAt: true,
                club: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                    },
                },
                players: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        nickName: true,
                        photoUrl: true,
                        isActive: true,
                        positionId: true,
                    },
                },
                questionnaires: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
        });

        return {
            id: team.id,
            name: team.name,
            description: team.description,
            sportId: team.sportId,
            clubId: team.clubId,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            club: team.club,
            players: team.players,
            questionnaires: team.questionnaires,
        };
    }

    async update(id: number, updateTeamDto: UpdateTeamDto): Promise<TeamResponseDto> {
        const team = await this.prisma.team.update({
            where: { id },
            data: updateTeamDto,
            select: {
                id: true,
                name: true,
                description: true,
                logoUrl: true,
                sportId: true,
                clubId: true,
                createdAt: true,
                updatedAt: true,
                club: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                    },
                },
                players: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        nickName: true,
                        photoUrl: true,
                        isActive: true,
                        positionId: true,
                    },
                },
                questionnaires: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
        });

        return {
            id: team.id,
            name: team.name,
            description: team.description,
            logoUrl: team.logoUrl,
            sportId: team.sportId,
            clubId: team.clubId,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            club: team.club,
            players: team.players,
            questionnaires: team.questionnaires,
        };
    }

    async remove(id: number): Promise<void> {
        await this.prisma.team.delete({
            where: { id },
        });
    }

    async assignPlayerToTeam(teamId: number, playerId: number): Promise<TeamResponseDto> {
        const team = await this.prisma.$transaction(async (tx) => {
            // Connect player to team
            await tx.team.update({
                where: { id: teamId },
                data: {
                    players: {
                        connect: { id: playerId },
                    },
                },
            });

            // Mark player as active
            await tx.player.update({
                where: { id: playerId },
                data: {
                    isActive: true,
                },
            });

            // Return updated team with selections
            return tx.team.findUnique({
                where: { id: teamId },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    logoUrl: true,
                    sportId: true,
                    clubId: true,
                    createdAt: true,
                    updatedAt: true,
                    club: {
                        select: {
                            id: true,
                            name: true,
                            logoUrl: true,
                        },
                    },
                    players: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            nickName: true,
                            photoUrl: true,
                            isActive: true,
                            positionId: true,
                        },
                    },
                    questionnaires: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            createdAt: true,
                        },
                    },
                },
            });
        });

        if (!team) {
            throw new NotFoundException('Équipe introuvable');
        }

        return {
            id: team.id,
            name: team.name,
            description: team.description,
            logoUrl: team.logoUrl,
            sportId: team.sportId,
            clubId: team.clubId,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            club: team.club,
            players: team.players,
            questionnaires: team.questionnaires,
        };
    }

    async removePlayerFromTeam(teamId: number, playerId: number): Promise<TeamResponseDto> {
        const team = await this.prisma.$transaction(async (tx) => {
            // Disconnect player from team
            await tx.team.update({
                where: { id: teamId },
                data: {
                    players: {
                        disconnect: { id: playerId },
                    },
                },
            });

            // Mark player as inactive
            await tx.player.update({
                where: { id: playerId },
                data: {
                    isActive: false,
                },
            });

            // Return updated team with selections
            return tx.team.findUnique({
                where: { id: teamId },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    logoUrl: true,
                    sportId: true,
                    clubId: true,
                    createdAt: true,
                    updatedAt: true,
                    club: {
                        select: {
                            id: true,
                            name: true,
                            logoUrl: true,
                        },
                    },
                    players: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            nickName: true,
                            photoUrl: true,
                            isActive: true,
                            positionId: true,
                        },
                    },
                    questionnaires: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            createdAt: true,
                        },
                    },
                },
            });
        });

        if (!team) {
            throw new NotFoundException('Équipe introuvable');
        }

        return {
            id: team.id,
            name: team.name,
            description: team.description,
            logoUrl: team.logoUrl,
            sportId: team.sportId,
            clubId: team.clubId,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            club: team.club,
            players: team.players,
            questionnaires: team.questionnaires,
        };
    }
}
