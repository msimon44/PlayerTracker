/**
 * Instrumentation Sentry côté navigateur pour l'application web PlayerTracker.
 * Chargée automatiquement par @sentry/nextjs.
 *
 * L'activation est conditionnée à la présence de NEXT_PUBLIC_SENTRY_DSN
 * pour permettre les builds locaux et de démonstration sans télémétrie externe.
 */
import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NEXT_PUBLIC_ENV || 'development',
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 1.0,
    });
}
