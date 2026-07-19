import { BadRequestException, ConflictException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
    let service: UsersService;
    let prisma: any;
    let encryptionService: { encrypt: jest.Mock; decrypt: jest.Mock };

    const userRecord = {
        id: 1,
        email: 'jane@example.com',
        avatarUrl: null,
        isEmailVerified: true,
        lastLoginAt: null,
        role: 'PLAYER',
        consentGiven: true,
        consentGivenAt: new Date('2026-01-01'),
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
        player: null,
        staff: null,
        oauthAccounts: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        prisma = {
            user: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
            oAuthAccount: {
                findUnique: jest.fn(),
                updateMany: jest.fn(),
            },
        };
        encryptionService = {
            encrypt: jest.fn((v: string) => `enc(${v})`),
            decrypt: jest.fn((v: string) => v),
        };
        service = new UsersService(prisma, encryptionService as any);
        mockedBcrypt.hash.mockResolvedValue('hashed-password' as never);
    });

    describe('findAll', () => {
        it('maps the list of users', async () => {
            prisma.user.findMany.mockResolvedValue([userRecord]);

            const result = await service.findAll();

            expect(result).toHaveLength(1);
            expect(result[0].email).toBe('jane@example.com');
        });
    });

    describe('findOne', () => {
        it('returns the user with relations when found', async () => {
            prisma.user.findUnique.mockResolvedValue(userRecord);

            const result = await service.findOne(1);

            expect(result.id).toBe(1);
        });

        it('throws a 404 HttpException when the user does not exist', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(HttpException);
            await expect(service.findOne(999)).rejects.toMatchObject({ status: 404 });
        });
    });

    describe('findByEmail', () => {
        it('returns the user including oauth accounts', async () => {
            prisma.user.findUnique.mockResolvedValue(userRecord);

            const result = await service.findByEmail('jane@example.com');

            expect(result).toEqual(userRecord);
            expect(prisma.user.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({ where: { email: 'jane@example.com' } }),
            );
        });

        it('returns null when no user matches', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            const result = await service.findByEmail('unknown@example.com');

            expect(result).toBeNull();
        });
    });

    describe('findByOAuth', () => {
        it('returns the linked user when the oauth account exists', async () => {
            prisma.oAuthAccount.findUnique.mockResolvedValue({ user: userRecord });

            const result = await service.findByOAuth('google', 'google-id-123');

            expect(result).toEqual(userRecord);
        });

        it('returns null when no oauth account matches', async () => {
            prisma.oAuthAccount.findUnique.mockResolvedValue(null);

            const result = await service.findByOAuth('google', 'unknown-id');

            expect(result).toBeNull();
        });
    });

    describe('createOAuthUser', () => {
        it('creates a user with the encrypted OAuth tokens', async () => {
            prisma.user.create.mockResolvedValue(userRecord);

            await service.createOAuthUser({
                email: 'jane@example.com',
                provider: 'google',
                providerId: 'google-id-123',
                accessToken: 'raw-access-token',
                refreshToken: 'raw-refresh-token',
                role: 'PLAYER',
            });

            expect(encryptionService.encrypt).toHaveBeenCalledWith('raw-access-token');
            expect(encryptionService.encrypt).toHaveBeenCalledWith('raw-refresh-token');
            expect(prisma.user.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        oauthAccounts: {
                            create: expect.objectContaining({
                                accessToken: 'enc(raw-access-token)',
                                refreshToken: 'enc(raw-refresh-token)',
                            }),
                        },
                    }),
                }),
            );
        });

        it('does not attempt to encrypt a missing refresh token', async () => {
            prisma.user.create.mockResolvedValue(userRecord);

            await service.createOAuthUser({
                email: 'jane@example.com',
                provider: 'google',
                providerId: 'google-id-123',
                accessToken: 'raw-access-token',
                role: 'PLAYER',
            });

            expect(prisma.user.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        oauthAccounts: { create: expect.objectContaining({ refreshToken: null }) },
                    }),
                }),
            );
        });
    });

    describe('linkOAuthAccount', () => {
        it('links a new OAuth account to an existing user', async () => {
            prisma.user.update.mockResolvedValue(userRecord);

            await service.linkOAuthAccount(1, {
                provider: 'google',
                providerId: 'google-id-123',
                accessToken: 'raw-access-token',
            });

            expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1 } }));
        });
    });

    describe('updateOAuthTokens', () => {
        it('encrypts and persists refreshed OAuth tokens', async () => {
            await service.updateOAuthTokens(1, 'google', { accessToken: 'new-access-token' });

            expect(prisma.oAuthAccount.updateMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { userId: 1, provider: 'google' },
                    data: expect.objectContaining({ accessToken: 'enc(new-access-token)', refreshToken: null }),
                }),
            );
        });
    });

    describe('create', () => {
        it('hashes the password and creates the user', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            prisma.user.create.mockResolvedValue(userRecord);

            const result = await service.create({
                email: 'jane@example.com',
                password: 'StrongPassword123!',
            } as any);

            expect(mockedBcrypt.hash).toHaveBeenCalledWith('StrongPassword123!', 10);
            expect(result.email).toBe('jane@example.com');
        });

        it('skips hashing when the password is already hashed', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            prisma.user.create.mockResolvedValue(userRecord);

            await service.create({ email: 'jane@example.com', password: 'already-hashed' } as any, true);

            expect(mockedBcrypt.hash).not.toHaveBeenCalled();
        });

        it('rejects when the email is already used', async () => {
            prisma.user.findUnique.mockResolvedValue(userRecord);

            await expect(
                service.create({ email: 'jane@example.com', password: 'StrongPassword123!' } as any),
            ).rejects.toThrow(ConflictException);
        });

        it('rejects when no password is provided and none is marked as hashed', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(service.create({ email: 'jane@example.com' } as any)).rejects.toThrow(BadRequestException);
        });

        it('maps a Prisma unique-constraint violation (P2002) to a ConflictException', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            const prismaError = new PrismaClientKnownRequestError('Unique constraint failed', {
                code: 'P2002',
                clientVersion: '6.19.0',
            });
            prisma.user.create.mockRejectedValue(prismaError);

            await expect(
                service.create({ email: 'jane@example.com', password: 'StrongPassword123!' } as any),
            ).rejects.toThrow(ConflictException);
        });

        it('wraps unexpected errors in an InternalServerErrorException', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            prisma.user.create.mockRejectedValue(new Error('connection lost'));

            await expect(
                service.create({ email: 'jane@example.com', password: 'StrongPassword123!' } as any),
            ).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('update', () => {
        it('updates and returns the user', async () => {
            prisma.user.update.mockResolvedValue({ ...userRecord, avatarUrl: 'new-avatar.png' });

            const result = await service.update(1, { avatarUrl: 'new-avatar.png' } as any);

            expect(result.avatarUrl).toBe('new-avatar.png');
        });
    });

    describe('remove', () => {
        it('deletes and returns the user', async () => {
            prisma.user.delete.mockResolvedValue(userRecord);

            const result = await service.remove(1);

            expect(result.id).toBe(1);
            expect(prisma.user.delete).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1 } }));
        });
    });
});
