import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

describe('TeamsController', () => {
    let controller: TeamsController;
    let service: {
        findAll: jest.Mock;
        findOne: jest.Mock;
        findTeamsByClubId: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        remove: jest.Mock;
        assignPlayerToTeam: jest.Mock;
        removePlayerFromTeam: jest.Mock;
    };

    beforeEach(() => {
        service = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findTeamsByClubId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            assignPlayerToTeam: jest.fn(),
            removePlayerFromTeam: jest.fn(),
        };
        controller = new TeamsController(service as unknown as TeamsService);
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

    it('findTeamsByClubId delegates with a numeric clubId', async () => {
        service.findTeamsByClubId.mockResolvedValue([]);

        await controller.findTeamsByClubId(1);

        expect(service.findTeamsByClubId).toHaveBeenCalledWith(1);
    });

    it('create delegates with the request body', async () => {
        const dto = { name: 'U18', clubId: 1 };
        service.create.mockResolvedValue({ id: 1, ...dto });

        await controller.create(dto as any);

        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('update delegates with the id and request body', async () => {
        const dto = { name: 'U19' };
        service.update.mockResolvedValue({ id: 1, ...dto });

        await controller.update(1, dto as any);

        expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('remove delegates with a numeric id', async () => {
        service.remove.mockResolvedValue(undefined);

        await controller.remove(1);

        expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('assignPlayerToTeam delegates with numeric ids', async () => {
        service.assignPlayerToTeam.mockResolvedValue({ id: 1 });

        await controller.assignPlayerToTeam(1, 5);

        expect(service.assignPlayerToTeam).toHaveBeenCalledWith(1, 5);
    });

    it('removePlayerFromTeam delegates with numeric ids', async () => {
        service.removePlayerFromTeam.mockResolvedValue({ id: 1 });

        await controller.removePlayerFromTeam(1, 5);

        expect(service.removePlayerFromTeam).toHaveBeenCalledWith(1, 5);
    });
});
