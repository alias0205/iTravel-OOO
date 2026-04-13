import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, FlatList, Pressable, ScrollView, Text, View } from 'react-native';

import { getApprovalDurationBreakdown } from '../../approval/utils/approvalDurationUtils';
import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { fetchOutOfOfficeRequestCounts, fetchOutOfOfficeRequests } from '../utils/outOfOfficeApi';
import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { ConsultantRequestListScreenStyles as styles } from '../../../styles';
import { RequestCard } from '../../../shared/components/dashboard/RequestCard';
import { usePaginatedCollection } from '../../../shared/hooks/usePaginatedCollection';

const requestTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Reject' },
];

function getCompactDurationBreakdown(request) {
    const durationBreakdown = getApprovalDurationBreakdown(request);

    if (!durationBreakdown) {
        return request.detail;
    }

    return `${durationBreakdown.totalDays}/${durationBreakdown.weekendDays}/${durationBreakdown.bankHolidayDays}`;
}

export function ConsultantRequestListScreen({ navigation }) {
    const { session, signOut } = useAuthSession();
    const [activeTab, setActiveTab] = useState('all');
    const handleUnauthorized = useCallback(async () => {
        await signOut();
        navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
    }, [navigation, signOut]);

    const loadCounts = useCallback(() => fetchOutOfOfficeRequestCounts({ token: session?.token }), [session?.token]);

    const loadPage = useCallback(
        ({ page, activeTab: nextTab }) =>
            fetchOutOfOfficeRequests({
                page,
                perPage: 15,
                status: nextTab === 'all' ? undefined : nextTab,
                token: session?.token,
            }),
        [session?.token]
    );

    const { isLoading, isLoadingMore, items: requests, loadError, loadMore, pagination, refresh, tabCounts } = usePaginatedCollection({
        activeTab,
        initialCounts: { all: 0, pending: 0, approved: 0, rejected: 0 },
        loadCounts,
        loadPage,
        onUnauthorized: handleUnauthorized,
    });

    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );

    const handleLoadMore = useCallback(() => {
        void (async () => {
            const result = await loadMore();

            if (!result.ok && result.reason === 'error') {
                Alert.alert('Load More Failed', result.message || 'Unable to load more requests.');
            }
        })();
    }, [loadMore]);

    const renderRequestItem = useCallback(
        ({ item }) => (
            <RequestCard
                dateRange={item.dateRange}
                detail={getCompactDurationBreakdown(item)}
                duration={item.duration}
                icon={item.icon}
                iconColor={item.iconColor}
                meta={item.meta}
                onPress={() => navigation.navigate('ConsultantRequestDetail', { request: item })}
                statusLabel={item.statusLabel}
                statusTone={item.statusTone}
                title={item.title}
            />
        ),
        [navigation]
    );

    const keyExtractor = useCallback((item) => item.id, []);
    const showLoadMoreButton = !isLoading && !loadError && pagination.currentPage < pagination.lastPage;
    const listEmptyComponent = useMemo(
        () => <Text style={isLoading ? styles.infoState : styles.emptyState}>{isLoading ? 'Loading requests...' : 'No requests in this category.'}</Text>,
        [isLoading]
    );

    const listFooter = useMemo(
        () =>
            showLoadMoreButton ? (
                <Pressable disabled={isLoadingMore} onPress={handleLoadMore} style={[styles.loadMoreButton, isLoadingMore ? styles.loadMoreButtonDisabled : null]}>
                    <Text style={styles.loadMoreButtonText}>{isLoadingMore ? 'Loading...' : 'Load More'}</Text>
                </Pressable>
            ) : null,
        [handleLoadMore, isLoadingMore, showLoadMoreButton]
    );

    return (
        <ConsultantScreenLayout
            activeNavKey="requests"
            headerSubtitle="Track every leave submission and status change"
            headerTitle="All Requests"
            navigation={navigation}
            notificationCount={3}
            showBackButton
            useScrollView={false}
        >
            <ScrollView contentContainerStyle={styles.tabRow} horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
                {requestTabs.map((tab) => (
                    <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)} style={[styles.tabItem, activeTab === tab.key ? styles.tabItemActive : null]}>
                        <Text style={[styles.tabLabel, activeTab === tab.key ? styles.tabLabelActive : null]}>{tab.label}</Text>
                        <View style={[styles.tabCountBadge, activeTab === tab.key ? styles.tabCountBadgeActive : null]}>
                            <Text style={[styles.tabCountText, activeTab === tab.key ? styles.tabCountTextActive : null]}>{tabCounts[tab.key]}</Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>

            {loadError && !isLoading ? (
                <View style={[styles.pagePadding, styles.retryWrap]}>
                    <Text style={styles.errorState}>{loadError}</Text>
                    <Pressable onPress={refresh} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </Pressable>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={[styles.pagePadding, styles.scrollContent]}
                    data={requests}
                    initialNumToRender={8}
                    keyExtractor={keyExtractor}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={listEmptyComponent}
                    ListFooterComponent={listFooter}
                    maxToRenderPerBatch={8}
                    removeClippedSubviews
                    renderItem={renderRequestItem}
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    windowSize={7}
                />
            )}
        </ConsultantScreenLayout>
    );
}
