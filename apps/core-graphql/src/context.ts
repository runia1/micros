import type { PrismaClient } from '../generated/prisma-client';
import prisma from '../prisma/client';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AuthContext } from '@micros/auth-service-sdk';
import { AuthenticateMiddleware } from '@micros/auth-service-sdk';

export interface ApolloServerContext {
    prisma: PrismaClient;
    authContext: AuthContext | undefined;
}

// First arg is base url of my auth-service
// Second is the auth strategies my core-graphql service accepts
// (i.e. I allow calls from browsers and other services)
const authMiddlware = new AuthenticateMiddleware('http://localhost:4000', [
    'BrowserAuth',
    'ServiceAuth',
]);

export default async function context({
    req,
    res,
}: {
    req: IncomingMessage;
    res: ServerResponse;
}): Promise<ApolloServerContext> {
    const gqlContext: ApolloServerContext = {
        prisma,
        // basicContext just has an empty viewer
        authContext: undefined,
    };

    // typically in an express server you'd do something like
    // app.use(authMiddlware.authenticate);
    // but since this is gql, shim this express middlware into graphql.
    // It has a side-effect of adding the authContext to the req object.
    await authMiddlware.authenticate(req, res, () => {});

    // snag this off req and add this to the gql context
    gqlContext.authContext = req.authContext;

    return gqlContext;
}
