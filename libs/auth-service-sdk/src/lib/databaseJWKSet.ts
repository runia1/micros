import { createLocalJWKSet } from 'jose';
import type {
    JSONWebKeySet,
    KeyLike,
    JWSHeaderParameters,
    FlattenedJWSInput,
} from 'jose';

export class DatabaseJWKSet {
    private jwks: undefined | JSONWebKeySet;
    private localGetKey: undefined | ReturnType<typeof createLocalJWKSet>;

    constructor(private readonly readJWKS: () => Promise<JSONWebKeySet>) {}

    public async getKey(
        protectedHeader: JWSHeaderParameters,
        token: FlattenedJWSInput
    ): Promise<KeyLike | Uint8Array> {
        try {
            if (!this.localGetKey) {
                throw new Error('localGetKey undefined');
            }

            return this.localGetKey(protectedHeader, token);
        } catch (e) {
            // if we threw we didn't find a key.. so try re-fetching the jwks..
            // TODO: put some backoff logic here maybe? Can probably copy some of it out of the
            // RemoteJWKSet class
            const jwks = await this.readJWKS();

            this.jwks = jwks;
            this.localGetKey = createLocalJWKSet(jwks);

            return this.localGetKey(protectedHeader, token);
        }
    }

    public async getKeySet(): Promise<JSONWebKeySet> {
        if (!this.jwks) {
            const jwks = await this.readJWKS();

            this.jwks = jwks;
            this.localGetKey = createLocalJWKSet(jwks);
        }

        return this.jwks;
    }
}
