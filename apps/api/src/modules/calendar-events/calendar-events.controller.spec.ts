import { CalendarEventsController } from './calendar-events.controller';
import { CalendarEventsService } from './calendar-events.service';

describe('CalendarEventsController', () => {
    let controller: CalendarEventsController;
    let service: Record<string, jest.Mock>;

    beforeEach(() => {
        service = { findAll: jest.fn() };
        controller = new CalendarEventsController(service as unknown as CalendarEventsService);
    });

    it('converts both clubId and teamId query params to numbers', async () => {
        service.findAll.mockResolvedValue([]);

        await controller.findAll('1', '2');

        expect(service.findAll).toHaveBeenCalledWith(1, 2);
    });

    it('passes undefined for parameters that are not provided', async () => {
        service.findAll.mockResolvedValue([]);

        await controller.findAll();

        expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
    });
});
