import { defineConfig } from 'orval';

export default defineConfig({
    playertracker: {
        input: {
            target: '../../specs/openapi.json',
        },
        output: {
            mode: 'tags-split',
            target: './lib/generated/api.ts',
            schemas: './lib/generated/models',
            client: 'react-query',
            mock: false,
            clean: true,
            prettier: true,
            override: {
                mutator: {
                    path: './lib/api-client.ts',
                    name: 'customInstance',
                },
                query: {
                    useQuery: true,
                    useMutation: true,
                    signal: true,
                },
            },
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
});
