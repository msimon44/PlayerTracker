import { UnauthorizedException } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

describe('StaffController', () => {
    let controller: StaffController;
    let service: Record<string, jest.Mock>;

    beforeEach(() => {
        service = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByUserId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new StaffController(service as unknown as StaffService);
    });

    describe('findCurrentStaff', () => {
        it('returns the staff profile linked to the authenticated user', async () => {
            service.findByUserId.mockResolvedValue({ id: 1, userId: 10 });

            const result = await controller.findCurrentStaff({ user: { userId: 10 } } as any);

            expect(result).toEqual({ id: 1, userId: 10 });
            expect(service.findByUserId).toHaveBeenCalledWith(10);
        });

        it('throws UnauthorizedException when the request has no authenticated user', () => {
            expect(() => controller.findCurrentStaff({ user: undefined } as any)).toThrow(UnauthorizedException);
        });

        it('throws UnauthorizedException when the user object has no userId', () => {
            expect(() => controller.findCurrentStaff({ user: {} } as any)).toThrow(UnauthorizedException);
        });
    });

    it('findAll converts the clubId query param to a number', async () => {
        service.findAll.mockResolvedValue([]);

        await controller.findAll('1');

        expect(service.findAll).toHaveBeenCalledWith(1);
    });

    it('findOne delegates with a numeric id', async () => {
        service.findOne.mockResolvedValue({ id: 1 });

        await controller.findOne(1);

        expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('create delegates with the request body', async () => {
        const dto = { firstName: 'John', lastName: 'Coach', clubId: 1 };
        service.create.mockResolvedValue({ id: 1, ...dto });

        await controller.create(dto as any);

        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('update delegates with the id and request body', async () => {
        const dto = { specialty: 'Kinésithérapie' };
        service.update.mockResolvedValue({ id: 1, ...dto });

        await controller.update(1, dto as any);

        expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('remove delegates with a numeric id', async () => {
        service.remove.mockResolvedValue({ id: 1 });

        await controller.remove(1);

        expect(service.remove).toHaveBeenCalledWith(1);
    });
});
