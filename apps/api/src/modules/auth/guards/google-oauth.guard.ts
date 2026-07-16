import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
    constructor() {
        super({
            accessType: 'offline',
        });
    }
    // Passport OAuth2 automatically handles state parameter via express-session
    // No need to manually pass it
}
