import { NotFoundException } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';

describe('AuditLogsService', () => {
    let service: AuditLogsService;
    let prisma: any;

    const logRecord = {
        id: 1,
        userId: 1,
        action: 'UPDATE',
        targetType: 'Player',
        targetId: 5,
        createdAt: new Date('2026-01-01'),
        user: { id: 1, email: 'jane@example.com', avatarUrl: null },
    };

    beforeEach(() => {
        prisma = {
            auditLog: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        service = new AuditLogsService(prisma);
    });

    it('findAll maps logs and aliases targetType/targetId to entity/entityId', async () => {
        prisma.auditLog.findMany.mockResolvedValue([logRecord]);

        const result = await service.findAll();

        expect(result).toHaveLength(1);
        expect(result[0]?.entity).toBe('Player');
        expect(result[0]?.entityId).toBe(5);
    });

    describe('findOne', () => {
        it('returns the log when found', async () => {
            prisma.auditLog.findUnique.mockResolvedValue(logRecord);

            const result = await service.findOne(1);

            expect(result.entity).toBe('Player');
        });

        it('throws NotFoundException when not found', async () => {
            prisma.auditLog.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    it('create persists a new log entry', async () => {
        prisma.auditLog.create.mockResolvedValue(logRecord);

        const result = await service.create({ userId: 1, action: 'UPDATE', targetType: 'Player', targetId: 5 } as any);

        expect(result.entity).toBe('Player');
    });

    it('update persists changes', async () => {
        prisma.auditLog.update.mockResolvedValue({ ...logRecord, action: 'DELETE' });

        const result = await service.update(1, { action: 'DELETE' } as any);

        expect(result.action).toBe('DELETE');
    });

    it('remove deletes the log entry', async () => {
        prisma.auditLog.delete.mockResolvedValue(logRecord);

        const result = await service.remove(1);

        expect(result.id).toBe(1);
    });
});
