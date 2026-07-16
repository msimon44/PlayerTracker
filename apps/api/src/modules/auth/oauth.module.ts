import { Module, DynamicModule } from '@nestjs/common';
import { GoogleStrategy } from './strategies/google.strategy';
import { AppleStrategy } from './strategies/apple.strategy';

@Module({})
export class OAuthModule {
    static forRoot(): DynamicModule {
        const providers: any[] = [];

        // Ajouter Google Strategy si configuré
        if (process.env['GOOGLE_CLIENT_ID'] && process.env['GOOGLE_CLIENT_SECRET']) {
            providers.push(GoogleStrategy);
        }

        // Ajouter Apple Strategy si configuré
        if (
            process.env['APPLE_CLIENT_ID'] &&
            process.env['APPLE_TEAM_ID'] &&
            process.env['APPLE_KEY_ID'] &&
            process.env['APPLE_PRIVATE_KEY_PATH']
        ) {
            providers.push(AppleStrategy);
        }

        return {
            module: OAuthModule,
            providers,
            exports: providers,
        };
    }
}
