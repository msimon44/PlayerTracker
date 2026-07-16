import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env['GOOGLE_CLIENT_ID'] || '',
            clientSecret: process.env['GOOGLE_CLIENT_SECRET'] || '',
            callbackURL: process.env['GOOGLE_CALLBACK_URL'] || 'http://localhost:3001/auth/google/callback',
            scope: ['email', 'profile'],
            state: true, // Enable state parameter for CSRF protection
            passReqToCallback: true, // Pass request to callback to access session/headers
        });
    }

    async validate(
        req: any,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        try {
            const { id, emails, name, photos } = profile;

            // Determine platform from session or User-Agent
            const platform = (req.session as any)?.oauthPlatform as string;
            const userAgent = req.headers?.['user-agent'] || '';
            const isMobileApp =
                platform === 'mobile' || userAgent.includes('Expo') || userAgent.includes('ReactNative');

            const user = await this.authService.validateOAuthUser({
                provider: 'google',
                providerId: id,
                email: emails[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
                avatarUrl: photos[0]?.value,
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
