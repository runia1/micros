import { IncomingMessage } from 'node:http';
import { UnverifiedAuthContext } from '../authContexts/unverifiedAuthContext';

export function serverAuthExtractor(
    req: IncomingMessage
): UnverifiedAuthContext | undefined {
    if (!req.headers['authorization']) {
        return undefined;
    }

    const authHeader = req.headers['authorization'];

    if (!authHeader.startsWith('Bearer ')) {
        return undefined;
    }

    return {
        token: authHeader.substring(7),
    };
}
