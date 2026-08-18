/**
 * Point d'entrée d'instrumentation Next.js.
 * Charge la configuration Sentry adaptée au runtime (Node.js ou Edge).
 * Voir : https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
    if (process.env['NEXT_RUNTIME'] === 'nodejs') {
        await import('../sentry.server.config');
    }
}
