import type { IncomingMessage, ServerResponse } from 'node:http';
import { AuthClient } from '../authClient';
import axios from 'axios';
import type { AuthContext } from '../authContexts/authContext';
import { browserAuthExtractor } from '../extractors/browserAuthExtractor';
import { serverAuthExtractor } from '../extractors/serverAuthExtractor';

declare module 'http' {
    interface IncomingMessage {
        authContext: AuthContext | undefined;
    }
}
declare module 'node:http' {
    interface IncomingMessage {
        authContext: AuthContext | undefined;
    }
}

type ValidStrategies = 'BrowserAuth' | 'ServiceAuth';

export class AuthenticateMiddleware {
    private authClient: AuthClient;
    private readonly authStrategy: ValidStrategies[] = [
        'BrowserAuth',
        'ServiceAuth',
    ];

    public constructor(
        private readonly authServiceUrl: string,
        authStrategy?: ValidStrategies[]
    ) {
        if (authStrategy?.length && authStrategy.length > 0) {
            this.authStrategy = authStrategy;
        }

        // TODO: DI this but provide a default here so end users don't have to know about it?
        const instance = axios.create({
            baseURL: this.authServiceUrl,
            timeout: 1000,
        });

        this.authClient = new AuthClient(instance);
    }

    /**
     * - Extracts the auth context off the request
     * - Uses the AuthClient to verify the token
     *
     * @param req takes a generic node:http `IncomingMessage` object.
     *            All node server frameworks utilize node:http "under the covers",
     *            so no matter which framework we're using, we're pretty much guaranteed
     *            to be handed some derivative of an `IncomingMessage`.
     */
    public async authenticate(
        req: IncomingMessage,
        res: ServerResponse,
        next: () => void
    ): Promise<void> {
        try {
            // Run through whatever array of extractors they configure and try to extract
            // an unverified auth context
            const unverifiedAuthContext = this.extract(req);
            if (!unverifiedAuthContext) {
                next();
                return;
            }

            // verify the auth context (JWT)
            const authContext = await this.authClient.verify(
                unverifiedAuthContext
            );

            // stuff the auth context on the request so downstream middleware / request
            // handlers / graphql context builders can grab it.
            req.authContext = authContext;

            // if it's BrowserAuth and the result of calling `verify()` was that a new token and refreshToken were
            // generated, we should stuff those as cookies on the response.
            const type = authContext.getType();
            const token = authContext.getToken();
            const tokenExpiration = authContext.getTokenExpiration();
            const refreshToken = authContext.getRefreshToken();
            const refreshTokenExpiration =
                authContext.getRefreshTokenExpiration();

            if (
                type === 'BrowserAuth' &&
                refreshToken &&
                refreshTokenExpiration
            ) {
                res.setHeader('Set-Cookie', [
                    `token=${token}; Expires=${tokenExpiration.toUTCString()}; Path=/; ${
                        process.env.NODE_ENV === 'development' ? '' : 'Secure;'
                    } SameSite=Strict`,
                    `refreshToken=${refreshToken}; Expires=${refreshTokenExpiration.toUTCString()}; Path=/; ${
                        process.env.NODE_ENV === 'development' ? '' : 'Secure;'
                    } HttpOnly; SameSite=Strict`,
                ]);
            }

            next();
        } catch (error) {
            // TODO: handle error here, or not?
            next();
        }
    }

    private extract(req: IncomingMessage) {
        for (const strategy of this.authStrategy) {
            const extractor = this.getExtractorByStrategy(strategy);

            const unverifiedAuthContext = extractor(req);
            if (unverifiedAuthContext) {
                return unverifiedAuthContext;
            }
        }

        return undefined;
    }

    private getExtractorByStrategy(strategy: ValidStrategies) {
        switch (strategy) {
            case 'BrowserAuth':
                return browserAuthExtractor;
            case 'ServiceAuth':
                return serverAuthExtractor;
        }
    }
}
