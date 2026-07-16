import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Auth Platform Restrictions (e2e)', () => {
    let app: INestApplication<App>;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        await app.init();

        prisma = moduleFixture.get<PrismaService>(PrismaService);

        // Clean up test data before tests
        await prisma.user.deleteMany({
            where: {
                email: {
                    contains: 'platform-test',
                },
            },
        });
    });

    afterAll(async () => {
        // Clean up test data after tests
        await prisma.user.deleteMany({
            where: {
                email: {
                    contains: 'platform-test',
                },
            },
        });
        await app.close();
    });

    describe('POST /auth/register - Platform Restrictions', () => {
        it('should allow STAFF registration on web platform', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'staff-web-platform-test@example.com',
                    password: 'StrongPassword123!',
                    firstName: 'John',
                    lastName: 'Staff',
                    role: 'STAFF',
                    platform: 'web',
                    consentGiven: true,
                })
                .expect(201);

            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('tokens');
            expect(response.body.user.role).toBe('STAFF');
        });

        it('should allow PLAYER registration on mobile platform', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'player-mobile-platform-test@example.com',
                    password: 'StrongPassword123!',
                    firstName: 'Jane',
                    lastName: 'Player',
                    role: 'PLAYER',
                    platform: 'mobile',
                    consentGiven: true,
                })
                .expect(201);

            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('tokens');
            expect(response.body.user.role).toBe('PLAYER');
        });

        it('should reject PLAYER registration on web platform', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'player-web-platform-test@example.com',
                    password: 'StrongPassword123!',
                    firstName: 'Jane',
                    lastName: 'Player',
                    role: 'PLAYER',
                    platform: 'web',
                    consentGiven: true,
                })
                .expect(403);

            expect(response.body.message).toBe('Web platform is restricted to STAFF users only');
        });

        it('should reject STAFF registration on mobile platform', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'staff-mobile-platform-test@example.com',
                    password: 'StrongPassword123!',
                    firstName: 'John',
                    lastName: 'Staff',
                    role: 'STAFF',
                    platform: 'mobile',
                    consentGiven: true,
                })
                .expect(403);

            expect(response.body.message).toBe('Mobile platform is restricted to PLAYER users only');
        });

        it('should reject ADMIN registration on mobile platform', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'admin-mobile-platform-test@example.com',
                    password: 'StrongPassword123!',
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'ADMIN',
                    platform: 'mobile',
                    consentGiven: true,
                })
                .expect(403);

            expect(response.body.message).toBe('Mobile platform is restricted to PLAYER users only');
        });

        it('should reject registration without platform parameter', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'no-platform-test@example.com',
                    password: 'StrongPassword123!',
                    firstName: 'Test',
                    lastName: 'User',
                    role: 'STAFF',
                    consentGiven: true,
                })
                .expect(400);

            expect(response.body.message).toEqual(expect.arrayContaining([expect.stringMatching(/platform/i)]));
        });
    });

    describe('POST /auth/login - Platform Restrictions', () => {
        beforeAll(async () => {
            // Create test users for login tests
            await request(app.getHttpServer()).post('/auth/register').send({
                email: 'staff-login-platform-test@example.com',
                password: 'StrongPassword123!',
                firstName: 'John',
                lastName: 'Staff',
                role: 'STAFF',
                platform: 'web',
                consentGiven: true,
            });

            await request(app.getHttpServer()).post('/auth/register').send({
                email: 'player-login-platform-test@example.com',
                password: 'StrongPassword123!',
                firstName: 'Jane',
                lastName: 'Player',
                role: 'PLAYER',
                platform: 'mobile',
                consentGiven: true,
            });
        });

        it('should allow STAFF login on web platform', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'staff-login-platform-test@example.com',
                    password: 'StrongPassword123!',
                    platform: 'web',
                })
                .expect(200);

            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('tokens');
            expect(response.body.user.role).toBe('STAFF');
        });

        it('should allow PLAYER login on mobile platform', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'player-login-platform-test@example.com',
                    password: 'StrongPassword123!',
                    platform: 'mobile',
                })
                .expect(200);

            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('tokens');
            expect(response.body.user.role).toBe('PLAYER');
        });

        it('should reject STAFF login on mobile platform', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'staff-login-platform-test@example.com',
                    password: 'StrongPassword123!',
                    platform: 'mobile',
                })
                .expect(403);

            expect(response.body.message).toBe('Mobile platform is restricted to PLAYER users only');
        });

        it('should reject PLAYER login on web platform', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'player-login-platform-test@example.com',
                    password: 'StrongPassword123!',
                    platform: 'web',
                })
                .expect(403);

            expect(response.body.message).toBe('Web platform is restricted to STAFF users only');
        });

        it('should reject login without platform parameter', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'staff-login-platform-test@example.com',
                    password: 'StrongPassword123!',
                })
                .expect(400);

            expect(response.body.message).toEqual(expect.arrayContaining([expect.stringMatching(/platform/i)]));
        });
    });
});
