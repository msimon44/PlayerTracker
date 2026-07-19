import { SportsController } from './sports.controller';
import { SportsService } from './sports.service';

describe('SportsController', () => {
    let controller: SportsController;
    let service: Record<string, jest.Mock>;

    beforeEach(() => {
        service = { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn(), update: jest.fn(), remove: jest.fn() };
        controller = new SportsController(service as unknown as SportsService);
    });

    it('findAll delegates to the service', async () => {
        service.findAll.mockResolvedValue([]);
        await controller.findAll();
        expect(service.findAll).toHaveBeenCalled();
    });

    it('findOne delegates with a numeric id', async () => {
        service.findOne.mockResolvedValue({ id: 1 });
        await controller.findOne(1);
        expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('create delegates with the request body', async () => {
        const dto = { name: 'Football' };
        service.create.mockResolvedValue({ id: 1, ...dto });
        await controller.create(dto as any);
        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('update delegates with the id and request body', async () => {
        const dto = { name: 'Basketball' };
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
