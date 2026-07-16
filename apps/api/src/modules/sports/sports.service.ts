import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { SportListItemDto, SportResponseDto } from './dto/sport-response.dto';
import { UpdateSportDto } from './dto/update-sport.dto';

@Injectable()
export class SportsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<SportListItemDto[]> {
        const sports = await this.prisma.sport.findMany({
            select: {
                id: true,
                name: true,
                createdAt: true,
                _count: {
                    select: {
                        positions: true,
                        templates: true,
                    },
                },
            },
        });
        return sports.map((sport) => ({
            id: sport.id,
            name: sport.name,
            createdAt: sport.createdAt,
            _count: sport._count,
        }));
    }

    async findOne(id: number): Promise<SportResponseDto> {
        const sport = await this.prisma.sport.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                createdAt: true,
                positions: {
                    select: {
                        id: true,
                        name: true,
                        sportId: true,
                    },
                },
                templates: {
                    select: {
                        id: true,
                        sportId: true,
                        title: true,
                    },
                },
            },
        });
        if (!sport) throw new NotFoundException('Sport not found');
        return {
            id: sport.id,
            name: sport.name,
            createdAt: sport.createdAt,
            positions: sport.positions,
            templates: sport.templates,
        };
    }

    async create(createSportDto: CreateSportDto): Promise<SportResponseDto> {
        const sport = await this.prisma.sport.create({
            data: createSportDto,
            select: {
                id: true,
                name: true,
                createdAt: true,
                positions: {
                    select: {
                        id: true,
                        name: true,
                        sportId: true,
                    },
                },
                templates: {
                    select: {
                        id: true,
                        sportId: true,
                        title: true,
                    },
                },
            },
        });
        return {
            id: sport.id,
            name: sport.name,
            createdAt: sport.createdAt,
            positions: sport.positions,
            templates: sport.templates,
        };
    }

    async update(id: number, updateSportDto: UpdateSportDto): Promise<SportResponseDto> {
        const sport = await this.prisma.sport.update({
            where: { id },
            data: updateSportDto,
            select: {
                id: true,
                name: true,
                createdAt: true,
                positions: {
                    select: {
                        id: true,
                        name: true,
                        sportId: true,
                    },
                },
                templates: {
                    select: {
                        id: true,
                        sportId: true,
                        title: true,
                    },
                },
            },
        });
        return {
            id: sport.id,
            name: sport.name,
            createdAt: sport.createdAt,
            positions: sport.positions,
            templates: sport.templates,
        };
    }

    async remove(id: number): Promise<SportResponseDto> {
        const sport = await this.prisma.sport.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                createdAt: true,
                positions: {
                    select: {
                        id: true,
                        name: true,
                        sportId: true,
                    },
                },
                templates: {
                    select: {
                        id: true,
                        sportId: true,
                        title: true,
                    },
                },
            },
        });
        return {
            id: sport.id,
            name: sport.name,
            createdAt: sport.createdAt,
            positions: sport.positions,
            templates: sport.templates,
        };
    }
}
