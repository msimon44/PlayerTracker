import passport from 'passport';

/**
 * Passport Session Serializers
 * Required when using PassportModule.register({ session: true })
 *
 * These functions determine what data is stored in the session and how to retrieve it.
 * For OAuth flows, we typically don't need to serialize user data since we use
 * the authorization code pattern and store tokens separately.
 *
 * However, Passport still requires these to be defined when session support is enabled.
 */

/**
 * Serializes user data for storage in the session
 * Only the minimal data needed to identify the user should be stored
 */
passport.serializeUser((user: any, done) => {
    // For OAuth flows with authorization code pattern, we don't need to store user data
    // The session is only used for CSRF state validation during OAuth
    done(null, user);
});

/**
 * Deserializes user data from the session
 * Called on subsequent requests to retrieve user information
 */
passport.deserializeUser((user: any, done) => {
    // For OAuth flows, the session is short-lived (10 minutes)
    // and only used during the OAuth authorization process
    done(null, user);
});
