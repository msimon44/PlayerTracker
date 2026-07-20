import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: {
        register: jest.Mock;
        login: jest.Mock;
        refreshTokens: jest.Mock;
        exchangeAuthorizationCode: jest.Mock;
        verifyEmail: jest.Mock;
        resendVerificationEmail: jest.Mock;
        forgotPassword: jest.Mock;
        resetPassword: jest.Mock;
        changePassword: jest.Mock;
        confirmOAuthLinking: jest.Mock;
        logout: jest.Mock;
        getUserProfile: jest.Mock;
        generateAuthCode: jest.Mock;
        storeAuthorizationCode: jest.Mock;
    };
    let configService: { get: jest.Mock };
    let res: { redirect: jest.Mock };

    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        delete process.env['GOOGLE_CLIENT_ID'];
        delete process.env['GOOGLE_CLIENT_SECRET'];
        delete process.env['APPLE_CLIENT_ID'];
        delete process.env['APPLE_TEAM_ID'];
        delete process.env['APPLE_KEY_ID'];
        delete process.env['APPLE_PRIVATE_KEY_PATH'];

        authService = {
            register: jest.fn(),
            login: jest.fn(),
            refreshTokens: jest.fn(),
            exchangeAuthorizationCode: jest.fn(),
            verifyEmail: jest.fn(),
            resendVerificationEmail: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
            changePassword: jest.fn(),
            confirmOAuthLinking: jest.fn(),
            logout: jest.fn(),
            getUserProfile: jest.fn(),
            generateAuthCode: jest.fn(),
            storeAuthorizationCode: jest.fn(),
        };
        configService = { get: jest.fn() };
        controller = new AuthController(authService as unknown as AuthService, configService as any);
        res = { redirect: jest.fn() };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    describe('simple delegation routes', () => {
        it('register delegates to the service', async () => {
            authService.register.mockResolvedValue({ user: {}, tokens: {} });
            const dto = { email: 'jane@example.com' };

            await controller.register(dto as any);

            expect(authService.register).toHaveBeenCalledWith(dto);
        });

        it('login delegates to the service', async () => {
            authService.login.mockResolvedValue({ user: {}, tokens: {} });
            const dto = { email: 'jane@example.com', password: 'x' };

            await controller.login(dto as any);

            expect(authService.login).toHaveBeenCalledWith(dto);
        });

        it('refreshTokens delegates with the authenticated user id', async () => {
            authService.refreshTokens.mockResolvedValue({ user: {}, tokens: {} });

            await controller.refreshTokens({ userId: 1 } as any);

            expect(authService.refreshTokens).toHaveBeenCalledWith(1);
        });

        it('exchangeAuthorizationCode delegates with the code', async () => {
            authService.exchangeAuthorizationCode.mockResolvedValue({ user: {}, tokens: {} });

            await controller.exchangeAuthorizationCode({ code: 'abc' } as any);

            expect(authService.exchangeAuthorizationCode).toHaveBeenCalledWith('abc');
        });

        it('verifyEmail delegates with the token and returns a confirmation message', async () => {
            const result = await controller.verifyEmail({ token: 'a-token' } as any);

            expect(authService.verifyEmail).toHaveBeenCalledWith('a-token');
            expect(result).toEqual({ message: 'Email verified successfully' });
        });

        it('resendVerification delegates with the email', async () => {
            await controller.resendVerification({ email: 'jane@example.com' } as any);

            expect(authService.resendVerificationEmail).toHaveBeenCalledWith('jane@example.com');
        });

        it('forgotPassword delegates with the email', async () => {
            await controller.forgotPassword({ email: 'jane@example.com' } as any);

            expect(authService.forgotPassword).toHaveBeenCalledWith('jane@example.com');
        });

        it('resetPassword delegates with the token and new password', async () => {
            await controller.resetPassword({ token: 'a-token', password: 'NewPassword123!' } as any);

            expect(authService.resetPassword).toHaveBeenCalledWith('a-token', 'NewPassword123!');
        });

        it('changePassword delegates with the user id and both passwords', async () => {
            await controller.changePassword(
                { userId: 1 } as any,
                {
                    currentPassword: 'Current123!',
                    newPassword: 'New123!',
                } as any,
            );

            expect(authService.changePassword).toHaveBeenCalledWith(1, 'Current123!', 'New123!');
        });

        it('confirmOAuthLinking delegates with the token', async () => {
            await controller.confirmOAuthLinking({ token: 'a-token' } as any);

            expect(authService.confirmOAuthLinking).toHaveBeenCalledWith('a-token');
        });

        it('getProfile delegates with the authenticated user id', async () => {
            authService.getUserProfile.mockResolvedValue({ id: 1 });

            await controller.getProfile({ user: { userId: 1 } } as any);

            expect(authService.getUserProfile).toHaveBeenCalledWith(1);
        });
    });

    describe('logout', () => {
        it('extracts the bearer token and revokes it', async () => {
            const result = await controller.logout({
                headers: { authorization: 'Bearer a-valid-token' },
            } as any);

            expect(authService.logout).toHaveBeenCalledWith('a-valid-token');
            expect(result).toEqual({ message: 'Logged out successfully' });
        });

        it('throws UnauthorizedException when no authorization header is present', async () => {
            await expect(controller.logout({ headers: {} } as any)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('getOAuthStatus', () => {
        it('reports Google as always enabled, and Apple as enabled only in production', () => {
            configService.get.mockReturnValue('development');

            const result = controller.getOAuthStatus();

            expect(result.google.enabled).toBe(true);
            expect(result.apple.enabled).toBe(false);
        });

        it('reports Apple as enabled in production', () => {
            configService.get.mockImplementation((key: string) => (key === 'NODE_ENV' ? 'production' : undefined));

            const result = controller.getOAuthStatus();

            expect(result.apple.enabled).toBe(true);
        });

        it('reports whether Google credentials are actually configured', () => {
            process.env['GOOGLE_CLIENT_ID'] = 'id';
            process.env['GOOGLE_CLIENT_SECRET'] = 'secret';
            configService.get.mockReturnValue('development');

            const result = controller.getOAuthStatus();

            expect(result.google.configured).toBe(true);
        });
    });

    describe('googleAuthRedirect', () => {
        const buildReq = (overrides: Record<string, unknown> = {}) => ({
            user: { user: { role: 'STAFF' } },
            session: {},
            headers: {},
            ...overrides,
        });

        it('redirects with an error when Google credentials are not configured', async () => {
            await controller.googleAuthRedirect(buildReq() as any, res as any);

            expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('error=google_not_configured'));
            expect(authService.generateAuthCode).not.toHaveBeenCalled();
        });

        it('rejects a non-STAFF user on the web platform', async () => {
            process.env['GOOGLE_CLIENT_ID'] = 'id';
            process.env['GOOGLE_CLIENT_SECRET'] = 'secret';

            await controller.googleAuthRedirect(buildReq({ user: { user: { role: 'PLAYER' } } }) as any, res as any);

            expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('error=access_denied'));
            expect(authService.generateAuthCode).not.toHaveBeenCalled();
        });

        it('rejects a non-PLAYER user on the mobile platform', async () => {
            process.env['GOOGLE_CLIENT_ID'] = 'id';
            process.env['GOOGLE_CLIENT_SECRET'] = 'secret';

            await controller.googleAuthRedirect(
                buildReq({ session: { oauthPlatform: 'mobile' }, user: { user: { role: 'STAFF' } } }) as any,
                res as any,
            );

            expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('error=access_denied'));
        });

        it('generates an authorization code and redirects for a valid STAFF/web login', async () => {
            process.env['GOOGLE_CLIENT_ID'] = 'id';
            process.env['GOOGLE_CLIENT_SECRET'] = 'secret';
            authService.generateAuthCode.mockReturnValue('temp-code-123');

            await controller.googleAuthRedirect(buildReq() as any, res as any);

            expect(authService.storeAuthorizationCode).toHaveBeenCalledWith(
                'temp-code-123',
                expect.objectContaining({ user: { role: 'STAFF' } }),
            );
            expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('code=temp-code-123'));
        });
    });

    describe('appleAuthRedirect', () => {
        const buildReq = (overrides: Record<string, unknown> = {}) => ({
            user: { user: { role: 'STAFF' } },
            session: {},
            headers: {},
            ...overrides,
        });

        it('redirects with an error outside production', async () => {
            configService.get.mockReturnValue('development');

            await controller.appleAuthRedirect(buildReq() as any, res as any);

            expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('error=apple_not_available_in_dev'));
        });

        it('redirects with an error in production when Apple credentials are missing', async () => {
            configService.get.mockReturnValue('production');

            await controller.appleAuthRedirect(buildReq() as any, res as any);

            expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('error=apple_not_configured'));
        });

        it('generates an authorization code when fully configured in production', async () => {
            configService.get.mockReturnValue('production');
            process.env['APPLE_CLIENT_ID'] = 'id';
            process.env['APPLE_TEAM_ID'] = 'team';
            process.env['APPLE_KEY_ID'] = 'key';
            process.env['APPLE_PRIVATE_KEY_PATH'] = '/path/to/key.p8';
            authService.generateAuthCode.mockReturnValue('temp-code-456');

            await controller.appleAuthRedirect(buildReq() as any, res as any);

            expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('code=temp-code-456'));
        });
    });
});
