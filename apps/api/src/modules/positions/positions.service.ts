import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionResponseDto, PositionListItemDto } from './dto/position-response.dto';

@Injectable()
export class PositionsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<PositionListItemDto[]> {
        const positions = await this.prisma.position.findMany({
            select: {
                id: true,
                name: true,
                sportId: true,
                sport: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        players: true,
                    },
                },
            },
        });
        return positions.map((position) => ({
            id: position.id,
            name: position.name,
            sportId: position.sportId,
            sport: position.sport,
            _count: position._count,
        }));
    }

    async findOne(id: number): Promise<PositionResponseDto> {
        const position = await this.prisma.position.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                sportId: true,
                sport: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!position) throw new NotFoundException('Position not found');
        return {
            id: position.id,
            name: position.name,
            sportId: position.sportId,
            sport: position.sport,
        };
    }

    async create(createPositionDto: CreatePositionDto): Promise<PositionResponseDto> {
        const position = await this.prisma.position.create({
            data: createPositionDto,
            select: {
                id: true,
                name: true,
                sportId: true,
                sport: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return {
            id: position.id,
            name: position.name,
            sportId: position.sportId,
            sport: position.sport,
        };
    }

    async update(id: number, updatePositionDto: UpdatePositionDto): Promise<PositionResponseDto> {
        const position = await this.prisma.position.update({
            where: { id },
            data: updatePositionDto,
            select: {
                id: true,
                name: true,
                sportId: true,
                sport: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return {
            id: position.id,
            name: position.name,
            sportId: position.sportId,
            sport: position.sport,
        };
    }

    async remove(id: number): Promise<PositionResponseDto> {
        const position = await this.prisma.position.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                sportId: true,
                sport: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return {
            id: position.id,
            name: position.name,
            sportId: position.sportId,
            sport: position.sport,
        };
    }
}
