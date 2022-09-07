import type { Application, Request } from 'express';
import type { JSONWebKeySet } from 'jose';
import { decodeJwt, jwtVerify } from 'jose';
import { z } from 'zod';
import { DatabaseJWKSet } from '../databaseJWKSet';

export interface TypedRequestBody<T> extends Request {
    body: T;
}

const exchangeBrowserAuthBody = z.object({
    token: z.string(),
    refreshToken: z.string(),
});

const exchangeServerAuthBody = z.object({
    token: z.string(),
    refreshToken: z.string().optional(),
});

export interface FullRefreshToken {
    id: string;
    jti: string;
    clientId: number;
    userId: string;
    expiration: Date;
}

export interface Datastore {
    readJWKS(): Promise<JSONWebKeySet>;
    readRefreshToken(token: string): Promise<FullRefreshToken | null>;
}

export class AuthServer {
    private readonly databaseJWKSet: DatabaseJWKSet;

    constructor(private readonly datastoreAdapter: Datastore) {
        this.databaseJWKSet = new DatabaseJWKSet(datastoreAdapter.readJWKS);
    }

    public registerRoutes(app: Application) {
        app.get('/api/v1/jwks', async (req, res) => {
            const jwks = await this.databaseJWKSet.getKeySet();

            res.send(jwks);
        });

        app.post(
            '/api/v1/exchange-browser-auth',
            (
                req: TypedRequestBody<z.infer<typeof exchangeBrowserAuthBody>>,
                res
            ) => {
                exchangeBrowserAuthBody.parse(req.body);

                // validate this token-pair first

                // if it's valid send back a new token-pair
                res.send("here's a new token-pair");
            }
        );

        // NOTE: ServiceAuth tokens are just temporary token to use for service-to-service calls.
        // This endpoint will probably not get called much (if at all), because more than likely,
        // downstream service calls will just use the token part of a BrowserAuth token-pair as a ServiceAuth token.
        // But it IS possible that there could be a series of downstream service calls,
        // or a job queued or something, that could end up taking longer than the 10 min lifetime of a token,
        // in which case we have this endpoint to get a fresh ServiceAuth token if the existing one is about to expire
        // but hasn't expired yet.
        app.post(
            '/api/v1/exchange-service-auth',
            (
                req: TypedRequestBody<z.infer<typeof exchangeServerAuthBody>>,
                res
            ) => {
                exchangeServerAuthBody.parse(req.body);

                // validate this token first

                // if it's valid send back a new token
                res.send("here's a new token");
            }
        );

        app.post('/api/v1/signup', (req, res) => {
            res.send('cool you have an account now');
        });

        app.post('/api/v1/login', (req, res) => {
            res.send('cool you have been logged in');
        });

        app.post('/api/v1/logout', (req, res) => {
            res.send('cool you have been logged out');
        });
    }

    private async validate(token: string, refreshToken?: string) {
        const decoded = decodeJwt(token);
        if (!hasRequiredClaims(decoded)) {
            throw new Error('JWT missing required claims');
        }

        const now = Math.floor(Date.now() / 1000);
        const alreadyExpired = decoded.exp <= now;

        if (decoded.typ === 'SA' && alreadyExpired) {
            throw new Error("Can't exchange an expired ServiceAuth token");
        } else if (decoded.typ === 'BA') {
            // TODO: also check refreshToken hash

            const fullRefreshToken =
                await this.datastoreAdapter.readRefreshToken(
                    refreshToken as string
                );

            if (!fullRefreshToken) {
                throw new Error('Invalid refresh token');
            }

            if (fullRefreshToken.jti !== decoded.jti) {
                throw new Error('Refresh token jti does not match');
            }

            if (fullRefreshToken.clientId !== decoded.cid) {
                throw new Error('Refresh token clientId does not match');
            }

            if (fullRefreshToken.userId !== decoded.sub) {
                throw new Error('Refresh token userId does not match');
            }
        }

        // now let's verify the current token
        const { payload, protectedHeader } = await jwtVerify(
            token,
            this.databaseJWKSet.getKey
        );

        // we know the claims DO contain everything in ValidClaims since we already
        // ran type gurad on "decoded"
        const validClaims = payload as unknown as ValidClaims;
    }
}

const hasRequiredClaims = (decoded: any): decoded is ValidClaims => {
    if (!decoded) {
        return false;
    }

    if (!decoded.sub || !decoded.cid || !decoded.prm || !decoded.exp) {
        return false;
    }

    if (!Array.isArray(decoded.prm)) {
        return false;
    }

    return true;
};

export interface ValidClaims {
    sub: string;
    cid: number;
    prm: string[];
    exp: number;
    typ: 'BA' | 'SA';
    jit: string;
}
