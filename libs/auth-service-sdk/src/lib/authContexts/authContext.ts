import type { ValidClaims } from '../authClient';
import { hasNecessaryPermissions } from '@micros/auth-core';

export class AuthContext {
    constructor(
        private readonly validClaims: ValidClaims,
        private readonly type: 'BrowserAuth' | 'ServiceAuth',
        private readonly token: string,
        private readonly refreshToken?: string,
        private readonly refreshTokenExpiration?: number
    ) {}

    public getType(): 'BrowserAuth' | 'ServiceAuth' {
        return this.type;
    }

    public getUserId(): string {
        return this.validClaims.sub;
    }

    public getClientId(): number {
        return this.validClaims.cid;
    }

    public getToken(): string {
        return this.token;
    }

    public getTokenExpiration(): Date {
        return new Date(this.validClaims.exp * 1000);
    }

    public getRefreshToken(): string | undefined {
        return this.refreshToken;
    }

    public getRefreshTokenExpiration(): Date | undefined {
        if (this.refreshTokenExpiration) {
            return new Date(this.refreshTokenExpiration * 1000);
        }

        return undefined;
    }

    public getPermissions(): string[] {
        return this.validClaims.prm;
    }

    public hasNecessaryPermissions(
        requiredPermissions: string | string[]
    ): boolean {
        return hasNecessaryPermissions(
            requiredPermissions,
            this.validClaims.prm
        );
    }
}
