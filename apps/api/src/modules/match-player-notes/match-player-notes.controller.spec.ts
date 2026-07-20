import { MatchPlayerNotesController } from './match-player-notes.controller';
import { MatchPlayerNotesService } from './match-player-notes.service';

describe('MatchPlayerNotesController', () => {
    let controller: MatchPlayerNotesController;
    let service: { findAll: jest.Mock; create: jest.Mock; update: jest.Mock };

    beforeEach(() => {
        service = { findAll: jest.fn(), create: jest.fn(), update: jest.fn() };
        controller = new MatchPlayerNotesController(service as unknown as MatchPlayerNotesService);
    });

    it('converts both eventId and playerId query params to numbers', async () => {
        service.findAll.mockResolvedValue([]);

        await controller.findAll('1', '5');

        expect(service.findAll).toHaveBeenCalledWith(1, 5);
    });

    it('passes undefined for parameters that are not provided', async () => {
        service.findAll.mockResolvedValue([]);

        await controller.findAll();

        expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
    });

    it('create delegates with the request body', async () => {
        const dto = { eventId: 1, playerId: 1, staffId: 5, rating: 8 };
        service.create.mockResolvedValue({ id: 1, ...dto });

        await controller.create(dto as any);

        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('update converts the string id param to a number', async () => {
        const dto = { rating: 9 };
        service.update.mockResolvedValue({ id: 1, ...dto });

        await controller.update('1', dto as any);

        expect(service.update).toHaveBeenCalledWith(1, dto);
    });
});
