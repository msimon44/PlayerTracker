import { EmailService } from './email.service';

describe('EmailService', () => {
    let service: EmailService;
    let configService: { get: jest.Mock };
    let loggerLogSpy: jest.SpyInstance;
    let loggerWarnSpy: jest.SpyInstance;

    beforeEach(() => {
        configService = { get: jest.fn() };
        service = new EmailService(configService as any);
        loggerLogSpy = jest.spyOn((service as any).logger, 'log').mockImplementation(() => undefined);
        loggerWarnSpy = jest.spyOn((service as any).logger, 'warn').mockImplementation(() => undefined);
    });

    function findLoggedLine(pattern: string): string | undefined {
        return loggerLogSpy.mock.calls.map((call) => String(call[0])).find((line) => line.includes(pattern));
    }

    describe('sendVerificationEmail', () => {
        it('reads FRONTEND_URL from config to build the verification link', async () => {
            configService.get.mockImplementation((key: string) =>
                key === 'FRONTEND_URL' ? 'https://app.playertracker.example' : 'development',
            );

            await service.sendVerificationEmail('jane@example.com', 'a-token');

            expect(configService.get).toHaveBeenCalledWith('FRONTEND_URL');
        });

        it('logs the recipient and subject in full (not truncated)', async () => {
            configService.get.mockReturnValue(undefined);

            await service.sendVerificationEmail('jane@example.com', 'a-token');

            expect(findLoggedLine('To:')).toContain('jane@example.com');
            expect(findLoggedLine('Subject:')).toContain('Vérifiez votre adresse email');
        });
    });

    describe('sendPasswordResetEmail', () => {
        it('reads FRONTEND_URL from config and sends to the right recipient', async () => {
            configService.get.mockImplementation((key: string) =>
                key === 'FRONTEND_URL' ? 'https://app.playertracker.example' : 'development',
            );

            await service.sendPasswordResetEmail('jane@example.com', 'reset-token');

            expect(configService.get).toHaveBeenCalledWith('FRONTEND_URL');
            expect(findLoggedLine('To:')).toContain('jane@example.com');
            expect(findLoggedLine('Subject:')).toContain('Réinitialisation de mot de passe');
        });
    });

    describe('sendOAuthLinkingEmail', () => {
        it('mentions the provider in the subject', async () => {
            configService.get.mockImplementation((key: string) =>
                key === 'FRONTEND_URL' ? 'https://app.playertracker.example' : 'development',
            );

            await service.sendOAuthLinkingEmail('jane@example.com', 'link-token', 'google', 'jane@gmail.com');

            expect(configService.get).toHaveBeenCalledWith('FRONTEND_URL');
            expect(findLoggedLine('Subject:')).toContain('google');
        });
    });

    describe('sendEmail (behind the public methods) — environment behavior', () => {
        it('development: logs the email content to the console instead of sending it', async () => {
            configService.get.mockImplementation((key: string) => (key === 'NODE_ENV' ? 'development' : undefined));

            await service.sendVerificationEmail('jane@example.com', 'a-token');

            expect(loggerLogSpy).toHaveBeenCalledWith(expect.stringContaining('EMAIL (Development Mode)'));
            expect(loggerWarnSpy).not.toHaveBeenCalled();
        });

        it('production: does NOT actually send the email — only logs a warning that it is not implemented', async () => {
            configService.get.mockImplementation((key: string) => (key === 'NODE_ENV' ? 'production' : undefined));

            await service.sendVerificationEmail('jane@example.com', 'a-token');

            expect(loggerWarnSpy).toHaveBeenCalledWith(expect.stringContaining('not implemented in production'));
        });
    });
});
