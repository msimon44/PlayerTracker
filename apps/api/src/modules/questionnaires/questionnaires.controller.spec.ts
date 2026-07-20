import { QuestionnairesController } from './questionnaires.controller';
import { QuestionnairesService } from './questionnaires.service';

describe('QuestionnairesController', () => {
    let controller: QuestionnairesController;
    let service: {
        findAll: jest.Mock;
        findResults: jest.Mock;
        findRespondents: jest.Mock;
        findOne: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        remove: jest.Mock;
    };

    beforeEach(() => {
        service = {
            findAll: jest.fn(),
            findResults: jest.fn(),
            findRespondents: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new QuestionnairesController(service as unknown as QuestionnairesService);
    });

    it('findAll converts the clubId query param to a number', async () => {
        service.findAll.mockResolvedValue([]);
        await controller.findAll('1');
        expect(service.findAll).toHaveBeenCalledWith(1);
    });

    it('findResults delegates with a numeric id', async () => {
        service.findResults.mockResolvedValue({ id: 1 });
        await controller.findResults(1);
        expect(service.findResults).toHaveBeenCalledWith(1);
    });

    it('findRespondents delegates with a numeric id', async () => {
        service.findRespondents.mockResolvedValue({ id: 1 });
        await controller.findRespondents(1);
        expect(service.findRespondents).toHaveBeenCalledWith(1);
    });

    it('findOne delegates with a numeric id', async () => {
        service.findOne.mockResolvedValue({ id: 1 });
        await controller.findOne(1);
        expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('create delegates with the request body', async () => {
        const dto = { title: 'Ressenti', teamId: 1, createdBy: 5 };
        service.create.mockResolvedValue({ id: 1, ...dto });
        await controller.create(dto as any);
        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('update delegates with the id and request body', async () => {
        const dto = { title: 'Modifié' };
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
