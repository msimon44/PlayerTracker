import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerListItemDto, PlayerResponseDto } from './dto/player-response.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(clubId?: number): Promise<PlayerListItemDto[]> {
        const players = await this.prisma.player.findMany({
            where: clubId ? { clubId } : undefined,
            select: {
                id: true,
                userId: true,
                firstName: true,
                lastName: true,
                nickName: true,
                photoUrl: true,
                clubId: true,
                teamId: true,
                positionId: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                club: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phone: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                        clubId: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                position: {
                    select: {
                        id: true,
                        name: true,
                        sportId: true,
                    },
                },
            },
        });

        return players.map((player) => ({
            id: player.id,
            userId: player.userId,
            firstName: player.firstName,
            lastName: player.lastName,
            nickName: player.nickName,
            photoUrl: player.photoUrl,
            clubId: player.clubId,
            teamId: player.teamId,
            positionId: player.positionId,
            isActive: player.isActive,
            createdAt: player.createdAt,
            updatedAt: player.updatedAt,
            club: player.club,
            team: player.team,
            position: player.position,
        }));
    }

    async findOne(id: number): Promise<PlayerResponseDto> {
        const player = await this.prisma.player.findUnique({
            where: { id },
            select: {
                id: true,
                userId: true,
                firstName: true,
                lastName: true,
                nickName: true,
                photoUrl: true,
                clubId: true,
                teamId: true,
                positionId: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        avatarUrl: true,
                        isEmailVerified: true,
                        lastLoginAt: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                club: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phone: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                        clubId: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                position: {
                    select: {
                        id: true,
                        name: true,
                        sportId: true,
                    },
                },
                sensitiveData: {
                    select: {
                        id: true,
                        playerId: true,
                        weight: true,
                        height: true,
                        birthDate: true,
                        medicalNotes: true,
                        nationality: true,
                        gender: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
        if (!player) throw new NotFoundException(`Player #${id} not found`);
        return {
            id: player.id,
            userId: player.userId,
            firstName: player.firstName,
            lastName: player.lastName,
            nickName: player.nickName,
            photoUrl: player.photoUrl,
            clubId: player.clubId,
            teamId: player.teamId,
            positionId: player.positionId,
            isActive: player.isActive,
            createdAt: player.createdAt,
            updatedAt: player.updatedAt,
            user: player.user,
            club: player.club,
            team: player.team,
            position: player.position,
            sensitiveData: player.sensitiveData,
        };
    }

    async create(createPlayerDto: CreatePlayerDto): Promise<PlayerResponseDto> {
        const playerData: Prisma.PlayerCreateInput = {
            user: createPlayerDto.userId ? { connect: { id: createPlayerDto.userId } } : undefined,
            firstName: createPlayerDto.firstName,
            lastName: createPlayerDto.lastName,
            nickName: createPlayerDto.nickName,
            photoUrl: createPlayerDto.photoUrl,
            club: { connect: { id: createPlayerDto.clubId } },
            team: createPlayerDto.teamId ? { connect: { id: createPlayerDto.teamId } } : undefined,
            position: createPlayerDto.positionId ? { connect: { id: createPlayerDto.positionId } } : undefined,
            isActive: createPlayerDto.isActive ?? true,
        };

        const player = await this.prisma.player.create({
            data: playerData,
            select: {
                id: true,
                userId: true,
                firstName: true,
                lastName: true,
                nickName: true,
                photoUrl: true,
                clubId: true,
                teamId: true,
                positionId: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        avatarUrl: true,
                        isEmailVerified: true,
                        lastLoginAt: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                club: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phone: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                        clubId: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                position: {
                    select: {
                        id: true,
                        name: true,
                        sportId: true,
                    },
                },
                sensitiveData: {
                    select: {
                        id: true,
                        playerId: true,
                        weight: true,
                        height: true,
                        birthDate: true,
                        medicalNotes: true,
                        nationality: true,
                        gender: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });

        return {
            id: player.id,
            userId: player.userId,
            firstName: player.firstName,
            lastName: player.lastName,
            nickName: player.nickName,
            photoUrl: player.photoUrl,
            clubId: player.clubId,
            teamId: player.teamId,
            positionId: player.positionId,
            isActive: player.isActive,
            createdAt: player.createdAt,
            updatedAt: player.updatedAt,
            user: player.user,
            club: player.club,
            team: player.team,
            position: player.position,
            sensitiveData: player.sensitiveData,
        };
    }

    async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<PlayerResponseDto> {
        const updateData: Prisma.PlayerUpdateInput = {
            firstName: updatePlayerDto.firstName,
            lastName: updatePlayerDto.lastName,
            nickName: updatePlayerDto.nickName,
            photoUrl: updatePlayerDto.photoUrl,
            team: updatePlayerDto.teamId ? { connect: { id: updatePlayerDto.teamId } } : undefined,
            position: updatePlayerDto.positionId ? { connect: { id: updatePlayerDto.positionId } } : undefined,
            isActive: updatePlayerDto.isActive,
        };

        const player = await this.prisma.player.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                userId: true,
                firstName: true,
                lastName: true,
                nickName: true,
                photoUrl: true,
                clubId: true,
                teamId: true,
                positionId: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        avatarUrl: true,
                        isEmailVerified: true,
                        lastLoginAt: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                club: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phone: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                        clubId: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                position: {
                    select: {
                        id: true,
                        name: true,
                        sportId: true,
                    },
                },
                sensitiveData: {
                    select: {
                        id: true,
                        playerId: true,
                        weight: true,
                        height: true,
                        birthDate: true,
                        medicalNotes: true,
                        nationality: true,
                        gender: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });

        return {
            id: player.id,
            userId: player.userId,
            firstName: player.firstName,
            lastName: player.lastName,
            nickName: player.nickName,
            photoUrl: player.photoUrl,
            clubId: player.clubId,
            teamId: player.teamId,
            positionId: player.positionId,
            isActive: player.isActive,
            createdAt: player.createdAt,
            updatedAt: player.updatedAt,
            user: player.user,
            club: player.club,
            team: player.team,
            position: player.position,
            sensitiveData: player.sensitiveData,
        };
    }

    async remove(id: number): Promise<void> {
        // Récupérer le joueur pour obtenir l'ID utilisateur
        const player = await this.prisma.player.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!player) {
            throw new NotFoundException(`Player with id ${id} not found`);
        }

        // Supprimer l'utilisateur associé en premier s'il existe
        if (player.userId) {
            await this.prisma.user.delete({
                where: { id: player.userId },
            });
        }

        // Puis supprimer le joueur
        await this.prisma.player.delete({
            where: { id },
        });
    }
}
