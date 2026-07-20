import { HttpException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let controller: UsersController;
    let service: {
        findAll: jest.Mock;
        findOne: jest.Mock;
        findByEmail: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        remove: jest.Mock;
    };

    beforeEach(() => {
        service = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new UsersController(service as unknown as UsersService);
    });

    it('findAll delegates to the service', async () => {
        service.findAll.mockResolvedValue([]);

        await controller.findAll();

        expect(service.findAll).toHaveBeenCalled();
    });

    it('findOne delegates with the given id', async () => {
        service.findOne.mockResolvedValue({ id: 1 });

        await controller.findOne(1);

        expect(service.findOne).toHaveBeenCalledWith(1);
    });

    describe('findByEmail', () => {
        it('returns the full user profile when the email matches an account', async () => {
            service.findByEmail.mockResolvedValue({ id: 1, email: 'jane@example.com' });
            service.findOne.mockResolvedValue({ id: 1, email: 'jane@example.com' });

            const result = await controller.findByEmail('jane@example.com');

            expect(result).toEqual({ id: 1, email: 'jane@example.com' });
            expect(service.findOne).toHaveBeenCalledWith(1);
        });

        it('throws a 404 HttpException when no account matches the email', async () => {
            service.findByEmail.mockResolvedValue(null);

            await expect(controller.findByEmail('unknown@example.com')).rejects.toThrow(HttpException);
        });
    });

    it('create delegates with the request body', async () => {
        const dto = { email: 'jane@example.com', password: 'StrongPassword123!' };
        service.create.mockResolvedValue({ id: 1, email: dto.email });

        await controller.create(dto as any);

        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('update delegates with the id and request body', async () => {
        const dto = { avatarUrl: 'new.png' };
        service.update.mockResolvedValue({ id: 1, ...dto });

        await controller.update(1, dto as any);

        expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('remove delegates with the given id', async () => {
        service.remove.mockResolvedValue({ id: 1 });

        await controller.remove(1);

        expect(service.remove).toHaveBeenCalledWith(1);
    });
});
