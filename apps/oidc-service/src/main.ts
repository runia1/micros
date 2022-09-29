import { Provider, interactionPolicy } from 'oidc-provider';
import { RedisAdapter } from './redisAdapter';
import 'dotenv/config';

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
            client_name: 'Evans Sketchy LAMP Stack',
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
    jwks: JSON.parse(process.env.JWKS),
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
