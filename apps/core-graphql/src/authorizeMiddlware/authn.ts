import type { ApolloServerContext } from '../context';

export default function authn({ authContext }: ApolloServerContext) {
    return authContext !== undefined;
}
