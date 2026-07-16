import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { type JwtPayload } from '../types/auth-request.types';

interface JwtTokenPayload {
    sub: number;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        if (!process.env['JWT_SECRET']) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env['JWT_SECRET'],
            passReqToCallback: true, // Pass request to validate method
        });
    }

    async validate(request: Request, payload: JwtTokenPayload): Promise<JwtPayload> {
        // Extract token from authorization header
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        // Check if token has been revoked
        const isRevoked = await this.authService.isTokenRevoked(token);
        if (isRevoked) {
            throw new UnauthorizedException('Token has been revoked');
        }

        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
}
