import { AppState } from 'react-native';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Pusher } from 'pusher-js/react-native';

import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { API_BASE_URL, resolveDevelopmentHostname } from '../../../app/config/env';
import {
    clearAllApprovalNotifications,
    fetchApprovalNotifications,
    markAllApprovalNotificationsAsRead,
    markApprovalNotificationAsRead,
} from '../../approval/utils/approvalNotificationsApi';

const ConsultantNotificationsContext = createContext(null);
const REALTIME_EVENT_NAME = 'database-notifications.sent';
const DEFAULT_REVERB_APP_KEY = process.env.EXPO_PUBLIC_REVERB_APP_KEY || 'omanager-local-key';
const DEFAULT_PUSHER_CLUSTER = process.env.EXPO_PUBLIC_PUSHER_CLUSTER || 'mt1';

function getConfiguredRealtimeScheme(fallbackProtocol) {
    const configuredScheme = process.env.EXPO_PUBLIC_REVERB_SCHEME?.trim()?.toLowerCase();

    if (configuredScheme === 'http' || configuredScheme === 'ws') {
        return 'ws';
    }

    if (configuredScheme === 'https' || configuredScheme === 'wss') {
        return 'wss';
    }

    return fallbackProtocol === 'https:' ? 'wss' : 'ws';
}

function getRealtimeConfig() {
    try {
        const apiUrl = new URL(API_BASE_URL);
        const realtimeScheme = getConfiguredRealtimeScheme(apiUrl.protocol);
        const isSecure = realtimeScheme === 'wss';
        const defaultPort = Number(isSecure ? 443 : 8080);

        return {
            appKey: DEFAULT_REVERB_APP_KEY,
            authEndpoint: `${API_BASE_URL}/api/broadcasting/auth`,
            cluster: DEFAULT_PUSHER_CLUSTER,
            forceTLS: isSecure,
            scheme: realtimeScheme,
            wsHost: resolveDevelopmentHostname(process.env.EXPO_PUBLIC_REVERB_HOST || apiUrl.hostname),
            wsPort: Number(process.env.EXPO_PUBLIC_REVERB_PORT || defaultPort),
            wssPort: Number(process.env.EXPO_PUBLIC_REVERB_PORT || (isSecure ? 443 : defaultPort)),
        };
    } catch {
        return {
            appKey: DEFAULT_REVERB_APP_KEY,
            authEndpoint: `${API_BASE_URL}/api/broadcasting/auth`,
            cluster: DEFAULT_PUSHER_CLUSTER,
            forceTLS: getConfiguredRealtimeScheme('http:') === 'wss',
            scheme: getConfiguredRealtimeScheme('http:'),
            wsHost: resolveDevelopmentHostname(process.env.EXPO_PUBLIC_REVERB_HOST || '127.0.0.1'),
            wsPort: Number(process.env.EXPO_PUBLIC_REVERB_PORT || 8080),
            wssPort: Number(process.env.EXPO_PUBLIC_REVERB_PORT || 8080),
        };
    }
}

