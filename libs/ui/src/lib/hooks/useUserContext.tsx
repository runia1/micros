import {
    useState,
    useEffect,
    createContext,
    useContext,
    ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import isEqual from 'lodash/isEqual';

export type User = Viewer | null;

const Context = createContext<User>(null);

export const UserContextProvider = (props: {
    children: ReactNode | undefined;
}) => {
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        // listen for the token cookie to be updated..
        const cookieChangeListener = () => {
            const token = Cookies.get('gqlApiToken');
            const newUser = decodeJWTPayload(token);

            if (!isEqual(user, newUser)) {
                setUser(newUser);
            }
        };

        // call it right off the bat
        cookieChangeListener();

        // call it every second thereafter
        const intervalId = setInterval(cookieChangeListener, 1000);

        // return a function to remove the event listener on unmount
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    });

    return <Context.Provider value={user}>{props.children}</Context.Provider>;
};

export type Viewer = {
    id: number;
    permissions: string[];
    clientId: number;
};

function decodeJWTPayload(jwt: string | undefined): User {
    if (jwt === undefined) {
        return null;
    }

    const payloadPart = jwt.split('.')[1];
    const payload = JSON.parse(atob(payloadPart));
    return {
        id: payload.sub,
        permissions: payload.prm,
        clientId: payload.cid,
    };
}

export function useUserContext(): User {
    return useContext(Context);
}
