import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';

describe('ClubsController', () => {
    let controller: ClubsController;
    let service: { findAll: jest.Mock; findOne: jest.Mock; create: jest.Mock; update: jest.Mock; remove: jest.Mock };

    beforeEach(() => {
        service = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new ClubsController(service as unknown as ClubsService);
    });

    it('findAll delegates to the service', async () => {
        service.findAll.mockResolvedValue([{ id: 1, name: 'FC Test' }]);

        const result = await controller.findAll();

        expect(result).toEqual([{ id: 1, name: 'FC Test' }]);
        expect(service.findAll).toHaveBeenCalled();
    });

    it('findOne delegates to the service with the given id', async () => {
        service.findOne.mockResolvedValue({ id: 1, name: 'FC Test' });

        const result = await controller.findOne(1);

        expect(result).toEqual({ id: 1, name: 'FC Test' });
        expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('create delegates to the service with the request body', async () => {
        const dto = { name: 'FC Test' };
        service.create.mockResolvedValue({ id: 1, ...dto });

        const result = await controller.create(dto as any);

        expect(result).toEqual({ id: 1, ...dto });
        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('update delegates to the service with the id and request body', async () => {
        const dto = { name: 'FC Renamed' };
        service.update.mockResolvedValue({ id: 1, ...dto });

        const result = await controller.update(1, dto as any);

        expect(result).toEqual({ id: 1, ...dto });
        expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('remove delegates to the service with the given id', async () => {
        service.remove.mockResolvedValue(undefined);

        await controller.remove(1);

        expect(service.remove).toHaveBeenCalledWith(1);
    });
});
