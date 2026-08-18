/**
 * Instrumentation Sentry côté navigateur pour l'application web PlayerTracker.
 * Chargée automatiquement par @sentry/nextjs.
 *
 * L'activation est conditionnée à la présence de NEXT_PUBLIC_SENTRY_DSN
 * pour permettre les builds locaux et de démonstration sans télémétrie externe.
 */
import * as Sentry from '@sentry/nextjs';

const dsn = process.env['NEXT_PUBLIC_SENTRY_DSN'];

if (dsn) {
    Sentry.init({
        dsn,
        environment: process.env['NEXT_PUBLIC_ENV'] || 'development',
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 1.0,
    });
}
