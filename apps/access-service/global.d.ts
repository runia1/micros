import type { PrismaClient } from './generated/prisma-client';

// Extend the NodeJS namespace with custom properties
declare global {
    var prisma: PrismaClient;

    namespace NodeJS {
        interface ProcessEnv {
            readonly NODE_ENV: 'development' | 'production';
            readonly CLIENT_DATABASE_URL: string;
        }
    }
}
