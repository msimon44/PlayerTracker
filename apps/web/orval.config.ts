import { defineConfig } from 'orval';

export default defineConfig({
    playertracker: {
        input: {
            target: '../../specs/openapi.json',
        },
        output: {
            mode: 'tags-split',
            target: './src/lib/generated/api.ts',
            schemas: './src/lib/generated/models',
            client: 'react-query',
            mock: false,
            clean: true,
            prettier: true,
            override: {
                mutator: {
                    path: './src/lib/api-client.ts',
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
