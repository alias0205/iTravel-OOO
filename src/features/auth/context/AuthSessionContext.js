import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { clearAuthSession, getAuthProfile, getAuthSession, saveAuthSession } from '../utils/authSession';

const AuthSessionContext = createContext(null);

export function AuthSessionProvider({ children }) {
    const [session, setSession] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isMounted = true;

        void (async () => {
            const storedSession = await getAuthSession();

            if (!isMounted) {
                return;
            }

            setSession(storedSession);
            setIsReady(true);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    const signIn = async (nextSession) => {
        await saveAuthSession(nextSession);
        setSession(nextSession);
    };

    const signOut = async () => {
        await clearAuthSession();
        setSession(null);
    };

    const refreshSession = async () => {
        const storedSession = await getAuthSession();
        setSession(storedSession);
        setIsReady(true);
        return storedSession;
    };

    const value = useMemo(
        () => ({
            authProfile: getAuthProfile(session?.user),
            isAuthenticated: Boolean(session?.user),
            isReady,
            refreshSession,
            session,
            signIn,
            signOut,
            user: session?.user ?? null,
        }),
        [isReady, session]
    );

    return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
    const contextValue = useContext(AuthSessionContext);

    if (!contextValue) {
        throw new Error('useAuthSession must be used within an AuthSessionProvider.');
    }

    return contextValue;
}
