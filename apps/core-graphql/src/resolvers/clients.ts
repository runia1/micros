import { Client } from '../../generated/nexus-prisma';
import { objectType, queryField } from 'nexus';
import authn from '../authorizeMiddlware/authn';
import authr from '../authorizeMiddlware/authr';
import { Permissions } from '../permissions';

const resolvers = [
    // ##################### OBJECT TYPES ##########################
    objectType({
        name: Client.$name,
        description: Client.$description,
        definition(t) {
            t.field(Client.id);
            t.field(Client.active);
            t.field(Client.createdAt);
            t.field(Client.updatedAt);
            t.field(Client.name);
        },
    }),

    // ################## QUERIES ###################################

    queryField('getMyClient', {
        type: Client.$name,
        description: 'get the client record belonging to viewer',
        authorize: (root, args, context) =>
            authn(context) && authr(context, Permissions.rOwnClients),
        resolve(_, __, { prisma, authContext }) {
            return prisma.client.findUnique({
                where: {
                    id: authContext.getClientId(),
                },
            });
        },
    }),
];

export default resolvers;
