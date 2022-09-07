import type { AxiosInstance } from 'axios';
import type { UnverifiedAuthContext } from './authContexts/unverifiedAuthContext';
import { AuthContext } from './authContexts/authContext';

import { decodeJwt, jwtVerify, createRemoteJWKSet } from 'jose';

export interface ValidClaims {
    sub: string;
    cid: number;
    prm: string[];
    exp: number;
    typ: 'BA' | 'SA';
    jit: string;
}

export class AuthClient {
    private readonly baseUrl: string;

    public constructor(
        private readonly axiosClient: AxiosInstance,
        private readonly expireBufferSeconds: number = 30
    ) {
        this.baseUrl = axiosClient.getUri();
    }

    public async verify(
        unverifiedAuthContext: UnverifiedAuthContext
    ): Promise<AuthContext> {
        const decoded = decodeJwt(unverifiedAuthContext.token);
        if (!hasRequiredClaims(decoded)) {
            throw new Error('JWT missing required claims');
        }

        // if this is about to expire, ask the auth-service for a new one
        const now = Math.floor(Date.now() / 1000);
        const alreadyExpired = decoded.exp <= now;
        const aboutToExpire = decoded.exp - this.expireBufferSeconds <= now;

        if (decoded.typ === 'SA') {
            if (alreadyExpired) {
                throw new Error('JWT expired');
            }

            if (aboutToExpire) {
                unverifiedAuthContext = await this.fetchNewServerAuth(
                    unverifiedAuthContext
                );
            }
        } else if (decoded.typ === 'BA') {
            // Because BroserAuth has a refreshToken, we can use it to get a new token
            // even if the regular token is already expired.
            if (alreadyExpired || aboutToExpire) {
                unverifiedAuthContext = await this.fetchNewBrowserAuth(
                    unverifiedAuthContext
                );
            }
        }

        // fetch JWT Key Set from url if need be.
        // utilizes an in-memory cache and only makes api call
        // if it doesn't have a key with an id that matches kid in JWT
        const JWKS = createRemoteJWKSet(new URL(`${this.baseUrl}/api/v1/jwks`));

        // now let's verify the current token
        const { payload, protectedHeader } = await jwtVerify(
            unverifiedAuthContext.token,
            JWKS
        );

        // we know the claims DO contain everything in ValidClaims since we already
        // ran type gurad on "decoded"
        const validClaims = payload as unknown as ValidClaims;

        return new AuthContext(
            validClaims,
            unverifiedAuthContext.token,
            unverifiedAuthContext.refreshToken,
            unverifiedAuthContext.refreshTokenExpiration
        );
    }

    private async fetchNewBrowserAuth(
        auth: UnverifiedAuthContext
    ): Promise<UnverifiedAuthContext> {
        const response = await this.axiosClient.post(
            '/api/v1/exchange-browser-auth',
            {
                token: auth.token,
                refreshToken: auth.refreshToken,
            }
        );

        return {
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            refreshTokenExpiration: response.data.refreshTokenExpiration,
        };
    }

    private async fetchNewServerAuth(
        auth: UnverifiedAuthContext
    ): Promise<UnverifiedAuthContext> {
        const response = await this.axiosClient.post(
            '/api/v1/exchange-service-auth',
            {
                token: auth.token,
            }
        );

        return {
            token: response.data.token,
        };
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
