import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';

import { EncryptionService } from '../../common/utils/encryption.util';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { RolesGuard } from './decorators/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import { AppleStrategy } from './strategies/apple.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
    imports: [
        UsersModule,
        EmailModule,
        PrismaModule,
        PassportModule.register({ session: true }),
        ConfigModule,
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000, // 1 second
                limit: 3, // 3 requests max
            },
            {
                name: 'medium',
                ttl: 60000, // 1 minute
                limit: 20, // 20 requests max
            },
            {
                name: 'long',
                ttl: 900000, // 15 minutes
                limit: 100, // 100 requests max
            },
        ]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'default-secret-key',
                signOptions: { expiresIn: '1h' }, // Default for access tokens
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        RefreshTokenStrategy,
        GoogleStrategy,
        EncryptionService,
        {
            provide: AppleStrategy,
            useFactory: (authService: AuthService, configService: ConfigService) => {
                const isProduction = configService.get<string>('NODE_ENV') === 'production';

                if (isProduction) {
                    return new AppleStrategy(authService);
                }
                return null;
            },
            inject: [AuthService, ConfigService],
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [AuthService],
})
export class AuthModule {}
