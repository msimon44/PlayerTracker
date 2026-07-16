import { Body, Controller, Get, Post, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { Public } from '../decorators/public.decorator';
import { User } from '../decorators/user.decorator';
import { LoginResponse, UserAuthDto } from '../dto/auth-response.dto';
import {
    ChangePasswordDto,
    ConfirmOAuthLinkingDto,
    ForgotPasswordDto,
    LoginUserDto,
    RegisterUserDto,
    ResendVerificationDto,
    ResetPasswordDto,
    VerifyEmailDto,
} from '../dto/auth.dto';
import { ExchangeCodeDto } from '../dto/exchange-code.dto';
import { AppleOAuthGuard } from '../guards/apple-oauth.guard';
import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { AuthService } from '../services/auth.service';
import {
    type AuthenticatedRequest,
    type JwtPayload,
    type OAuthRequest,
    type RefreshTokenPayload,
} from '../types/auth-request.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    // OAuth state parameter is now handled automatically by Passport OAuth2 via express-session
    // No need for manual state management

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Public()
    @Throttle({ short: { limit: 5, ttl: 3600000 } }) // 5 registrations per hour
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully', type: LoginResponse })
    @ApiResponse({ status: 400, description: 'Invalid input or email already exists' })
    async register(@Body() registerUserDto: RegisterUserDto): Promise<LoginResponse> {
        return this.authService.register(registerUserDto);
    }

    @Public()
    @Throttle({ medium: { limit: 3, ttl: 60000 } }) // 3 login attempts per minute
    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponse })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
        return this.authService.login(loginUserDto);
    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token using refresh token' })
    @ApiResponse({ status: 200, description: 'Tokens refreshed successfully', type: LoginResponse })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    async refreshTokens(@User() user: RefreshTokenPayload): Promise<LoginResponse> {
        return this.authService.refreshTokens(user.userId);
    }

    @Public()
    @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 per minute
    @Post('exchange-code')
    @ApiOperation({ summary: 'Exchange authorization code for tokens (OAuth security flow)' })
    @ApiResponse({ status: 200, description: 'Tokens retrieved successfully', type: LoginResponse })
    @ApiResponse({ status: 401, description: 'Invalid or expired authorization code' })
    async exchangeAuthorizationCode(@Body() exchangeCodeDto: ExchangeCodeDto): Promise<LoginResponse> {
        return this.authService.exchangeAuthorizationCode(exchangeCodeDto.code);
    }

    @Public()
    @Throttle({ medium: { limit: 10, ttl: 60000 } }) // 10 attempts per minute
    @Post('verify-email')
    @ApiOperation({ summary: 'Verify email with token' })
    @ApiResponse({ status: 200, description: 'Email verified successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        await this.authService.verifyEmail(verifyEmailDto.token);
        return { message: 'Email verified successfully' };
    }

    @Public()
    @Throttle({ medium: { limit: 3, ttl: 60000 } }) // 3 resend per minute
    @Post('resend-verification')
    @ApiOperation({ summary: 'Resend email verification' })
    @ApiResponse({ status: 200, description: 'Verification email sent' })
    @ApiResponse({ status: 400, description: 'Email already verified' })
    async resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
        await this.authService.resendVerificationEmail(resendVerificationDto.email);
        return { message: 'Verification email sent' };
    }

    @Public()
    @Throttle({ medium: { limit: 3, ttl: 60000 } }) // 3 requests per minute
    @Post('forgot-password')
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({ status: 200, description: 'Password reset email sent if account exists' })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        await this.authService.forgotPassword(forgotPasswordDto.email);
        return { message: 'Password reset email sent if account exists' };
    }

    @Public()
    @Throttle({ medium: { limit: 5, ttl: 60000 } }) // 5 reset attempts per minute
    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password with token' })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password);
        return { message: 'Password reset successfully' };
    }

    @Throttle({ medium: { limit: 5, ttl: 60000 } }) // 5 change attempts per minute
    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    @ApiOperation({ summary: 'Change password (authenticated)' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 401, description: 'Current password is incorrect' })
    async changePassword(@User() user: JwtPayload, @Body() changePasswordDto: ChangePasswordDto) {
        await this.authService.changePassword(
            user.userId,
            changePasswordDto.currentPassword,
            changePasswordDto.newPassword,
        );
        return { message: 'Password changed successfully' };
    }

    @Public()
    @Throttle({ medium: { limit: 10, ttl: 60000 } }) // 10 confirmation attempts per minute
    @Post('confirm-oauth-linking')
    @ApiOperation({ summary: 'Confirm OAuth account linking with token' })
    @ApiResponse({ status: 200, description: 'OAuth account linked successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    async confirmOAuthLinking(@Body() confirmOAuthLinkingDto: ConfirmOAuthLinkingDto) {
        await this.authService.confirmOAuthLinking(confirmOAuthLinkingDto.token);
        return { message: 'OAuth account linked successfully' };
    }

    @Throttle({ medium: { limit: 10, ttl: 60000 } }) // 10 logout attempts per minute
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @ApiOperation({ summary: 'Logout user and revoke access token' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async logout(@Req() req: AuthenticatedRequest) {
        // Extract token from authorization header
        const authHeader = req.headers.authorization as string;
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        await this.authService.logout(token);
        return { message: 'Logged out successfully' };
    }

    @SkipThrottle()
    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully', type: UserAuthDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getProfile(@Request() req: AuthenticatedRequest): Promise<UserAuthDto> {
        return this.authService.getUserProfile(req.user.userId);
    }

    @SkipThrottle()
    @Public()
    @Get('oauth-status')
    getOAuthStatus() {
        const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

        return {
            google: {
                configured: !!(process.env['GOOGLE_CLIENT_ID'] && process.env['GOOGLE_CLIENT_SECRET']),
                clientIdSet: !!process.env['GOOGLE_CLIENT_ID'],
                enabled: true, // Google toujours activé
            },
            apple: {
                configured: !!(
                    process.env['APPLE_CLIENT_ID'] &&
                    process.env['APPLE_TEAM_ID'] &&
                    process.env['APPLE_KEY_ID'] &&
                    process.env['APPLE_PRIVATE_KEY_PATH']
                ),
                clientIdSet: !!process.env['APPLE_CLIENT_ID'],
                enabled: isProduction, // Activé seulement en production
            },
            environment: {
                node_env: this.configService.get<string>('NODE_ENV'),
                frontend_url: this.configService.get<string>('FRONTEND_URL'),
            },
        };
    }

    // Google OAuth routes (toujours activées)
    @SkipThrottle()
    @Public()
    @Get('google')
    @UseGuards(GoogleOAuthGuard)
    async googleAuth() {
        // Passport OAuth2 automatically generates and stores state in session
        // Guard redirects to Google - this line won't execute
        return;
    }

    // Mobile-specific OAuth endpoint
    @SkipThrottle()
    @Public()
    @Get('google/mobile')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthMobile(@Req() req: any) {
        // Store platform in session for mobile requests
        (req.session as any).oauthPlatform = 'mobile';
        // Guard redirects to Google - this line won't execute
        return;
    }

    @SkipThrottle()
    @Public()
    @UseGuards(GoogleOAuthGuard)
    @Get('google/callback')
    async googleAuthRedirect(@Req() req: OAuthRequest, @Res() res: Response) {
        if (!process.env['GOOGLE_CLIENT_ID'] || !process.env['GOOGLE_CLIENT_SECRET']) {
            const redirectUrl = `${process.env['FRONTEND_URL'] || 'http://localhost:3000'}/auth/callback?error=google_not_configured`;
            return res.redirect(redirectUrl);
        }

        // Passport OAuth2 already validated the state parameter via session
        // No need for manual validation - if we reached here, state is valid

        // req.user is actually a LoginResponse from validateOAuthUser() in the strategy
        const loginResponse = req.user as any as LoginResponse;

        // Determine callback URL based on platform stored in session or User-Agent
        const platform = (req.session as any).oauthPlatform as string;
        const userAgent = req.headers['user-agent'] || '';
        const isMobileApp = platform === 'mobile' || userAgent.includes('Expo') || userAgent.includes('ReactNative');

        const callbackUrl = isMobileApp
            ? this.configService.get<string>('MOBILE_CALLBACK_URL') || 'playertracker://auth/callback'
            : `${process.env['FRONTEND_URL'] || 'http://localhost:3000'}/auth/callback`;

        // PLATFORM RESTRICTION: Validate role matches platform
        const userRole = loginResponse.user.role;

        // Web platform: STAFF only
        if (!isMobileApp && userRole !== 'STAFF') {
            // Clean up session
            if ((req.session as any).oauthPlatform) {
                delete (req.session as any).oauthPlatform;
            }
            // Redirect to login with generic error
            const redirectUrl = `${callbackUrl}?error=access_denied`;
            return res.redirect(redirectUrl);
        }

        // Mobile platform: PLAYER only
        if (isMobileApp && userRole !== 'PLAYER') {
            // Clean up session
            if ((req.session as any).oauthPlatform) {
                delete (req.session as any).oauthPlatform;
            }
            // Redirect to login with generic error
            const redirectUrl = `${callbackUrl}?error=access_denied`;
            return res.redirect(redirectUrl);
        }

        // SECURITY FIX: Generate temporary authorization code instead of exposing tokens in URL
        const authCode = this.authService.generateAuthCode();

        // Store code with tokens temporarily (15 min expiry)
        await this.authService.storeAuthorizationCode(authCode, loginResponse);

        // Clean up session platform after use (if it was set)
        if ((req.session as any).oauthPlatform) {
            delete (req.session as any).oauthPlatform;
        }

        // Redirect with only the code (tokens never in URL)
        const redirectUrl = `${callbackUrl}?code=${authCode}`;
        return res.redirect(redirectUrl);
    }

    // Apple OAuth routes (conditionnelles)
    @SkipThrottle()
    @Public()
    @Get('apple')
    @UseGuards(AppleOAuthGuard)
    async appleAuth() {
        // Passport OAuth2 automatically generates and stores state in session
        // Guard redirects to Apple - this line won't execute
        return;
    }

    // Mobile-specific Apple OAuth endpoint
    @SkipThrottle()
    @Public()
    @Get('apple/mobile')
    @UseGuards(AppleOAuthGuard)
    async appleAuthMobile(@Req() req: any) {
        // Store platform in session for mobile requests
        (req.session as any).oauthPlatform = 'mobile';
        // Guard redirects to Apple - this line won't execute
        return;
    }

    @SkipThrottle()
    @Public()
    @UseGuards(AppleOAuthGuard)
    @Get('apple/callback')
    async appleAuthRedirect(@Req() req: OAuthRequest, @Res() res: Response) {
        const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

        if (!isProduction) {
            const redirectUrl = `${process.env['FRONTEND_URL'] || 'http://localhost:3000'}/auth/callback?error=apple_not_available_in_dev`;
            return res.redirect(redirectUrl);
        }

        if (
            !process.env['APPLE_CLIENT_ID'] ||
            !process.env['APPLE_TEAM_ID'] ||
            !process.env['APPLE_KEY_ID'] ||
            !process.env['APPLE_PRIVATE_KEY_PATH']
        ) {
            const redirectUrl = `${process.env['FRONTEND_URL'] || 'http://localhost:3000'}/auth/callback?error=apple_not_configured`;
            return res.redirect(redirectUrl);
        }

        // Passport OAuth2 already validated the state parameter via session
        // No need for manual validation - if we reached here, state is valid

        // req.user is actually a LoginResponse from validateOAuthUser() in the strategy
        const loginResponse = req.user as any as LoginResponse;

        // Determine callback URL based on platform stored in session or User-Agent
        const platform = (req.session as any).oauthPlatform as string;
        const userAgent = req.headers['user-agent'] || '';
        const isMobileApp = platform === 'mobile' || userAgent.includes('Expo') || userAgent.includes('ReactNative');

        const callbackUrl = isMobileApp
            ? this.configService.get<string>('MOBILE_CALLBACK_URL') || 'playertracker://auth/callback'
            : `${process.env['FRONTEND_URL'] || 'http://localhost:3000'}/auth/callback`;

        // PLATFORM RESTRICTION: Validate role matches platform
        const userRole = loginResponse.user.role;

        // Web platform: STAFF only
        if (!isMobileApp && userRole !== 'STAFF') {
            // Clean up session
            if ((req.session as any).oauthPlatform) {
                delete (req.session as any).oauthPlatform;
            }
            // Redirect to login with generic error
            const redirectUrl = `${callbackUrl}?error=access_denied`;
            return res.redirect(redirectUrl);
        }

        // Mobile platform: PLAYER only
        if (isMobileApp && userRole !== 'PLAYER') {
            // Clean up session
            if ((req.session as any).oauthPlatform) {
                delete (req.session as any).oauthPlatform;
            }
            // Redirect to login with generic error
            const redirectUrl = `${callbackUrl}?error=access_denied`;
            return res.redirect(redirectUrl);
        }

        // SECURITY FIX: Generate temporary authorization code instead of exposing tokens in URL
        const authCode = this.authService.generateAuthCode();

        // Store code with tokens temporarily (15 min expiry)
        await this.authService.storeAuthorizationCode(authCode, loginResponse);

        // Clean up session platform after use (if it was set)
        if ((req.session as any).oauthPlatform) {
            delete (req.session as any).oauthPlatform;
        }

        // Redirect with only the code (tokens never in URL)
        const redirectUrl = `${callbackUrl}?code=${authCode}`;
        return res.redirect(redirectUrl);
    }
}
