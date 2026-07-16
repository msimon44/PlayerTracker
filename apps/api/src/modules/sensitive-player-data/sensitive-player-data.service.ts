import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSensitivePlayerDataDto } from './dto/create-sensitive-player-data.dto';
import {
    SensitivePlayerDataListItemDto,
    SensitivePlayerDataResponseDto,
} from './dto/sensitive-player-data-response.dto';
import { UpdateSensitivePlayerDataDto } from './dto/update-sensitive-player-data.dto';

@Injectable()
export class SensitivePlayerDataService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<SensitivePlayerDataListItemDto[]> {
        const data = await this.prisma.sensitivePlayerData.findMany({
            select: {
                id: true,
                playerId: true,
                weight: true,
                height: true,
                birthDate: true,
                nationality: true,
                gender: true,
            },
        });
        return data.map((item) => ({
            id: item.id,
            playerId: item.playerId,
            weight: item.weight,
            height: item.height,
            birthDate: item.birthDate,
            nationality: item.nationality,
            gender: item.gender,
        }));
    }

    async findOne(id: number): Promise<SensitivePlayerDataResponseDto> {
        const data = await this.prisma.sensitivePlayerData.findUnique({ where: { id } });
        if (!data) throw new NotFoundException('Sensitive player data not found');
        return {
            id: data.id,
            playerId: data.playerId,
            weight: data.weight,
            height: data.height,
            birthDate: data.birthDate,
            nationality: data.nationality,
            gender: data.gender,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    async create(createDto: CreateSensitivePlayerDataDto): Promise<SensitivePlayerDataResponseDto> {
        const data = await this.prisma.sensitivePlayerData.create({ data: createDto });
        return {
            id: data.id,
            playerId: data.playerId,
            weight: data.weight,
            height: data.height,
            birthDate: data.birthDate,
            nationality: data.nationality,
            gender: data.gender,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    async update(id: number, updateDto: UpdateSensitivePlayerDataDto): Promise<SensitivePlayerDataResponseDto> {
        const data = await this.prisma.sensitivePlayerData.update({ where: { id }, data: updateDto });
        return {
            id: data.id,
            playerId: data.playerId,
            weight: data.weight,
            height: data.height,
            birthDate: data.birthDate,
            nationality: data.nationality,
            gender: data.gender,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    async remove(id: number): Promise<SensitivePlayerDataResponseDto> {
        const data = await this.prisma.sensitivePlayerData.delete({ where: { id } });
        return {
            id: data.id,
            playerId: data.playerId,
            weight: data.weight,
            height: data.height,
            birthDate: data.birthDate,
            nationality: data.nationality,
            gender: data.gender,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }
}
