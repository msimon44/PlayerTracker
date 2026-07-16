import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EncryptionService } from '../../../common/utils/encryption.util';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmailService } from '../../email/email.service';
import { UsersService } from '../../users/users.service';
import { type LoginResponse, type OAuthProviderData } from '../dto/auth-response.dto';
import { LoginUserDto, RegisterUserDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
    // In-memory storage for temporary authorization codes
    // In production, consider using Redis for distributed systems
    private readonly authCodes = new Map<string, { tokens: LoginResponse; expiresAt: Date }>();

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService,
        private readonly prisma: PrismaService,
        private readonly encryptionService: EncryptionService,
    ) {}

    /**
     * Generate access and refresh tokens
     */
    private async generateTokens(userId: number, email: string, role: string) {
        const payload = { sub: userId, email, role };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '1h', // Access token: 1 hour
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '30d', // Refresh token: 30 days
            }),
        ]);

        return { accessToken, refreshToken };
    }

    /**
     * Create a standardized LoginResponse from user data
     */
    private async createLoginResponse(user: {
        id: number;
        email: string;
        role: string;
        avatarUrl: string | null;
        isEmailVerified: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        consentGiven: boolean;
        consentGivenAt: Date | null;
        deletedAt: Date | null;
        isDeleted: boolean;
        player?: {
            id: number;
            firstName: string;
            lastName: string;
            clubId: number;
            teamId: number | null;
            positionId: number | null;
            isActive: boolean;
        } | null;
        staff?: {
            id: number;
            firstName: string | null;
            lastName: string | null;
            clubId: number;
            specialty: string | null;
        } | null;
    }): Promise<LoginResponse> {
        const tokens = await this.generateTokens(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                email: user.email,
                avatarUrl: user.avatarUrl || null,
                isEmailVerified: user.isEmailVerified || false,
                lastLoginAt: user.lastLoginAt || null,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                consentGiven: user.consentGiven || false,
                consentGivenAt: user.consentGivenAt || null,
                deletedAt: user.deletedAt || null,
                isDeleted: user.isDeleted || false,
                role: user.role,
                player: user.player || null,
                staff: user.staff || null,
            },
            tokens: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                expiresIn: 3600, // 1 hour in seconds
                tokenType: 'Bearer',
            },
        };
    }

    /**
     * Get user profile by ID
     */
    async getUserProfile(userId: number) {
        const user = await this.usersService.findOne(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            avatarUrl: user.avatarUrl || null,
            isEmailVerified: user.isEmailVerified || false,
            lastLoginAt: user.lastLoginAt || null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            consentGiven: user.consentGiven || false,
            consentGivenAt: user.consentGivenAt || null,
            deletedAt: user.deletedAt || null,
            isDeleted: user.isDeleted || false,
            role: user.role,
            player: user.player || null,
            staff: user.staff || null,
        };
    }

    /**
     * Validate platform restrictions for authentication
     * Web platform: Only STAFF allowed
     * Mobile platform: Only PLAYER allowed
     */
    private validatePlatformRestrictions(role: string, platform: 'web' | 'mobile'): void {
        if (platform === 'web' && role !== 'STAFF') {
            throw new ForbiddenException('Web platform is restricted to STAFF users only');
        }

        if (platform === 'mobile' && role !== 'PLAYER') {
            throw new ForbiddenException('Mobile platform is restricted to PLAYER users only');
        }
    }

    async register(registerUserDto: RegisterUserDto): Promise<LoginResponse> {
        const existingUser = await this.usersService.findByEmail(registerUserDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Validate platform restrictions
        this.validatePlatformRestrictions(registerUserDto.role, registerUserDto.platform);

        // For STAFF registration (web), validate required fields
        if (registerUserDto.role === 'STAFF') {
            if (!registerUserDto.firstName || !registerUserDto.lastName) {
                throw new BadRequestException('First name and last name are required for staff registration');
            }

            // Either clubId (join existing) or clubName (create new) must be provided
            if (!registerUserDto.clubId && !registerUserDto.clubName) {
                throw new BadRequestException('Either club ID or club name is required for staff registration');
            }

            // If clubId is provided, verify club exists
            if (registerUserDto.clubId) {
                const club = await this.prisma.club.findUnique({
                    where: { id: registerUserDto.clubId },
                });
                if (!club) {
                    throw new BadRequestException('Club not found');
                }
            }
        }

        const hashedPassword = await bcrypt.hash(registerUserDto.password, 12);

        // Use transaction to create User, Club (if needed), and Staff atomically
        const result = await this.prisma.$transaction(async (tx) => {
            // Determine clubId - create club if clubName is provided
            let clubId = registerUserDto.clubId;

            if (!clubId && registerUserDto.clubName) {
                // Create new club
                const newClub = await tx.club.create({
                    data: {
                        name: registerUserDto.clubName.trim(),
                    },
                });
                clubId = newClub.id;
            }

            // Create user
            const user = await tx.user.create({
                data: {
                    email: registerUserDto.email,
                    password: hashedPassword,
                    role: registerUserDto.role,
                    isEmailVerified: false,
                    consentGiven: registerUserDto.consentGiven,
                    consentGivenAt: registerUserDto.consentGiven ? new Date() : null,
                },
            });

            // For STAFF, create the Staff record
            if (registerUserDto.role === 'STAFF' && clubId) {
                await tx.staff.create({
                    data: {
                        userId: user.id,
                        clubId: clubId,
                        firstName: registerUserDto.firstName,
                        lastName: registerUserDto.lastName,
                    },
                });
            }

            // Return user with relations
            return tx.user.findUnique({
                where: { id: user.id },
                include: {
                    player: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            clubId: true,
                            teamId: true,
                            positionId: true,
                            isActive: true,
                        },
                    },
                    staff: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            clubId: true,
                            specialty: true,
                        },
                    },
                },
            });
        });

        if (!result) {
            throw new BadRequestException('Failed to create user');
        }

        // Send verification email
        await this.generateEmailVerificationToken(result.id);

        return this.createLoginResponse(result);
    }

    async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
        const user = await this.usersService.findByEmail(loginUserDto.email);
        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Validate platform restrictions
        this.validatePlatformRestrictions(user.role, loginUserDto.platform);

        return this.createLoginResponse(user);
    }

    async validateOAuthUser(oauthData: OAuthProviderData): Promise<LoginResponse> {
        // Chercher d'abord un compte OAuth existant
        let user = await this.usersService.findByOAuth(oauthData.provider, oauthData.providerId);

        if (!user) {
            // Si pas de compte OAuth, chercher par email
            const existingUser = await this.usersService.findByEmail(oauthData.email);

            if (existingUser) {
                // SÉCURITÉ: Ne pas lier automatiquement - demander confirmation
                // Générer un token de confirmation et envoyer un email
                const token = crypto.randomBytes(32).toString('hex');
                const expiresAt = new Date();
                expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes

                // Supprimer les anciens tokens de liaison pour cet utilisateur et ce provider
                await this.prisma.oAuthLinkingToken.deleteMany({
                    where: {
                        userId: existingUser.id,
                        provider: oauthData.provider,
                    },
                });

                // Créer un nouveau token de liaison
                await this.prisma.oAuthLinkingToken.create({
                    data: {
                        userId: existingUser.id,
                        provider: oauthData.provider,
                        providerId: oauthData.providerId,
                        email: oauthData.email,
                        accessToken: oauthData.accessToken
                            ? this.encryptionService.encrypt(oauthData.accessToken)
                            : null,
                        refreshToken: oauthData.refreshToken
                            ? this.encryptionService.encrypt(oauthData.refreshToken)
                            : null,
                        token,
                        expiresAt,
                    },
                });

                // Envoyer l'email de confirmation
                await this.emailService.sendOAuthLinkingEmail(
                    existingUser.email,
                    token,
                    oauthData.provider,
                    oauthData.email,
                );

                // Retourner une erreur pour informer le frontend
                throw new UnauthorizedException(
                    'Account linking confirmation required. Check your email to confirm linking this OAuth account.',
                );
            } else {
                // Créer un nouvel utilisateur avec OAuth
                // Le rôle est déterminé par la plateforme : web=STAFF, mobile=PLAYER
                const role = oauthData.platform === 'web' ? 'STAFF' : 'PLAYER';

                user = await this.usersService.createOAuthUser({
                    email: oauthData.email,
                    avatarUrl: oauthData.avatarUrl || null,
                    provider: oauthData.provider,
                    providerId: oauthData.providerId,
                    accessToken: oauthData.accessToken || '',
                    refreshToken: oauthData.refreshToken || null,
                    role: role,
                });
            }
        } else {
            // Mettre à jour les tokens OAuth
            await this.usersService.updateOAuthTokens(user.id, oauthData.provider, {
                accessToken: oauthData.accessToken || '',
                refreshToken: oauthData.refreshToken || null,
            });
        }

        return this.createLoginResponse(user);
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshTokens(userId: number): Promise<LoginResponse> {
        const user = await this.usersService.findOne(userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.createLoginResponse(user);
    }

    /**
     * Generate email verification token and send email
     */
    async generateEmailVerificationToken(userId: number): Promise<void> {
        const user = await this.usersService.findOne(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.isEmailVerified) {
            throw new BadRequestException('Email already verified');
        }

        // Delete old tokens
        await this.prisma.emailVerificationToken.deleteMany({
            where: { userId },
        });

        // Generate new token (32 bytes = 64 hex characters)
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

        // Save token
        await this.prisma.emailVerificationToken.create({
            data: {
                userId,
                token,
                expiresAt,
            },
        });

        // Send email
        await this.emailService.sendVerificationEmail(user.email, token);
    }

    /**
     * Verify email with token
     */
    async verifyEmail(token: string): Promise<void> {
        const verificationToken = await this.prisma.emailVerificationToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!verificationToken) {
            throw new BadRequestException('Invalid or expired verification token');
        }

        if (verificationToken.expiresAt < new Date()) {
            throw new BadRequestException('Verification token has expired');
        }

        // Update user
        await this.prisma.user.update({
            where: { id: verificationToken.userId },
            data: { isEmailVerified: true },
        });

        // Delete used token
        await this.prisma.emailVerificationToken.delete({
            where: { id: verificationToken.id },
        });
    }

    /**
     * Resend verification email
     */
    async resendVerificationEmail(email: string): Promise<void> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            // Don't reveal if email exists
            return;
        }

        if (user.isEmailVerified) {
            throw new BadRequestException('Email already verified');
        }

        await this.generateEmailVerificationToken(user.id);
    }

    /**
     * Generate password reset token and send email
     */
    async forgotPassword(email: string): Promise<void> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            // Don't reveal if email exists (security best practice)
            return;
        }

        // Delete old tokens
        await this.prisma.passwordResetToken.deleteMany({
            where: { userId: user.id },
        });

        // Generate new token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

        // Save token
        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            },
        });

        // Send email
        await this.emailService.sendPasswordResetEmail(user.email, token);
    }

    /**
     * Reset password with token
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetToken) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        if (resetToken.expiresAt < new Date()) {
            throw new BadRequestException('Reset token has expired');
        }

        if (resetToken.usedAt) {
            throw new BadRequestException('Reset token already used');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await this.prisma.user.update({
            where: { id: resetToken.userId },
            data: { password: hashedPassword },
        });

        // Mark token as used
        await this.prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { usedAt: new Date() },
        });
    }

    /**
     * Change password (authenticated user)
     */
    async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.password) {
            throw new UnauthorizedException('User not found');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }

    /**
     * Confirm OAuth account linking with token
     */
    async confirmOAuthLinking(token: string): Promise<void> {
        const linkingToken = await this.prisma.oAuthLinkingToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!linkingToken) {
            throw new BadRequestException('Invalid or expired linking token');
        }

        if (linkingToken.expiresAt < new Date()) {
            throw new BadRequestException('Linking token has expired');
        }

        // Link the OAuth account
        await this.usersService.linkOAuthAccount(linkingToken.userId, {
            provider: linkingToken.provider,
            providerId: linkingToken.providerId,
            accessToken: linkingToken.accessToken ? this.encryptionService.decrypt(linkingToken.accessToken) : '',
            refreshToken: linkingToken.refreshToken ? this.encryptionService.decrypt(linkingToken.refreshToken) : null,
        });

        // Delete the used token
        await this.prisma.oAuthLinkingToken.delete({
            where: { id: linkingToken.id },
        });
    }

    /**
     * Logout user by revoking their access token
     */
    async logout(token: string): Promise<void> {
        try {
            // Verify and decode the token to get expiration
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            // Add token to revoked list with its expiration time
            await this.prisma.revokedToken.create({
                data: {
                    token,
                    expiresAt: new Date(decoded.exp * 1000), // JWT exp is in seconds
                },
            });
        } catch {
            // If token is invalid or expired, just ignore (already unusable)
            throw new UnauthorizedException('Invalid token');
        }
    }

    /**
     * Check if a token has been revoked
     */
    async isTokenRevoked(token: string): Promise<boolean> {
        const revokedToken = await this.prisma.revokedToken.findUnique({
            where: { token },
        });

        return !!revokedToken;
    }

    /**
     * Clean up expired revoked tokens (should be run periodically)
     */
    async cleanupRevokedTokens(): Promise<void> {
        await this.prisma.revokedToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }

    /**
     * Generate a temporary authorization code for OAuth flow
     */
    generateAuthCode(): string {
        return crypto.randomBytes(32).toString('hex'); // 64 character hex string
    }

    /**
     * Store authorization code with tokens temporarily (15 min expiry)
     * This prevents tokens from being exposed in URL query parameters
     */
    async storeAuthorizationCode(code: string, loginResponse: LoginResponse): Promise<void> {
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        this.authCodes.set(code, { tokens: loginResponse, expiresAt });

        // Auto-cleanup expired codes after 15 minutes
        // unref() so this cleanup timer never keeps the process (or a test
        // runner) alive on its own - it's a best-effort cleanup, not
        // something the process should wait for at shutdown.
        const cleanupTimer = setTimeout(
            () => {
                this.authCodes.delete(code);
            },
            15 * 60 * 1000,
        );
        cleanupTimer.unref?.();
    }

    /**
     * Exchange authorization code for tokens
     * One-time use code that expires after 15 minutes
     */
    async exchangeAuthorizationCode(code: string): Promise<LoginResponse> {
        const entry = this.authCodes.get(code);

        if (!entry) {
            throw new UnauthorizedException('Invalid or expired authorization code');
        }

        if (new Date() > entry.expiresAt) {
            this.authCodes.delete(code);
            throw new UnauthorizedException('Authorization code expired');
        }

        // One-time use: delete after exchange
        this.authCodes.delete(code);

        return entry.tokens;
    }
}
