/**
 * This should be an express-like middleware (hopefully we can use it for other node server frameworks too)..
 * that registers the necessary routes and handlers for the auth-service endpoints.
 *
 * End user will need a Datastore interface so they can provide their own impl for
 * how to read & wrote the things that need to be persisted.
 *
 * - GET /api/v1/jwks returns the current JWKS
 * - POST /api/v1/exchange-browser-auth exchanges the current token-pair for a new token-pair
 * - POST /api/v1/exchange-service-auth echanges the current token for new token
 *
 * - POST /api/v1/signup
 * - POST /api/v1/login
 * - POST /api/v1/logout
 *
 */

export class RegisterAuthRoutesMiddleware {}
