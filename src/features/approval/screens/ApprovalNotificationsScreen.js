import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { useApprovalNotifications } from '../context/ApprovalNotificationsContext';
import { fetchApprovalNotifications } from '../utils/approvalNotificationsApi';
import { fetchApprovalRequestById } from '../utils/approvalRequestsApi';
import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { usePaginatedCollection } from '../../../shared/hooks/usePaginatedCollection';
import { ApprovalNotificationsScreenStyles as styles } from '../../../styles';

const notificationTabs = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
];

const PAGE_SIZE = 15;

function getNotificationAppearance(notification) {
    if (notification.category === 'requests') {
        return {
            accent: '#F97316',
            actionLabel: notification.actionLabel || 'Review',
            icon: 'clipboard-text-clock-outline',
            iconBackground: '#F6E6D2',
            iconColor: '#EA580C',
        };
    }

    return {
        accent: notification.unread ? '#3B82F6' : '#D1D5DB',
        actionLabel: notification.actionLabel || 'View',
        icon: notification.unread ? 'bell-ring-outline' : 'information-outline',
        iconBackground: notification.unread ? '#DCE8FA' : '#ECEEF2',
        iconColor: notification.unread ? '#2563EB' : '#4B5563',
    };
}

const ApprovalNotificationCard = memo(function ApprovalNotificationCard({ item, onActionPress }) {
    const appearance = getNotificationAppearance(item);

    return (
        <View style={[styles.notificationCard, { borderLeftColor: appearance.accent }]}>
            <View style={styles.notificationRow}>
                <View style={[styles.notificationIconWrap, { backgroundColor: appearance.iconBackground }]}>
                    <MaterialCommunityIcons color={appearance.iconColor} name={appearance.icon} size={18} />
                </View>

                <View style={styles.notificationCopy}>
                    <View style={styles.notificationTitleRow}>
                        <Text style={styles.notificationTitle}>{item.title}</Text>
                        {item.unread ? <View style={[styles.notificationDot, { backgroundColor: appearance.accent }]} /> : null}
                    </View>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                    <View style={styles.notificationFooterRow}>
                        <Text style={styles.notificationTime}>{item.time}</Text>
                        <Pressable onPress={() => onActionPress(item)}>
                            <Text style={styles.notificationAction}>{appearance.actionLabel}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}, areApprovalNotificationCardPropsEqual);

function areApprovalNotificationCardPropsEqual(previousProps, nextProps) {
    const previousItem = previousProps.item;
    const nextItem = nextProps.item;

    return (
        previousItem?.id === nextItem?.id &&
        previousItem?.title === nextItem?.title &&
        previousItem?.message === nextItem?.message &&
        previousItem?.time === nextItem?.time &&
        previousItem?.unread === nextItem?.unread &&
        previousItem?.category === nextItem?.category &&
        previousItem?.type === nextItem?.type &&
        previousItem?.actionLabel === nextItem?.actionLabel &&
        previousItem?.holidayId === nextItem?.holidayId
    );
}

export function ApprovalNotificationsScreen({ navigation }) {
    const { session, signOut } = useAuthSession();
    const {
        clearAll,
        isRefreshing: isBadgeRefreshing,
        markAllRead,
        markAsRead,
        refresh: refreshUnreadCount,
        realtimeRefreshKey,
        unreadCount,
    } = useApprovalNotifications();
    const [activeTab, setActiveTab] = useState('all');
    const previousUnreadCountRef = useRef(unreadCount);
    const previousRealtimeRefreshKeyRef = useRef(realtimeRefreshKey);

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

    useEffect(() => {
        if (previousRealtimeRefreshKeyRef.current === realtimeRefreshKey) {
            return;
        }

        previousRealtimeRefreshKeyRef.current = realtimeRefreshKey;

        if (session?.token) {
            refresh();
        }
    }, [realtimeRefreshKey, refresh, session?.token]);

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

                    const request = await fetchApprovalRequestById({
                        holidayId: item.holidayId,
                        token: session?.token,
                    });

                    navigation.navigate('ApprovalRequestReview', { request });
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
        [markAsRead, navigation, session?.token, signOut]
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

    const handleClearAll = useCallback(() => {
        const totalNotifications = Number(tabCounts.all || notifications.length || 0);

        if (totalNotifications <= 0) {
            return;
        }

        Alert.alert('Clear all notifications?', 'This will permanently remove all notifications from your list.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Clear all',
                style: 'destructive',
                onPress: () => {
                    void (async () => {
                        try {
                            await clearAll();
                            setNotifications([]);
                            refresh();
                        } catch (error) {
                            const message = error instanceof Error ? error.message : 'Unable to clear notifications right now.';

                            if (error?.status === 401) {
                                await signOut();
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Splash' }],
                                });
                                return;
                            }

                            Alert.alert('Action Failed', message);
                        }
                    })();
                },
            },
        ]);
    }, [clearAll, navigation, notifications.length, refresh, setNotifications, signOut, tabCounts.all]);

    const handleLoadMore = useCallback(() => {
        void (async () => {
            const result = await loadMore();

            if (!result.ok && result.reason === 'error') {
                Alert.alert('Load More Failed', result.message || 'Unable to load more notifications right now.');
            }
        })();
    }, [loadMore]);

    const renderNotificationItem = useCallback(({ item }) => <ApprovalNotificationCard item={item} onActionPress={handleActionPress} />, [handleActionPress]);

    const listEmptyState = isLoading || isBadgeRefreshing ? 'Loading notifications...' : loadError || 'No notifications in this category.';
    const showLoadMoreButton = pagination.currentPage < pagination.lastPage && notifications.length > 0;

    const listHeader = useMemo(
        () => (
            <View style={styles.subHeaderRow}>
                <Text style={styles.subHeaderText}>{unreadCount} unread notifications</Text>
                <Pressable onPress={handleClearAll}>
                    <Text style={styles.clearAllText}>Clear all</Text>
                </Pressable>
            </View>
        ),
        [handleClearAll, unreadCount]
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

    const keyExtractor = useCallback((item) => item.id, []);

    return (
        <ApprovalScreenLayout
            activeNavKey="notifications"
            headerRight={
                <Pressable onPress={handleMarkAllRead}>
                    <Text style={styles.headerAction}>Mark all read</Text>
                </Pressable>
            }
            headerSubtitle="Activity & Updates"
            headerTitle="Notifications"
            navigation={navigation}
            showBackButton
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
                        <View style={[styles.tabCountBadge, activeTab === tab.key ? styles.tabCountBadgeActive : null]}>
                            <Text style={[styles.tabCountText, activeTab === tab.key ? styles.tabCountTextActive : null]}>{tabCounts[tab.key]}</Text>
                        </View>
                    </Pressable>
                ))}
            </View>

            <FlatList
                contentContainerStyle={[styles.pagePadding, styles.scrollContent]}
                data={notifications}
                initialNumToRender={8}
                keyboardShouldPersistTaps="handled"
                keyExtractor={keyExtractor}
                ListEmptyComponent={listEmptyComponent}
                ListFooterComponent={listFooter}
                ListHeaderComponent={listHeader}
                maxToRenderPerBatch={8}
                renderItem={renderNotificationItem}
                removeClippedSubviews
                showsVerticalScrollIndicator={false}
                style={styles.list}
                updateCellsBatchingPeriod={50}
                windowSize={7}
            />
        </ApprovalScreenLayout>
    );
}
