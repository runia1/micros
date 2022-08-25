import { useMemo } from 'react';
import { hasNecessaryPermissions } from '@micros/auth-core';
import { useUserContext } from './useUserContext';

function useAuthr(requiredPermissions: string): boolean;
function useAuthr(requiredPermissions: string[]): boolean[];
function useAuthr(requiredPermissions: string | string[]) {
    const user = useUserContext();

    // by wrapping this in userMemo, and specifying user as the only dependency,
    // we can make sure we're not re-calculating these on every render
    return useMemo(() => {
        if (user === null) {
            if (Array.isArray(requiredPermissions)) {
                return Array(requiredPermissions.length).fill(false);
            } else {
                return false;
            }
        }

        if (Array.isArray(requiredPermissions)) {
            return requiredPermissions.map((reqPerms) =>
                hasNecessaryPermissions(reqPerms, user.permissions)
            );
        }
        return hasNecessaryPermissions(requiredPermissions, user.permissions);
    }, [user, requiredPermissions]);
}

export default useAuthr;
