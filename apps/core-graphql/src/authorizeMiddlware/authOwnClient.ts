import type { ApolloServerContext } from '../context';

export default function authOwnClient(
    { authContext }: ApolloServerContext,
    { clientId }: { clientId: number }
) {
    // we just need to validate that the operation can be performed on the viewer's own client..
    // this means by convention the query or mutation must have "clientId" in the args.
    if (authContext.getClientId() === clientId) {
        return true;
    }

    return false;
}
