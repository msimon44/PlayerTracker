import 'express-session';

declare module 'express-session' {
    interface SessionData {
        oauthPlatform?: 'mobile' | 'web';
    }
}
