import type { PrismaClient } from './generated/prisma-client';

// Extend the NodeJS namespace with custom properties
declare global {
    var prisma: PrismaClient;

    namespace NodeJS {
        interface ProcessEnv {
            readonly NODE_ENV: 'development' | 'production';
            readonly CLIENT_DATABASE_URL: string;
            readonly CLI_DATABASE_URL: string;
            readonly MAILGUN_API_KEY: string;
            readonly MAILGUN_DOMAIN: string;
            readonly MAILGUN_PUBLIC_KEY: string;
            readonly LOGIN_JWT_SECRET: string;
            readonly API_JWT_SECRET: string;
        }
    }
}
