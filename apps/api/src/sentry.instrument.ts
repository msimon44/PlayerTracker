/**
 * Instrumentation Sentry pour l'API PlayerTracker.
 *
 * IMPORTANT : ce fichier doit être importé EN TOUT PREMIER dans main.ts,
 * avant tout autre import applicatif, pour que l'instrumentation
 * automatique de Node.js soit correctement appliquée.
 *
 * Sentry n'est activé que si la variable SENTRY_DSN est renseignée.
 * En son absence, l'API démarre normalement sans télémétrie externe.
 */
import * as Sentry from '@sentry/nestjs';

const dsn = process.env['SENTRY_DSN'];

if (dsn) {
    Sentry.init({
        dsn,
        environment: process.env['NODE_ENV'] || 'development',
        release: process.env['APP_VERSION'] || 'dev',
        // Échantillonnage des traces de performance : 10% des transactions
        tracesSampleRate: 0.1,
    });
}
