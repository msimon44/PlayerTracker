import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { StaffListItemDto, StaffResponseDto } from './dto/staff-response.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(clubId?: number): Promise<StaffListItemDto[]> {
        const staffList = await this.prisma.staff.findMany({
            where: clubId ? { clubId } : undefined,
            include: {
                club: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                    },
                },
                _count: {
                    select: {
                        createdQuestionnaires: true,
                    },
                },
            },
        });
        return staffList.map((staff) => ({
            id: staff.id,
            userId: staff.userId,
            firstName: staff.firstName,
            lastName: staff.lastName,
            specialty: staff.specialty,
            clubId: staff.clubId,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
            club: staff.club,
            _count: staff._count,
        }));
    }

    async findOne(id: number): Promise<StaffResponseDto> {
        const staff = await this.prisma.staff.findUnique({
            where: { id },
            select: {
                id: true,
                userId: true,
                firstName: true,
                lastName: true,
                specialty: true,
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
                user: {
                    select: {
                        id: true,
                        email: true,
                        avatarUrl: true,
                        role: true,
                    },
                },
            },
        });
        if (!staff) throw new NotFoundException('Staff not found');
        return {
            id: staff.id,
            userId: staff.userId,
            firstName: staff.firstName,
            lastName: staff.lastName,
            specialty: staff.specialty,
            clubId: staff.clubId,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
            club: staff.club,
            user: staff.user,
        };
    }

    async findByUserId(userId: number): Promise<StaffResponseDto> {
        const staff = await this.prisma.staff.findUnique({
            where: { userId },
            select: {
                id: true,
                userId: true,
                firstName: true,
                lastName: true,
                specialty: true,
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
                user: {
                    select: {
                        id: true,
                        email: true,
                        avatarUrl: true,
                        role: true,
                    },
                },
            },
        });
        if (!staff) throw new NotFoundException('Staff not found for this user');
        return {
            id: staff.id,
            userId: staff.userId,
            firstName: staff.firstName,
            lastName: staff.lastName,
            specialty: staff.specialty,
            clubId: staff.clubId,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
            club: staff.club,
            user: staff.user,
        };
    }

    async create(createStaffDto: CreateStaffDto): Promise<StaffResponseDto> {
        const staff = await this.prisma.staff.create({
            data: createStaffDto,
            select: {
                id: true,
                userId: true,
                firstName: true,
                lastName: true,
                specialty: true,
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
                user: {
                    select: {
                        id: true,
                        email: true,
                        avatarUrl: true,
                        role: true,
                    },
                },
            },
        });
        return {
            id: staff.id,
            userId: staff.userId,
            firstName: staff.firstName,
            lastName: staff.lastName,
            specialty: staff.specialty,
            clubId: staff.clubId,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
            club: staff.club,
            user: staff.user,
        };
    }

    async update(id: number, updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto> {
        const staff = await this.prisma.staff.update({
            where: { id },
            data: updateStaffDto,
            select: {
                id: true,
                userId: true,
                firstName: true,
                lastName: true,
                specialty: true,
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
                user: {
                    select: {
                        id: true,
                        email: true,
                        avatarUrl: true,
                        role: true,
                    },
                },
            },
        });
        return {
            id: staff.id,
            userId: staff.userId,
            firstName: staff.firstName,
            lastName: staff.lastName,
            specialty: staff.specialty,
            clubId: staff.clubId,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
            club: staff.club,
            user: staff.user,
        };
    }

    async remove(id: number): Promise<StaffResponseDto> {
        const staff = await this.prisma.staff.delete({
            where: { id },
            select: {
                id: true,
                userId: true,
                firstName: true,
                lastName: true,
                specialty: true,
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
                user: {
                    select: {
                        id: true,
                        email: true,
                        avatarUrl: true,
                        role: true,
                    },
                },
            },
        });
        return {
            id: staff.id,
            userId: staff.userId,
            firstName: staff.firstName,
            lastName: staff.lastName,
            specialty: staff.specialty,
            clubId: staff.clubId,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
            club: staff.club,
            user: staff.user,
        };
    }
}
