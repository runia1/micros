import { Permission } from './permission';

export function hasNecessaryPermissions(
    requiredPermissions: string | string[],
    grantedPermissions: string[]
): boolean {
    const requiredPermissionsArray = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

    // this has the potential to get costly with the regex and the O(n*m) here,
    // but Array.find() short circuits so should be a little better
    return requiredPermissionsArray.every((requiredPerm) => {
        const reqPerm = new Permission(requiredPerm);

        const found = grantedPermissions.find((grantedPerm) => {
            return new Permission(grantedPerm).isGreaterThanOrEqualTo(reqPerm);
        });

        return found === undefined ? false : true;
    });
}
