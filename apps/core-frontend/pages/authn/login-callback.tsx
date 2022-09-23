import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function OIDCCallback() {
    const router = useRouter();
    useEffect(() => {
        // #error=unsupported_response_type&error_description=unsupported%20response_type%20requested&state=j6wec3yrb3a&iss=http%3A%2F%2Flocalhost%3A3000
        // router.query.
        const oidcResponse = window.location.hash;

        if (oidcResponse.startsWith('#error')) {
            alert(oidcResponse);
        } else if (oidcResponse.startsWith('#id_token')) {
            console.log(oidcResponse);
        }

        // TODO: check for error and if so, display error message, otherwise redirect.

        router.replace('/dashboard');
    }, [router]);
}
