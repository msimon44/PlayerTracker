/**
 * JWT Utilities for Client-Side
 *
 * WARNING: These functions DO NOT verify JWT signatures.
 * They are ONLY for client-side UX improvements (checking expiration, reading payload).
 *
 * SECURITY:
 * - JWT verification is done server-side by the NestJS API using passport-jwt
 * - Never trust client-side JWT validation for security decisions
 * - All API requests are verified by the backend with proper signature validation
 */

interface JwtPayload {
    sub: number;
    email: string;
    role: string;
    exp?: number;
    iat?: number;
}

/**
 * Decode a JWT token without verification
 *
 * WARNING: This does NOT verify the signature.
 * Use ONLY for reading non-sensitive data from the payload (e.g., expiration time)
 * for client-side UX purposes like avoiding unnecessary API calls.
 *
 * NEVER use this for security decisions.
 */
export function decodeJwt(token: string): JwtPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        // Decode the payload (second part)
        const payload = parts[1];
        if (!payload) {
            return null;
        }
        const decoded = Buffer.from(payload, 'base64').toString('utf-8');
        return JSON.parse(decoded);
    } catch (error) {
        return null;
    }
}

/**
 * Check if a JWT token is expired (client-side check only)
 *
 * Use this to improve UX by avoiding API calls with expired tokens.
 * The backend will still validate all tokens properly.
 */
export function isTokenExpired(token: string): boolean {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) {
        return true;
    }

    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
}

/**
 * Get the token expiration time in seconds (Unix timestamp)
 * Returns null if token is invalid or has no expiration
 */
export function getTokenExpiration(token: string): number | null {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) {
        return null;
    }
    return decoded.exp;
}
