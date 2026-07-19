import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

describe('PlayersController', () => {
    let controller: PlayersController;
    let service: Record<string, jest.Mock>;

    beforeEach(() => {
        service = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new PlayersController(service as unknown as PlayersService);
    });

    it('findAll converts the clubId query param to a number', async () => {
        service.findAll.mockResolvedValue([]);

        await controller.findAll('1');

        expect(service.findAll).toHaveBeenCalledWith(1);
    });

    it('findAll passes undefined when clubId is not provided', async () => {
        service.findAll.mockResolvedValue([]);

        await controller.findAll();

        expect(service.findAll).toHaveBeenCalledWith(undefined);
    });

    it('findOne delegates with a numeric id', async () => {
        service.findOne.mockResolvedValue({ id: 1 });

        await controller.findOne(1);

        expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('create delegates with the request body', async () => {
        const dto = { firstName: 'John', lastName: 'Doe', clubId: 1 };
        service.create.mockResolvedValue({ id: 1, ...dto });

        await controller.create(dto as any);

        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('update delegates with the id and request body', async () => {
        const dto = { firstName: 'Jane' };
        service.update.mockResolvedValue({ id: 1, ...dto });

        await controller.update(1, dto as any);

        expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('remove delegates with a numeric id', async () => {
        service.remove.mockResolvedValue(undefined);

        await controller.remove(1);

        expect(service.remove).toHaveBeenCalledWith(1);
    });
});
