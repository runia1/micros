import type { ApolloServerContext } from '../context';
import type { Permission } from '../permissions';

export default function authr(
    { authContext }: ApolloServerContext,
    requiredPermissions: Permission | Array<Permission>
) {
    return authContext.hasNecessaryPermissions(requiredPermissions);
}
