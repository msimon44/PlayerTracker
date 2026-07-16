import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AppleOAuthGuard extends AuthGuard('apple') {
    // Passport OAuth2 automatically handles state parameter via express-session
    // No need to manually pass it
}
