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
import { nodeProfilingIntegration } from '@sentry/profiling-node';

if (process.env['SENTRY_DSN']) {
    Sentry.init({
        dsn: process.env['SENTRY_DSN'],
        environment: process.env['NODE_ENV'] || 'development',
        release: process.env['APP_VERSION'] || 'dev',
        integrations: [nodeProfilingIntegration()],
        // Échantillonnage : 100% des erreurs, 10% des traces de performance
        tracesSampleRate: 0.1,
        profilesSampleRate: 0.1,
        // Ne pas remonter les erreurs 4xx (attendues côté client)
        beforeSend(event) {
            const status = event.contexts?.response?.status_code;
            if (typeof status === 'number' && status >= 400 && status < 500) {
                return null;
            }
            return event;
        },
    });
}
