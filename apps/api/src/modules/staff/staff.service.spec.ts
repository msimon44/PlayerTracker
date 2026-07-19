import { NotFoundException } from '@nestjs/common';
import { StaffService } from './staff.service';

describe('StaffService', () => {
    let service: StaffService;
    let prisma: any;

    const staffRecord = {
        id: 1,
        userId: 10,
        firstName: 'John',
        lastName: 'Coach',
        specialty: 'Préparation physique',
        clubId: 1,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
        club: { id: 1, name: 'FC Test', logoUrl: null },
        user: { id: 10, email: 'coach@example.com', avatarUrl: null, role: 'STAFF' },
        _count: { createdQuestionnaires: 2 },
    };

    beforeEach(() => {
        prisma = {
            staff: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        service = new StaffService(prisma);
    });

    describe('findAll', () => {
        it('filters by clubId when provided', async () => {
            prisma.staff.findMany.mockResolvedValue([staffRecord]);

            await service.findAll(1);

            expect(prisma.staff.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { clubId: 1 } }));
        });

        it('does not filter when clubId is not provided', async () => {
            prisma.staff.findMany.mockResolvedValue([staffRecord]);

            await service.findAll();

            expect(prisma.staff.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: undefined }));
        });
    });

    describe('findOne', () => {
        it('returns the staff member when found', async () => {
            prisma.staff.findUnique.mockResolvedValue(staffRecord);

            const result = await service.findOne(1);

            expect(result.firstName).toBe('John');
        });

        it('throws NotFoundException when not found', async () => {
            prisma.staff.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByUserId', () => {
        it('returns the staff member linked to the user', async () => {
            prisma.staff.findUnique.mockResolvedValue(staffRecord);

            const result = await service.findByUserId(10);

            expect(result.userId).toBe(10);
        });

        it('throws NotFoundException when no staff record is linked to the user', async () => {
            prisma.staff.findUnique.mockResolvedValue(null);

            await expect(service.findByUserId(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('creates a staff member', async () => {
            prisma.staff.create.mockResolvedValue(staffRecord);

            const result = await service.create({ firstName: 'John', lastName: 'Coach', clubId: 1 } as any);

            expect(result.firstName).toBe('John');
        });
    });

    describe('update', () => {
        it('updates a staff member', async () => {
            prisma.staff.update.mockResolvedValue({ ...staffRecord, specialty: 'Kinésithérapie' });

            const result = await service.update(1, { specialty: 'Kinésithérapie' } as any);

            expect(result.specialty).toBe('Kinésithérapie');
        });
    });

    describe('remove', () => {
        it('deletes a staff member', async () => {
            prisma.staff.delete.mockResolvedValue(staffRecord);

            const result = await service.remove(1);

            expect(result.id).toBe(1);
            expect(prisma.staff.delete).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1 } }));
        });
    });
});
