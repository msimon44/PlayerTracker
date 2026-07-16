import { Request } from 'express';

/**
 * JWT Payload extracted from access token by JwtStrategy
 */
export interface JwtPayload {
    userId: number;
    email: string;
    role: string;
}

/**
 * Refresh Token Payload extracted from refresh token by RefreshTokenStrategy
 */
export interface RefreshTokenPayload {
    userId: number;
    email: string;
    role: string;
    refreshToken: string;
}

/**
 * OAuth Provider User Data
 */
export interface OAuthUser {
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    profile: {
        provider: string;
        providerId: string;
        email: string;
        firstName?: string;
        lastName?: string;
        avatarUrl?: string | null;
    };
}

/**
 * Express Request with JWT authenticated user
 */
export interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}

/**
 * Express Request with Refresh Token authenticated user
 */
export interface RefreshTokenRequest extends Request {
    user: RefreshTokenPayload;
}

/**
 * Express Request with OAuth authenticated user
 */
export interface OAuthRequest extends Request {
    user: OAuthUser;
}
