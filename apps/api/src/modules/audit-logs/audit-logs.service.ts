import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { AuditLogResponseDto, AuditLogListItemDto } from './dto/audit-log-response.dto';

@Injectable()
export class AuditLogsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<AuditLogListItemDto[]> {
        const logs = await this.prisma.auditLog.findMany({
            select: {
                id: true,
                userId: true,
                action: true,
                targetType: true,
                targetId: true,
                createdAt: true,
                user: { select: { id: true, email: true, avatarUrl: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return logs.map((log) => ({
            ...log,
            entity: log.targetType,
            entityId: log.targetId,
        }));
    }

    async findOne(id: number): Promise<AuditLogResponseDto> {
        const log = await this.prisma.auditLog.findUnique({
            where: { id },
            select: {
                id: true,
                userId: true,
                action: true,
                targetType: true,
                targetId: true,
                createdAt: true,
                user: { select: { id: true, email: true, avatarUrl: true } },
            },
        });
        if (!log) throw new NotFoundException('Audit log not found');
        return {
            ...log,
            entity: log.targetType,
            entityId: log.targetId,
        };
    }

    async create(createDto: CreateAuditLogDto): Promise<AuditLogResponseDto> {
        const log = await this.prisma.auditLog.create({
            data: createDto,
            select: {
                id: true,
                userId: true,
                action: true,
                targetType: true,
                targetId: true,
                createdAt: true,
                user: { select: { id: true, email: true, avatarUrl: true } },
            },
        });
        return {
            ...log,
            entity: log.targetType,
            entityId: log.targetId,
        };
    }

    async update(id: number, updateDto: UpdateAuditLogDto): Promise<AuditLogResponseDto> {
        const log = await this.prisma.auditLog.update({
            where: { id },
            data: updateDto,
            select: {
                id: true,
                userId: true,
                action: true,
                targetType: true,
                targetId: true,
                createdAt: true,
                user: { select: { id: true, email: true, avatarUrl: true } },
            },
        });
        return {
            ...log,
            entity: log.targetType,
            entityId: log.targetId,
        };
    }

    async remove(id: number): Promise<AuditLogResponseDto> {
        const log = await this.prisma.auditLog.delete({
            where: { id },
            select: {
                id: true,
                userId: true,
                action: true,
                targetType: true,
                targetId: true,
                createdAt: true,
                user: { select: { id: true, email: true, avatarUrl: true } },
            },
        });
        return {
            ...log,
            entity: log.targetType,
            entityId: log.targetId,
        };
    }
}
