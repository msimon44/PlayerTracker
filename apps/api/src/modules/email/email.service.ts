import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    constructor(private readonly configService: ConfigService) {}

    /**
     * Send email verification email
     */
    async sendVerificationEmail(email: string, token: string): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const verificationUrl = `${frontendUrl}/auth/verify-email?token=${token}`;

        const html = `
            <h1>Vérifiez votre adresse email</h1>
            <p>Bienvenue sur PlayerTracker!</p>
            <p>Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email:</p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                Vérifier mon email
            </a>
            <p>Ou copiez ce lien dans votre navigateur:</p>
            <p>${verificationUrl}</p>
            <p>Ce lien expire dans 24 heures.</p>
            <br>
            <p><small>Si vous n'avez pas créé de compte, ignorez cet email.</small></p>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Vérifiez votre adresse email - PlayerTracker',
            html,
        });
    }

    /**
     * Send OAuth account linking confirmation email
     */
    async sendOAuthLinkingEmail(email: string, token: string, provider: string, providerEmail: string): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const confirmUrl = `${frontendUrl}/auth/confirm-oauth-linking?token=${token}`;

        const html = `
            <h1>Confirmer la liaison de compte ${provider}</h1>
            <p>Quelqu'un a tenté de se connecter avec ${provider} (${providerEmail}) à votre compte PlayerTracker.</p>
            <p>Si c'était vous, veuillez cliquer sur le lien ci-dessous pour confirmer la liaison :</p>
            <a href="${confirmUrl}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
                Confirmer la liaison
            </a>
            <p>Ou copiez ce lien dans votre navigateur:</p>
            <p>${confirmUrl}</p>
            <p>Ce lien expire dans 15 minutes.</p>
            <br>
            <p><strong>Important:</strong> Si vous n'avez pas tenté de lier ce compte, ignorez cet email et changez votre mot de passe immédiatement.</p>
        `;

        await this.sendEmail({
            to: email,
            subject: `Confirmation de liaison de compte ${provider} - PlayerTracker`,
            html,
        });
    }

    /**
     * Send password reset email
     */
    async sendPasswordResetEmail(email: string, token: string): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

        const html = `
            <h1>Réinitialisation de mot de passe</h1>
            <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
            <p>Veuillez cliquer sur le lien ci-dessous pour créer un nouveau mot de passe:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">
                Réinitialiser mon mot de passe
            </a>
            <p>Ou copiez ce lien dans votre navigateur:</p>
            <p>${resetUrl}</p>
            <p>Ce lien expire dans 1 heure.</p>
            <br>
            <p><small>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</small></p>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Réinitialisation de mot de passe - PlayerTracker',
            html,
        });
    }

    /**
     * Send generic email
     * For development: logs to console
     * For production: implement with real email service (Resend, SendGrid, etc.)
     */
    private async sendEmail(options: EmailOptions): Promise<void> {
        const nodeEnv = this.configService.get<string>('NODE_ENV');

        if (nodeEnv === 'production') {
            // TODO: Implement real email service (Resend, SendGrid, SES, etc.)
            this.logger.warn('Email sending not implemented in production. Use Resend/SendGrid.');
            this.logger.log(`Would send email to ${options.to}: ${options.subject}`);
        } else {
            // Development: log to console
            this.logger.log('============================================');
            this.logger.log('📧 EMAIL (Development Mode)');
            this.logger.log(`To: ${options.to}`);
            this.logger.log(`Subject: ${options.subject}`);
            if (options.text) {
                this.logger.log(`Text: ${options.text}`);
            }
            if (options.html) {
                this.logger.log(`HTML: ${options.html.substring(0, 200)}...`);
            }
            this.logger.log('============================================');
        }
    }
}
