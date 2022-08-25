import { ApolloServer } from 'apollo-server';
import schema from './schema';
import context from './context';
import {
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';

const apolloServer = new ApolloServer({
    schema,
    context,
    plugins: [
        ...(process.env.NODE_ENV === 'development'
            ? [
                  ApolloServerPluginLandingPageGraphQLPlayground({
                      settings: {
                          // this makes it so we send the auth cookie when using the playground..
                          'request.credentials': 'include',
                          // try turning this off for now. Will just update the page if I need fresh schema
                          'schema.polling.enable': false,
                      },
                  }),
              ]
            : [ApolloServerPluginLandingPageDisabled()]),
    ],
});

apolloServer.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
