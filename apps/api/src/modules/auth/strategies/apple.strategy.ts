import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env['APPLE_CLIENT_ID'] || '',
            teamID: process.env['APPLE_TEAM_ID'] || '',
            keyID: process.env['APPLE_KEY_ID'] || '',
            privateKeyLocation: process.env['APPLE_PRIVATE_KEY_PATH'] || '',
            callbackURL: process.env['APPLE_CALLBACK_URL'] || 'http://localhost:3001/auth/apple/callback',
            scope: ['email', 'name'],
            state: true, // Enable state parameter for CSRF protection
            passReqToCallback: true, // Pass request to callback to access session/headers
        });
    }

    async validate(
        req: any,
        accessToken: string,
        refreshToken: string,
        idToken: any,
        profile: any,
        done: any,
    ): Promise<any> {
        try {
            const { sub: providerId, email } = idToken;
            const { name } = profile;

            // Determine platform from session or User-Agent
            const platform = (req.session as any)?.oauthPlatform as string;
            const userAgent = req.headers?.['user-agent'] || '';
            const isMobileApp =
                platform === 'mobile' || userAgent.includes('Expo') || userAgent.includes('ReactNative');

            const user = await this.authService.validateOAuthUser({
                provider: 'apple',
                providerId,
                email,
                firstName: name?.firstName,
                lastName: name?.lastName,
                accessToken,
                refreshToken,
                platform: isMobileApp ? 'mobile' : 'web',
            });

            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
}
