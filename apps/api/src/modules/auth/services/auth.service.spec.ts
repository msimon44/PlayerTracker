import { BadRequestException, ConflictException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
    let service: AuthService;
    let usersService: {
        findByEmail: jest.Mock;
        findOne: jest.Mock;
        findByOAuth: jest.Mock;
        createOAuthUser: jest.Mock;
        updateOAuthTokens: jest.Mock;
        linkOAuthAccount: jest.Mock;
    };
    let jwtService: { signAsync: jest.Mock; verify: jest.Mock };
    let configService: { get: jest.Mock };
    let emailService: {
        sendVerificationEmail: jest.Mock;
        sendPasswordResetEmail: jest.Mock;
        sendOAuthLinkingEmail: jest.Mock;
    };
    let prisma: any;
    let encryptionService: { encrypt: jest.Mock; decrypt: jest.Mock };

    const baseUser = {
        id: 1,
        email: 'jane@example.com',
        password: 'hashed-password',
        role: 'PLAYER',
        avatarUrl: null,
        isEmailVerified: true,
        lastLoginAt: null,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
        consentGiven: true,
        consentGivenAt: new Date('2026-01-01'),
        deletedAt: null,
        isDeleted: false,
        player: null,
        staff: null,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        usersService = {
            findByEmail: jest.fn(),
            findOne: jest.fn(),
            findByOAuth: jest.fn(),
            createOAuthUser: jest.fn(),
            updateOAuthTokens: jest.fn(),
            linkOAuthAccount: jest.fn(),
        };
        jwtService = {
            signAsync: jest.fn().mockResolvedValue('signed-token'),
            verify: jest.fn(),
        };
        configService = {
            get: jest.fn((key: string) => {
                const values: Record<string, string> = {
                    JWT_SECRET: 'test-jwt-secret',
                    JWT_REFRESH_SECRET: 'test-refresh-secret',
                };
                return values[key];
            }),
        };
        emailService = {
            sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
            sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
            sendOAuthLinkingEmail: jest.fn().mockResolvedValue(undefined),
        };
        prisma = {
            club: { findUnique: jest.fn() },
            $transaction: jest.fn(),
            emailVerificationToken: {
                deleteMany: jest.fn(),
                create: jest.fn(),
                findUnique: jest.fn(),
                delete: jest.fn(),
            },
            passwordResetToken: { deleteMany: jest.fn(), create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
            oAuthLinkingToken: { deleteMany: jest.fn(), create: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
            revokedToken: { create: jest.fn(), findUnique: jest.fn(), deleteMany: jest.fn() },
            user: { update: jest.fn(), findUnique: jest.fn() },
        };
        encryptionService = {
            encrypt: jest.fn((v: string) => `enc(${v})`),
            decrypt: jest.fn((v: string) => v.replace(/^enc\(|\)$/g, '')),
        };

        service = new AuthService(
            usersService as any,
            jwtService as any,
            configService as any,
            emailService as any,
            prisma,
            encryptionService as any,
        );

        mockedBcrypt.hash.mockResolvedValue('hashed-password' as never);
        mockedBcrypt.compare.mockResolvedValue(true as never);
    });

    describe('register', () => {
        const playerDto = {
            email: 'new-player@example.com',
            password: 'StrongPassword123!',
            role: 'PLAYER' as const,
            platform: 'mobile' as const,
            consentGiven: true,
        };

        it('creates a PLAYER account on the mobile platform', async () => {
            usersService.findByEmail.mockResolvedValue(null);
            prisma.$transaction.mockImplementation(async (cb: any) =>
                cb({
                    club: { create: jest.fn() },
                    user: {
                        create: jest.fn().mockResolvedValue({ id: 2 }),
                        findUnique: jest.fn().mockResolvedValue({ ...baseUser, id: 2, role: 'PLAYER' }),
                    },
                    staff: { create: jest.fn() },
                }),
            );
            usersService.findOne.mockResolvedValue({ ...baseUser, id: 2, isEmailVerified: false });

            const result = await service.register(playerDto as any);

            expect(result.user.role).toBe('PLAYER');
            expect(result.tokens.accessToken).toBe('signed-token');
            expect(emailService.sendVerificationEmail).toHaveBeenCalled();
        });

        it('rejects registration when the email already exists', async () => {
            usersService.findByEmail.mockResolvedValue(baseUser);

            await expect(service.register(playerDto as any)).rejects.toThrow(ConflictException);
        });

        it('rejects a STAFF registration on the mobile platform', async () => {
            usersService.findByEmail.mockResolvedValue(null);

            await expect(service.register({ ...playerDto, role: 'STAFF', platform: 'mobile' } as any)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it('rejects a PLAYER registration on the web platform', async () => {
            usersService.findByEmail.mockResolvedValue(null);

            await expect(service.register({ ...playerDto, role: 'PLAYER', platform: 'web' } as any)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it('rejects STAFF registration missing first/last name', async () => {
            usersService.findByEmail.mockResolvedValue(null);

            await expect(
                service.register({
                    ...playerDto,
                    role: 'STAFF',
                    platform: 'web',
                    clubName: 'Some Club',
                } as any),
            ).rejects.toThrow(BadRequestException);
        });

        it('rejects STAFF registration missing both clubId and clubName', async () => {
            usersService.findByEmail.mockResolvedValue(null);

            await expect(
                service.register({
                    ...playerDto,
                    role: 'STAFF',
                    platform: 'web',
                    firstName: 'John',
                    lastName: 'Staff',
                } as any),
            ).rejects.toThrow(BadRequestException);
        });

        it('rejects STAFF registration when the provided clubId does not exist', async () => {
            usersService.findByEmail.mockResolvedValue(null);
            prisma.club.findUnique.mockResolvedValue(null);

            await expect(
                service.register({
                    ...playerDto,
                    role: 'STAFF',
                    platform: 'web',
                    firstName: 'John',
                    lastName: 'Staff',
                    clubId: 999,
                } as any),
            ).rejects.toThrow(BadRequestException);
        });

        it('creates a STAFF account and a new club when clubName is provided', async () => {
            usersService.findByEmail.mockResolvedValue(null);
            const createClub = jest.fn().mockResolvedValue({ id: 42 });
            const createStaff = jest.fn().mockResolvedValue({});
            prisma.$transaction.mockImplementation(async (cb: any) =>
                cb({
                    club: { create: createClub },
                    user: {
                        create: jest.fn().mockResolvedValue({ id: 3 }),
                        findUnique: jest.fn().mockResolvedValue({ ...baseUser, id: 3, role: 'STAFF' }),
                    },
                    staff: { create: createStaff },
                }),
            );
            usersService.findOne.mockResolvedValue({ ...baseUser, id: 3, isEmailVerified: false });

            const result = await service.register({
                ...playerDto,
                role: 'STAFF',
                platform: 'web',
                firstName: 'John',
                lastName: 'Staff',
                clubName: 'New Club',
            } as any);

            expect(result.user.role).toBe('STAFF');
            expect(createClub).toHaveBeenCalledWith(expect.objectContaining({ data: { name: 'New Club' } }));
            expect(createStaff).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ clubId: 42 }) }),
            );
        });
    });

    describe('login', () => {
        const loginDto = { email: 'jane@example.com', password: 'StrongPassword123!', platform: 'mobile' as const };

        it('logs in with valid credentials matching the platform restriction', async () => {
            usersService.findByEmail.mockResolvedValue(baseUser);
            mockedBcrypt.compare.mockResolvedValue(true as never);

            const result = await service.login(loginDto as any);

            expect(result.user.email).toBe(baseUser.email);
            expect(result.tokens.tokenType).toBe('Bearer');
        });

        it('rejects login when the user does not exist', async () => {
            usersService.findByEmail.mockResolvedValue(null);

            await expect(service.login(loginDto as any)).rejects.toThrow(UnauthorizedException);
        });

        it('rejects login with an incorrect password', async () => {
            usersService.findByEmail.mockResolvedValue(baseUser);
            mockedBcrypt.compare.mockResolvedValue(false as never);

            await expect(service.login(loginDto as any)).rejects.toThrow(UnauthorizedException);
        });

        it('rejects a PLAYER logging in on the web platform', async () => {
            usersService.findByEmail.mockResolvedValue(baseUser);
            mockedBcrypt.compare.mockResolvedValue(true as never);

            await expect(service.login({ ...loginDto, platform: 'web' } as any)).rejects.toThrow(ForbiddenException);
        });

        it('rejects a STAFF logging in on the mobile platform', async () => {
            usersService.findByEmail.mockResolvedValue({ ...baseUser, role: 'STAFF' });
            mockedBcrypt.compare.mockResolvedValue(true as never);

            await expect(service.login({ ...loginDto, platform: 'mobile' } as any)).rejects.toThrow(ForbiddenException);
        });
    });

    describe('refreshTokens', () => {
        it('issues new tokens for an existing user', async () => {
            usersService.findOne.mockResolvedValue(baseUser);

            const result = await service.refreshTokens(baseUser.id);

            expect(result.tokens.accessToken).toBe('signed-token');
        });

        it('throws when the user no longer exists', async () => {
            usersService.findOne.mockResolvedValue(null);

            await expect(service.refreshTokens(999)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('forgotPassword', () => {
        it('sends a reset email when the account exists', async () => {
            usersService.findByEmail.mockResolvedValue(baseUser);

            await service.forgotPassword(baseUser.email);

            expect(prisma.passwordResetToken.create).toHaveBeenCalled();
            expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(baseUser.email, expect.any(String));
        });

        it('does not reveal whether the account exists (no email sent, no error)', async () => {
            usersService.findByEmail.mockResolvedValue(null);

            await expect(service.forgotPassword('unknown@example.com')).resolves.toBeUndefined();
            expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
        });
    });

    describe('resetPassword', () => {
        const futureDate = new Date(Date.now() + 60 * 60 * 1000);

        it('resets the password with a valid, unused, non-expired token', async () => {
            prisma.passwordResetToken.findUnique.mockResolvedValue({
                id: 10,
                userId: baseUser.id,
                expiresAt: futureDate,
                usedAt: null,
            });

            await service.resetPassword('valid-token', 'NewStrongPassword123!');

            expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: baseUser.id } }));
            expect(prisma.passwordResetToken.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 10 } }),
            );
        });

        it('rejects an unknown token', async () => {
            prisma.passwordResetToken.findUnique.mockResolvedValue(null);

            await expect(service.resetPassword('bad-token', 'NewStrongPassword123!')).rejects.toThrow(
                BadRequestException,
            );
        });

        it('rejects an expired token', async () => {
            prisma.passwordResetToken.findUnique.mockResolvedValue({
                id: 10,
                userId: baseUser.id,
                expiresAt: new Date(Date.now() - 1000),
                usedAt: null,
            });

            await expect(service.resetPassword('expired-token', 'NewStrongPassword123!')).rejects.toThrow(
                BadRequestException,
            );
        });

        it('rejects an already-used token', async () => {
            prisma.passwordResetToken.findUnique.mockResolvedValue({
                id: 10,
                userId: baseUser.id,
                expiresAt: futureDate,
                usedAt: new Date(),
            });

            await expect(service.resetPassword('used-token', 'NewStrongPassword123!')).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('changePassword', () => {
        it('changes the password when the current password is correct', async () => {
            prisma.user.findUnique.mockResolvedValue(baseUser);
            mockedBcrypt.compare.mockResolvedValue(true as never);

            await service.changePassword(baseUser.id, 'CurrentPassword123!', 'NewStrongPassword123!');

            expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: baseUser.id } }));
        });

        it('rejects when the current password is incorrect', async () => {
            prisma.user.findUnique.mockResolvedValue(baseUser);
            mockedBcrypt.compare.mockResolvedValue(false as never);

            await expect(
                service.changePassword(baseUser.id, 'WrongPassword123!', 'NewStrongPassword123!'),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('rejects when the user does not exist', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(service.changePassword(999, 'CurrentPassword123!', 'NewStrongPassword123!')).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    describe('authorization code exchange', () => {
        it('exchanges a freshly stored code for its tokens exactly once', async () => {
            const loginResponse = {
                user: baseUser,
                tokens: { accessToken: 'a', refreshToken: 'b', expiresIn: 3600, tokenType: 'Bearer' },
            };
            const code = service.generateAuthCode();
            await service.storeAuthorizationCode(code, loginResponse as any);

            const result = await service.exchangeAuthorizationCode(code);
            expect(result).toBe(loginResponse);

            await expect(service.exchangeAuthorizationCode(code)).rejects.toThrow(UnauthorizedException);
        });

        it('rejects an unknown authorization code', async () => {
            await expect(service.exchangeAuthorizationCode('never-issued')).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('logout', () => {
        it('revokes a valid token', async () => {
            jwtService.verify.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 });

            await service.logout('a-valid-token');

            expect(prisma.revokedToken.create).toHaveBeenCalled();
        });

        it('rejects an invalid token', async () => {
            jwtService.verify.mockImplementation(() => {
                throw new Error('invalid signature');
            });

            await expect(service.logout('garbage')).rejects.toThrow(UnauthorizedException);
        });
    });
});
