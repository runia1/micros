import type { JWKS } from 'oidc-provider';

// Extend the NodeJS namespace with custom properties
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly NODE_ENV: 'development' | 'production';
            readonly POSTGRES_PASSWORD: string;
            readonly JWKS: string;

            readonly REDIS_URL: string;
        }
    }
}
