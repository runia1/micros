import axios from 'axios';
import nock from 'nock';
import { SignJWT, importJWK, KeyLike } from 'jose';
import { AuthClient } from './authClient';

describe('AuthClient', () => {
    describe('verify()', () => {
        let authClient: AuthClient;

        const privateJWK = {
            e: 'AQAB',
            n: '0PjQVV2ZAT27Y0h7hfAWWcnPetORCvR1_gHvEUxtlrlnhZia7utHl7BCJH9HP17YHMMBeeEkmUDflYoUL6MDl4DYHgVDq8jZfu1pxH1XqrpeswqOVoReknEe0F5kRt_mPtIoShI2Qv-pxGAw392akAXTirVRLL4Fn_0Oiifxp182P7eTPy41rlKDevLHuKHBZzzaes_33YE2epY2YCLp9k3mZ-tJEei2qiq0T1fERQicGUL8kppOnz0cDNuKRBHyYtXWhjhuDQ8OZQHNLfte9cqzTJMJ4Leu4MGjikSZMsk-_aRFnXtYHH0orwY-giSenRnwNaReAXaR1Px9ReljAQ',
            d: 'LXGufKH6IBb4pUKh-iKX-ba1dBSGOkenUTHCd5STUG_JX3gsWUC5NPeTqrQzHkjV3otZytN3TgyZkr-QXDurEEtotD6Y1Ma85aljkuNfKTWWWoE1KwNmPZp0BQRB8lfGjmrNcC49tpw6owX4GvbqId_ifQupN32rY3t4qfq9xpO9SAqZF0oUMoS7xE0zChsCJmNYpD9jx87p5Vud1naeaZPlvwWW0ITV4kp2zjYSbBh5DkI52rSrGjkuzlsJ_lKJk5YB557OHhN9XTRBnjqlwwWevh6QAoUivqpcelcplgmfxTHoII1opovYXn8AVt-DbGSO_7LLJ0Sw9sJR5GAqcQ',
            p: '9RdDqZ3O73lH6nWUGi0abQRRfgvj-HM0zP7GSDQ185l-ZByletl1VuJ86qYJTUY8Q3Gagv6_eXmQMo_14-0wT_FPUMiTMYsjw5QNgFgjlJTM1AayS_U5ddix_Ut7Kti7EXgM0gsavsIazv2-xwCrFzD4sa-t2FWELzzWxgt8wbs',
            q: '2kX8MN8ItGnn7NnPx-0iqe8kkhy5s9gJRiD3mxN9E6xzRCnf488yhc3aBwI9kZzQtV0XVjX5VhCws5vnJv9b7KA8NATDhpGNrqy2h9ncmsjTTjafUg3jb6QG08kIKDR-A97Mc-MJbIUNzYs10BAG4z9wk7t1bdo4gZJEvjiXVHM',
            dp: 'Ahggy-I9Um6G3soCafbYsvXGfH09hXH2kYnbx-IqU9qL6e8UuugAyK1Gw_qHOdHP0gO2fkgO-sq_IK96OmhccVJuixIrr9CwjYtGUkJui2Z6GZW1EFEYHJmta6ypcMRJVOzhrynJILgn4nzolGq9C4WvmlUV9zND3eN3MloGxuE',
            dq: 'uXKWlusX2TjVvM0-FO2r8tdkqeNP_7XAA15FIPOI5Cszb6loOIQ0t6wy3puPteSXClBCYJPQ-MeLab4-wUpaTovBOq0FdpK53ruNBZUbMkMIDL6p1CxKnPKufkeh747RtfYYnSk7O4E8PfNV0CWdxHuE6W9ukNvEAIpGb5tjL3M',
            qi: '3BLQ03cHEmO8nUT7U8M_H_JciEWAH8XWh_9nihIhXzLKYbNmWM16Ah0F9DUg0GPeiG7e_08ZJ4X3oK1bHnnXdns6NSOEoULWfHl5LUY5PoFPYaBDy3f6td2SCTE83p1YzegXKysWEk1snA2ROq4UEfz1vL8v64RtwR3SvNrAyOI',
            kty: 'RSA',
            alg: 'RS256',
            kid: 'hJU8GvYjtifxLVuBDSNmhLBF19wQHaZvQhfpT3wKzpE',
        };

        // the publicJWK is just a subset of the private JWK
        const { d, p, q, dp, dq, qi, ...publicJWK } = privateJWK;

        let privateKey: KeyLike | Uint8Array;

        let exchangedToken: string;

        beforeAll(async () => {
            authClient = new AuthClient(
                axios.create({
                    baseURL: 'http://localhost:4000',
                    timeout: 1000,
                })
            );

            privateKey = await importJWK(privateJWK);

            exchangedToken = await new SignJWT({
                sub: '1',
                cid: 1,
                prm: ['a', 'b', 'c'],
            })
                .setProtectedHeader({
                    alg: privateJWK.alg,
                    kid: privateJWK.kid,
                })
                .setExpirationTime('10m')
                .sign(privateKey);

            // mock the endpoints
            nock('http://localhost:4000')
                .persist()
                .post('/api/v1/exchange-service-auth')
                .reply(200, {
                    token: exchangedToken,
                });

            nock('http://localhost:4000')
                .persist()
                .post('/api/v1/exchange-browser-auth')
                .reply(200, {
                    token: exchangedToken,
                    refreshToken: 'foobar',
                });

            nock('http://localhost:4000')
                .persist()
                .get('/api/v1/jwks')
                .reply(200, {
                    keys: [publicJWK],
                });
        });

        it('should throw if JWT malformed', async () => {
            // we need to tell expect that 1 assertion should be performed,
            // otherwise we may pass this test even if no error is thrown.
            expect.assertions(1);

            try {
                await authClient.verify({
                    type: 'ServiceAuth',
                    token: 'some gobbly gook',
                });
            } catch (e) {
                expect(e).toMatchSnapshot();
            }
        });

        it('should throw if JWT missing required claims', async () => {
            // we need to tell expect that 1 assertion should be performed,
            // otherwise we may pass this test even if no error is thrown.
            expect.assertions(1);

            try {
                const jwt = await new SignJWT({
                    sub: '1',
                    cid: 1,
                    // prm: ['a', 'b', 'c'],
                })
                    .setProtectedHeader({
                        alg: privateJWK.alg,
                        kid: privateJWK.kid,
                    })
                    .setExpirationTime('10m')
                    .sign(privateKey);

                await authClient.verify({
                    type: 'ServiceAuth',
                    token: jwt,
                });
            } catch (e) {
                expect(e).toMatchSnapshot();
            }
        });

        it('should throw if ServiceAuth and JWT is expired', async () => {
            // we need to tell expect that 1 assertion should be performed,
            // otherwise we may pass this test even if no error is thrown.
            expect.assertions(1);

            try {
                const now = Math.floor(Date.now() / 1000);
                const alreadyExpiredTime = now - 100;

                const jwt = await new SignJWT({
                    sub: '1',
                    cid: 1,
                    prm: ['a', 'b', 'c'],
                })
                    .setProtectedHeader({
                        alg: privateJWK.alg,
                        kid: privateJWK.kid,
                    })
                    .setExpirationTime(alreadyExpiredTime)
                    .sign(privateKey);

                await authClient.verify({
                    type: 'ServiceAuth',
                    token: jwt,
                });
            } catch (e) {
                expect(e).toMatchSnapshot();
            }
        });

        it('should fetch a new token if ServiceAuth and JWT about to expire', async () => {
            const now = Math.floor(Date.now() / 1000);
            const aboutToExpireTime = now + 10;

            const jwt = await new SignJWT({
                sub: '1',
                cid: 1,
                prm: ['a', 'b', 'c'],
            })
                .setProtectedHeader({
                    alg: privateJWK.alg,
                    kid: privateJWK.kid,
                })
                .setExpirationTime(aboutToExpireTime)
                .sign(privateKey);

            const authContext = await authClient.verify({
                type: 'ServiceAuth',
                token: jwt,
            });

            expect(authContext.getType()).toBe('ServiceAuth');
            expect(authContext.getUserId()).toBe('1');
            expect(authContext.getClientId()).toBe(1);
            expect(authContext.getToken()).toBe(exchangedToken);
            expect(authContext.getTokenExpiration()).toBeInstanceOf(Date);
            expect(authContext.getRefreshToken()).toBe(undefined);
            expect(authContext.getPermissions()).toStrictEqual(['a', 'b', 'c']);
        });

        it('should fetch a new token if BrowserAuth and JWT expired', async () => {
            const now = Math.floor(Date.now() / 1000);
            const alreadyExpiredTime = now - 100;

            const jwt = await new SignJWT({
                sub: '1',
                cid: 1,
                prm: ['a', 'b', 'c'],
            })
                .setProtectedHeader({
                    alg: privateJWK.alg,
                    kid: privateJWK.kid,
                })
                .setExpirationTime(alreadyExpiredTime)
                .sign(privateKey);

            const authContext = await authClient.verify({
                type: 'BrowserAuth',
                token: jwt,
                refreshToken: 'original',
            });

            expect(authContext.getType()).toBe('BrowserAuth');
            expect(authContext.getUserId()).toBe('1');
            expect(authContext.getClientId()).toBe(1);
            expect(authContext.getToken()).toBe(exchangedToken);
            expect(authContext.getTokenExpiration()).toBeInstanceOf(Date);
            expect(authContext.getRefreshToken()).toBe('foobar');
            expect(authContext.getPermissions()).toStrictEqual(['a', 'b', 'c']);
        });

        it('should verify a good token without exchanging', async () => {
            const now = Math.floor(Date.now() / 1000);
            const alreadyExpiredTime = now + 600;

            const originalToken = await new SignJWT({
                sub: '1',
                cid: 1,
                prm: ['a', 'b', 'c'],
            })
                .setProtectedHeader({
                    alg: privateJWK.alg,
                    kid: privateJWK.kid,
                })
                .setExpirationTime(alreadyExpiredTime)
                .sign(privateKey);

            const authContext = await authClient.verify({
                type: 'BrowserAuth',
                token: originalToken,
                refreshToken: 'original',
            });

            expect(authContext.getType()).toBe('BrowserAuth');
            expect(authContext.getUserId()).toBe('1');
            expect(authContext.getClientId()).toBe(1);
            expect(authContext.getToken()).toBe(originalToken);
            expect(authContext.getTokenExpiration()).toBeInstanceOf(Date);
            expect(authContext.getRefreshToken()).toBe('original');
            expect(authContext.getPermissions()).toStrictEqual(['a', 'b', 'c']);
        });
    });
});
