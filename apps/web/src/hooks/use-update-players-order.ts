import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AXIOS_INSTANCE } from '../lib/api-client';

interface UpdatePlayersOrderParams {
    teamId: number;
    playerIds: number[];
}

export const useUpdatePlayersOrder = (options?: UseMutationOptions<any, unknown, UpdatePlayersOrderParams>) => {
    return useMutation({
        mutationFn: async ({ teamId, playerIds }: UpdatePlayersOrderParams) => {
            const response = await AXIOS_INSTANCE.patch(`/teams/${teamId}/players-order`, { playerIds });
            return response.data;
        },
        ...options,
    });
};
