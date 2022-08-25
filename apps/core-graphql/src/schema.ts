import {
    DateTimeResolver,
    EmailAddressResolver,
    PhoneNumberResolver,
} from 'graphql-scalars';
import { asNexusMethod, makeSchema, fieldAuthorizePlugin } from 'nexus';
import { validatePlugin } from 'nexus-validate';
import resolvers from './resolvers';
import path from 'path';
import { Json } from 'nexus-prisma/scalars';

// this is kinda hacky but we can't always trust __dirname because of the many ways
// this project gets transformed
const monorepoName = 'micros';
const monorepoRoot = __dirname.substring(
    0,
    __dirname.indexOf(monorepoName) + monorepoName.length
);

const schema = makeSchema({
    shouldExitAfterGenerateArtifacts: process.argv.includes('--nexus-exit'),
    types: [
        asNexusMethod(DateTimeResolver, 'dateTime'),
        asNexusMethod(EmailAddressResolver, 'emailAddress'),
        asNexusMethod(PhoneNumberResolver, 'phoneNumber'),
        Json,
        ...resolvers,
    ],
    outputs: {
        typegen: path.join(
            monorepoRoot,
            'apps/core-graphql/generated/nexus-typegen.ts'
        ),
        // throw the actual SDL in the top level generated dir, so
        // we can codegen frontend apollo client hooks
        schema: path.join(
            monorepoRoot,
            'apps/core-graphql/generated/schema.graphql'
        ),
    },
    plugins: [
        // this plugin adds the `authorize` option on field definitions
        // https://nexusjs.org/docs/plugins/field-authorize
        fieldAuthorizePlugin(),
        // this plugin adds the `validate` option on field definitions
        // https://www.npmjs.com/package/nexus-validate
        validatePlugin(),
    ],
    // Typing for the GraphQL context
    contextType: {
        module: path.join(monorepoRoot, 'apps/core-graphql/src/context.ts'),
        export: 'ApolloServerContext',
    },
});

export default schema;
