export enum Permissions {
    crudAll = 'crudAll',

    rOwnUsers = 'rOwnUsers',
    rAllUsers = 'rAllUsers',
    cudAllUsers = 'cudAllUsers',

    rOwnClients = 'rOwnClients',
    rAllClients = 'rAllClients',
    cudAllClients = 'cudAllClients',

    rOwnRoles = 'rOwnRoles',
    rAllRoles = 'rAllRoles',
    cudAllRoles = 'cudAllRoles',
}

export type Permission = keyof typeof Permissions;
