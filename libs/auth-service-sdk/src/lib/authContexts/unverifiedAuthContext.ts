export interface UnverifiedAuthContext {
    type: 'BrowserAuth' | 'ServiceAuth';
    token: string;
    // Will be available if type is BrowserAuth
    refreshToken?: string;
    // Will be available if type is BrowserAuth and exchange request gave us the expiration timestamp
    refreshTokenExpiration?: number;
}