export function ConsultantNotificationsProvider({ children }) {
    const { authProfile, session, signOut } = useAuthSession();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [realtimeRefreshKey, setRealtimeRefreshKey] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const appStateRef = useRef(AppState.currentState);
    const pusherRef = useRef(null);
    const realtimeChannelRef = useRef(null);
    const isConsultantUser = Boolean(authProfile?.isConsultant && !authProfile?.isApproval);

    const refresh = useCallback(
        async ({ silent = false } = {}) => {
            if (!isConsultantUser || !session?.token) {
                setUnreadCount(0);
                return 0;
            }

            if (!silent) {
                setIsRefreshing(true);
            }

            try {
                const result = await fetchApprovalNotifications({
                    filter: 'all',
                    limit: 1,
                    page: 1,
                    token: session.token,
                });

                setUnreadCount(result.unreadCount);
                return result.unreadCount;
            } catch (error) {
                if (error?.status === 401) {
                    await signOut();
                    return 0;
                }

                throw error;
            } finally {
                if (!silent) {
                    setIsRefreshing(false);
                }
            }
        },
        [isConsultantUser, session?.token, signOut]
    );

    const markAsRead = useCallback(
        async (notificationId) => {
            if (!isConsultantUser || !session?.token) {
                return null;
            }

            const notification = await markApprovalNotificationAsRead({
                notificationId,
                token: session.token,
            });

            setUnreadCount((currentValue) => Math.max(0, currentValue - 1));
            return notification;
        },
        [isConsultantUser, session?.token]
    );

    const markAllRead = useCallback(async () => {
        if (!isConsultantUser || !session?.token) {
            return;
        }

        await markAllApprovalNotificationsAsRead({ token: session.token });
        setUnreadCount(0);
    }, [isConsultantUser, session?.token]);

    const clearAll = useCallback(async () => {
        if (!isConsultantUser || !session?.token) {
            return { deletedCount: 0 };
        }

        const result = await clearAllApprovalNotifications({ token: session.token });
        setUnreadCount(0);

        return result;
    }, [isConsultantUser, session?.token]);

    useEffect(() => {
        if (!isConsultantUser || !session?.token) {
            setUnreadCount(0);
            setIsRefreshing(false);
            return;
        }

        void refresh();
    }, [isConsultantUser, refresh, session?.token]);

    useEffect(() => {
        if (!isConsultantUser || !session?.token) {
            return undefined;
        }

        const subscription = AppState.addEventListener('change', (nextAppState) => {
            const previousState = appStateRef.current;
            appStateRef.current = nextAppState;

            if (previousState !== 'active' && nextAppState === 'active') {
                void refresh({ silent: true });
            }
        });

        return () => {
            subscription.remove();
        };
    }, [isConsultantUser, refresh, session?.token]);

    useEffect(() => {
        if (!isConsultantUser || !session?.token || !session?.user?.id) {
            return undefined;
        }

        const realtimeConfig = getRealtimeConfig();
        const pusher = new Pusher(realtimeConfig.appKey, {
            channelAuthorization: {
                endpoint: realtimeConfig.authEndpoint,
                headersProvider: () => ({
                    Accept: 'application/json',
                    Authorization: `Bearer ${session.token}`,
                }),
                transport: 'ajax',
            },
            cluster: realtimeConfig.cluster,
            forceTLS: realtimeConfig.forceTLS,
            enabledTransports: ['ws', 'wss'],
            wsHost: realtimeConfig.wsHost,
            wsPort: realtimeConfig.wsPort,
            wssPort: realtimeConfig.wssPort,
        });

        const channelName = `private-App.Models.Auth.User.${session.user.id}`;
        const channel = pusher.subscribe(channelName);
        const handleRealtimeNotification = () => {
            setRealtimeRefreshKey((currentValue) => currentValue + 1);
            void refresh({ silent: true });
        };
        const handleConnected = () => {
            void refresh({ silent: true });
        };

        channel.bind(REALTIME_EVENT_NAME, handleRealtimeNotification);
        pusher.connection.bind('connected', handleConnected);

        pusherRef.current = pusher;
        realtimeChannelRef.current = channel;

        return () => {
            realtimeChannelRef.current?.unbind(REALTIME_EVENT_NAME, handleRealtimeNotification);
            pusherRef.current?.connection?.unbind('connected', handleConnected);

            pusherRef.current?.unsubscribe(channelName);
            pusherRef.current?.disconnect();
            realtimeChannelRef.current = null;
            pusherRef.current = null;
        };
    }, [isConsultantUser, refresh, session?.token, session?.user?.id]);

    const value = useMemo(
        () => ({
            clearAll,
            isRefreshing,
            markAllRead,
            markAsRead,
            refresh,
            realtimeRefreshKey,
            unreadCount,
        }),
        [clearAll, isRefreshing, markAllRead, markAsRead, refresh, realtimeRefreshKey, unreadCount]
    );

    return <ConsultantNotificationsContext.Provider value={value}>{children}</ConsultantNotificationsContext.Provider>;
}

export function useConsultantNotifications() {
    const contextValue = useContext(ConsultantNotificationsContext);

    if (!contextValue) {
        throw new Error('useConsultantNotifications must be used within a ConsultantNotificationsProvider.');
    }

    return contextValue;
}