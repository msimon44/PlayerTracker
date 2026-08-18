/**
 * Instrumentation Sentry côté serveur (SSR / API routes Next.js)
 * pour l'application web PlayerTracker.
 */
import * as Sentry from '@sentry/nextjs';

const dsn = process.env['SENTRY_DSN'];

if (dsn) {
    Sentry.init({
        dsn,
        environment: process.env['NODE_ENV'] || 'development',
        tracesSampleRate: 0.1,
    });
}
