import express from 'express';
import { AuthServer } from '@micros/auth-service-sdk';
import prisma from '../prisma/client';

const app = express();

const authServer = new AuthServer({
    async readJWKS() {
        const jwks = await prisma.jWK.findMany();

        const onlyPublicKeyAttributes = jwks.map((jwk) => {
            // @ts-expect-error Prisma doesn't know what is stored in the JSONB column
            const { d, p, q, dp, dq, qi, ...publicJWK } = jwk.key;

            return {
                kid: jwk.kid,
                ...publicJWK,
            };
        });

        return {
            keys: onlyPublicKeyAttributes,
        };
    },
});

authServer.registerRoutes(app);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

server.on('error', console.error);
