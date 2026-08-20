import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('/health (GET) - Terminus health check', () => {
        return request(app.getHttpServer())
            .get('/health')
            .expect((res) => {
                // Terminus renvoie 200 si toutes les sondes sont OK,
                // 503 en cas d'echec. On accepte les deux pour un test e2e
                // qui n'a pas forcement de base PostgreSQL disponible.
                if (![200, 503].includes(res.status)) {
                    throw new Error(`Statut inattendu: ${res.status}`);
                }
                expect(res.body).toHaveProperty('status');
                expect(res.body).toHaveProperty('info');
                expect(res.body).toHaveProperty('details');
                expect(res.body.details).toHaveProperty('memory_heap');
                expect(res.body.details).toHaveProperty('memory_rss');
                expect(res.body.details).toHaveProperty('database');
            });
    });
});
