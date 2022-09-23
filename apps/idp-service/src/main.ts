import { Provider, interactionPolicy } from 'oidc-provider';
import { RedisAdapter } from './redisAdapter';

const provider = new Provider('http://localhost:3000', {
    adapter: RedisAdapter,
    // findAccount: () => {
    //     return {
    //         accountId: '90809asd8faf80',
    //         claims: () => {
    //             return {
    //                 sub: '90809asd8faf80',
    //             };
    //         },
    //     };
    // },
    clients: [
        {
            client_id: 'foo',
            application_type: 'web',
            token_endpoint_auth_method: 'none',
            response_types: ['id_token'],
            grant_types: ['implicit'],
            redirect_uris: ['http://localhost:4200/authn/login-callback'],
        },
    ],
    cookies: {
        keys: ['SEKRIT2', 'SEKRIT1'],
    },
    // TODO: pull JWKS from a secret store and inject as ENV var or something?
    jwks: {
        keys: [
            {
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
            },
        ],
    },
    ttl: {
        Session: 10000000000,
        Interaction: 10000000000,
        Grant: 10000000000,
    },
    interactions: {
        policy: interactionPolicy.base(),
    },
    features: {
        // devInteractions: {
        //     enabled: false,
        // },
    },
    // renderError: (ctx, out, error) => {
    //     console.log(error);
    //     // @ts-ignore
    //     console.log(error.error_description);
    // },
    loadExistingGrant: async (ctx) => {
        const grantId =
            (ctx.oidc.result &&
                ctx.oidc.result.consent &&
                ctx.oidc.result.consent.grantId) ||
            ctx.oidc.session.grantIdFor(ctx.oidc.client.clientId);

        if (grantId) {
            // keep grant expiry aligned with session expiry
            // to prevent consent prompt being requested when grant expires
            const grant = await ctx.oidc.provider.Grant.find(grantId);

            // this aligns the Grant ttl with that of the current session
            // if the same Grant is used for multiple sessions, or is set
            // to never expire, you probably do not want this in your code
            if (ctx.oidc.account && grant.exp < ctx.oidc.session.exp) {
                grant.exp = ctx.oidc.session.exp;

                await grant.save();
            }

            return grant;
        }
        // NOTE: for internal apps we skip the Consent interaction.
        // Of course they want to let our internal apps access data
        // on our resource services
        else if (ctx.oidc.client.clientId === 'foo') {
            const grant = new ctx.oidc.provider.Grant({
                clientId: ctx.oidc.client.clientId,
                accountId: ctx.oidc.session.accountId,
            });

            grant.addOIDCScope('openid');
            grant.addResourceScope('urn:micros:all', 'api:read api:write');
            await grant.save();
            return grant;
        }
    },
});

// @ts-expect-error
const { invalidate: orig } = provider.Client.Schema.prototype;
// @ts-expect-error
provider.Client.Schema.prototype.invalidate = function invalidate(
    message,
    code
) {
    if (
        code === 'implicit-force-https' ||
        code === 'implicit-forbid-localhost'
    ) {
        return;
    }

    orig.call(this, message);
};

provider.listen(3000, () => {
    console.log(
        'oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration'
    );
});
