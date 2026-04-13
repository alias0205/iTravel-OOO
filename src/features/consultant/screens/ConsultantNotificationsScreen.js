import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';

import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { useConsultantNotifications } from '../context/ConsultantNotificationsContext';
import { fetchOutOfOfficeRequestById } from '../utils/outOfOfficeApi';
import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { fetchApprovalNotifications } from '../../approval/utils/approvalNotificationsApi';
import { ConsultantNotificationsScreenStyles as styles } from '../../../styles';
import { usePaginatedCollection } from '../../../shared/hooks/usePaginatedCollection';

const notificationTabs = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
];

const PAGE_SIZE = 15;

function getNotificationAppearance(notification) {
    if (notification.type === 'out_of_office_approved') {
        return {
            accent: '#0F766E',
            actionLabel: notification.actionLabel || 'View Request',
            dot: '#0F766E',
            icon: 'check-circle',
            iconBackground: '#E5EFEF',
            iconColor: '#0F766E',
            muted: false,
        };
    }

    if (notification.type === 'out_of_office_rejected') {
        return {
            accent: '#DC2626',
            actionLabel: notification.actionLabel || 'View Request',
            dot: '#DC2626',
            icon: 'close-circle',
            iconBackground: '#F7DADA',
            iconColor: '#DC2626',
            muted: false,
        };
    }

    if (notification.category === 'requests') {
        return {
            accent: '#3B82F6',
            actionLabel: notification.actionLabel || 'View Request',
            dot: '#3B82F6',
            icon: 'send',
            iconBackground: '#D9E6FB',
            iconColor: '#2563EB',
            muted: false,
        };
    }

    return {
        accent: notification.unread ? '#0A6B63' : '#D1D5DB',
        actionLabel: notification.actionLabel || 'View Request',
        dot: notification.unread ? '#0A6B63' : null,
        icon: notification.unread ? 'bell-ring-outline' : 'information',
        iconBackground: notification.unread ? '#D9F1EA' : '#EFEFF1',
        iconColor: notification.unread ? '#0A6B63' : '#6B7280',
        muted: !notification.unread,
    };
}

