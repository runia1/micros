import type { Application } from 'express';
import type { JSONWebKeySet } from 'jose';

interface Datastore {
    readJWKS(): Promise<JSONWebKeySet>;
}

export class AuthServer {
    constructor(private readonly datastoreAdapter: Datastore) {}

    public registerRoutes(app: Application) {
        app.get('/api/v1/jwks', async (req, res) => {
            const jwks = await this.datastoreAdapter.readJWKS();

            res.send(jwks);
        });

        app.post('/api/v1/exchange-browser-auth', (req, res) => {
            // validate this token-pair first

            // if it's valid send back a new token-pair
            res.send("here's a new token-pair");
        });

        app.post('/api/v1/exchange-service-auth', (req, res) => {
            // validate this token first

            // if it's valid send back a new token
            res.send("here's a new token");
        });

        app.post('/api/v1/signup', (req, res) => {
            res.send('cool you have an account now');
        });

        app.post('/api/v1/login', (req, res) => {
            res.send('cool you have been logged in');
        });

        app.post('/api/v1/logout', (req, res) => {
            res.send('cool you have been logged out');
        });
    }
}
