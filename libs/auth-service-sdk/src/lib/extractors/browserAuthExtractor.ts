import { IncomingMessage } from 'node:http';
import { UnverifiedAuthContext } from '../authContexts/unverifiedAuthContext';
import cookie from 'cookie';

export function browserAuthExtractor(
    req: IncomingMessage
): UnverifiedAuthContext | undefined {
    if (!req.headers['cookie']) {
        return undefined;
    }

    const cookies = cookie.parse(req.headers.cookie);

    if (!cookies.token || !cookies.refreshToken) {
        return undefined;
    }

    return {
        type: 'BrowserAuth',
        token: cookies.token,
        refreshToken: cookies.refreshToken,
    };
}