const NotificationCard = memo(function NotificationCard({ notification, onActionPress }) {
    const appearance = getNotificationAppearance(notification);

    return (
        <View style={[styles.notificationCard, { borderLeftColor: appearance.accent }]}>
            <View style={styles.notificationHeaderRow}>
                <View style={[styles.notificationIconWrap, { backgroundColor: appearance.iconBackground }]}>
                    <MaterialCommunityIcons color={appearance.iconColor} name={appearance.icon} size={20} />
                </View>

                <View style={styles.notificationCopy}>
                    <View style={styles.notificationTitleRow}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        {appearance.dot ? <View style={[styles.notificationDot, { backgroundColor: appearance.dot }]} /> : null}
                    </View>

                    <Text style={styles.notificationMessage}>{notification.message}</Text>

                    {appearance.actionLabel ? (
                        <View style={styles.notificationActionRow}>
                            <Pressable onPress={() => onActionPress(notification)} style={[styles.actionButton, appearance.muted ? styles.actionButtonMuted : styles.actionButtonPrimary]}>
                                <Text style={[styles.actionButtonText, appearance.muted ? styles.actionButtonTextMuted : styles.actionButtonTextPrimary]}>
                                    {appearance.actionLabel}
                                </Text>
                            </Pressable>

                            <Text style={styles.notificationTime}>{notification.time}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </View>
    );
});

export function ConsultantNotificationsScreen({ navigation }) {
    const { session, signOut } = useAuthSession();
    const { isRefreshing: isBadgeRefreshing, markAllRead, markAsRead, refresh: refreshUnreadCount, unreadCount } = useConsultantNotifications();
    const [activeTab, setActiveTab] = useState('all');
    const previousUnreadCountRef = useRef(unreadCount);

    const handleUnauthorized = useCallback(async () => {
        await signOut();
        navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
    }, [navigation, signOut]);

    const loadCounts = useCallback(async () => {
        const result = await fetchApprovalNotifications({
            filter: 'all',
            limit: 1,
            page: 1,
            token: session?.token,
        });

        return {
            all: result.meta.total,
            unread: result.meta.unreadCount,
        };
    }, [session?.token]);

    const loadPage = useCallback(
        ({ activeTab: nextTab, page }) =>
            fetchApprovalNotifications({
                filter: nextTab,
                limit: PAGE_SIZE,
                page,
                token: session?.token,
            }),
        [session?.token]
    );

    const {
        isLoading,
        isLoadingMore,
        items: notifications,
        loadError,
        loadMore,
        pagination,
        refresh,
        setItems: setNotifications,
        tabCounts,
    } = usePaginatedCollection({
        activeTab,
        initialCounts: { all: 0, unread: 0 },
        loadCounts,
        loadPage,
        onUnauthorized: handleUnauthorized,
    });

    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );

    useEffect(() => {
        if (previousUnreadCountRef.current === unreadCount) {
            return;
        }

        previousUnreadCountRef.current = unreadCount;

        if (session?.token) {
            refresh();
        }
    }, [refresh, session?.token, unreadCount]);

    const handleActionPress = useCallback(
        (item) => {
            void (async () => {
                try {
                    if (item.unread) {
                        await markAsRead(item.id);
                        setNotifications((currentValue) =>
                            currentValue.map((notification) =>
                                notification.id === item.id ? { ...notification, unread: false, readAt: new Date().toISOString() } : notification
                            )
                        );
                    }

                    if (!item.holidayId) {
                        return;
                    }

                    const request = await fetchOutOfOfficeRequestById({
                        holidayId: item.holidayId,
                        token: session?.token,
                    });

                    navigation.navigate('ConsultantRequestDetail', { request });
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Unable to open this notification right now.';

                    if (error?.status === 401) {
                        await signOut();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Splash' }],
                        });
                        return;
                    }

                    Alert.alert('Notification Unavailable', message);
                }
            })();
        },
        [markAsRead, navigation, session?.token, setNotifications, signOut]
    );

    const handleMarkAllRead = useCallback(() => {
        void (async () => {
            try {
                await markAllRead();
                setNotifications((currentValue) => currentValue.map((notification) => ({ ...notification, unread: false, readAt: notification.readAt || new Date().toISOString() })));
                void refreshUnreadCount({ silent: true });
                refresh();
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to mark all notifications as read.';
                Alert.alert('Action Failed', message);
            }
        })();
    }, [markAllRead, refresh, refreshUnreadCount, setNotifications]);

    const handleLoadMore = useCallback(() => {
        void (async () => {
            const result = await loadMore();

            if (!result.ok && result.reason === 'error') {
                Alert.alert('Load More Failed', result.message || 'Unable to load more notifications right now.');
            }
        })();
    }, [loadMore]);

    const renderNotificationItem = useCallback(({ item }) => <NotificationCard notification={item} onActionPress={handleActionPress} />, [handleActionPress]);
    const keyExtractor = useCallback((item) => item.id, []);
    const listEmptyState = isLoading || isBadgeRefreshing ? 'Loading notifications...' : loadError || 'No notifications in this category.';
    const showLoadMoreButton = pagination.currentPage < pagination.lastPage && notifications.length > 0;

    const listHeader = useMemo(
        () => (
            <View style={styles.subHeaderRow}>
                <Text style={styles.subHeaderText}>{unreadCount} unread notifications</Text>
                <Pressable onPress={handleMarkAllRead}>
                    <Text style={styles.clearAllText}>Clear all</Text>
                </Pressable>
            </View>
        ),
        [handleMarkAllRead, unreadCount]
    );

    const listFooter = useMemo(
        () =>
            showLoadMoreButton ? (
                <Pressable
                    disabled={isLoadingMore}
                    onPress={handleLoadMore}
                    style={[styles.loadMoreButton, isLoadingMore ? styles.loadMoreButtonDisabled : null]}
                >
                    <Text style={styles.loadMoreButtonText}>{isLoadingMore ? 'Loading...' : 'Load more'}</Text>
                </Pressable>
            ) : null,
        [handleLoadMore, isLoadingMore, showLoadMoreButton]
    );

    const listEmptyComponent = useMemo(() => <Text style={styles.emptyState}>{listEmptyState}</Text>, [listEmptyState]);

    return (
        <ConsultantScreenLayout
            activeNavKey="notifications"
            headerRight={
                <Pressable onPress={handleMarkAllRead}>
                    <Text style={styles.headerAction}>Mark all read</Text>
                </Pressable>
            }
            headerSubtitle="Stay updated with alerts"
            headerTitle="Notifications"
            navigation={navigation}
            showBackButton
            showNotification={false}
            useScrollView={false}
        >
            <View style={styles.tabRow}>
                {notificationTabs.map((tab, index) => (
                    <Pressable
                        key={tab.key}
                        onPress={() => setActiveTab(tab.key)}
                        style={[
                            styles.tabItem,
                            index < notificationTabs.length - 1 ? styles.tabItemSpacing : null,
                            activeTab === tab.key ? styles.tabItemActive : null,
                        ]}
                    >
                        <Text style={[styles.tabLabel, activeTab === tab.key ? styles.tabLabelActive : null]}>{tab.label}</Text>
                        {tabCounts[tab.key] ? (
                            <View style={[styles.tabCountBadge, activeTab === tab.key ? styles.tabCountBadgeActive : null]}>
                                <Text style={[styles.tabCountText, activeTab === tab.key ? styles.tabCountTextActive : null]}>{tabCounts[tab.key]}</Text>
                            </View>
                        ) : null}
                    </Pressable>
                ))}
            </View>

            <FlatList
                contentContainerStyle={[styles.pagePadding, styles.scrollContent]}
                data={notifications}
                extraData={activeTab}
                keyExtractor={keyExtractor}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={listEmptyComponent}
                ListFooterComponent={listFooter}
                ListHeaderComponent={listHeader}
                renderItem={renderNotificationItem}
                removeClippedSubviews
                showsVerticalScrollIndicator={false}
            />
        </ConsultantScreenLayout>
    );
}
