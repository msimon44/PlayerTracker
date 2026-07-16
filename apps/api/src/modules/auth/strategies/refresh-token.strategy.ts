import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { type RefreshTokenPayload } from '../types/auth-request.types';

interface RefreshTokenJwtPayload {
    sub: number;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(configService: ConfigService) {
        const refreshSecret = configService.get<string>('JWT_REFRESH_SECRET');
        if (!refreshSecret) {
            throw new Error('JWT_REFRESH_SECRET environment variable is not defined');
        }

        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            ignoreExpiration: false,
            secretOrKey: refreshSecret,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: RefreshTokenJwtPayload): Promise<RefreshTokenPayload> {
        const refreshToken = req.body?.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token missing');
        }

        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
            refreshToken,
        };
    }
}
