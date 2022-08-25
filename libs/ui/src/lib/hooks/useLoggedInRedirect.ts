import { useUserContext } from './useUserContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useLoggedInRedirect() {
    const user = useUserContext();
    const router = useRouter();
    useEffect(() => {
        if (user) {
            // if the user lands on this page but they're already logged in... forward to dashboard
            router.replace('/dashboard');
        }
    }, [user, router]);
}
