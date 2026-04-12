import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

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

    const requestCards = useMemo(
        () =>
            requests.map((request) => (
                <RequestCard
                    key={request.id}
                    dateRange={request.dateRange}
                    detail={getCompactDurationBreakdown(request)}
                    duration={request.duration}
                    icon={request.icon}
                    iconColor={request.iconColor}
                    meta={request.meta}
                    onPress={() => navigation.navigate('ConsultantRequestDetail', { request })}
                    statusLabel={request.statusLabel}
                    statusTone={request.statusTone}
                    title={request.title}
                />
            )),
        [navigation, requests]
    );

    const handleLoadMore = useCallback(() => {
        void (async () => {
            const result = await loadMore();

            if (!result.ok && result.reason === 'error') {
                Alert.alert('Load More Failed', result.message || 'Unable to load more requests.');
            }
        })();
    }, [loadMore]);

    return (
        <ConsultantScreenLayout
            activeNavKey="requests"
            headerSubtitle="Track every leave submission and status change"
            headerTitle="All Requests"
            navigation={navigation}
            notificationCount={3}
            scrollContentStyle={styles.scrollContent}
            showBackButton
        >
            <ScrollView contentContainerStyle={styles.tabRow} horizontal showsHorizontalScrollIndicator={false}>
                {requestTabs.map((tab) => (
                    <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)} style={[styles.tabItem, activeTab === tab.key ? styles.tabItemActive : null]}>
                        <Text style={[styles.tabLabel, activeTab === tab.key ? styles.tabLabelActive : null]}>{tab.label}</Text>
                        <View style={[styles.tabCountBadge, activeTab === tab.key ? styles.tabCountBadgeActive : null]}>
                            <Text style={[styles.tabCountText, activeTab === tab.key ? styles.tabCountTextActive : null]}>{tabCounts[tab.key]}</Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>

            <View style={styles.pagePadding}>
                {isLoading ? <Text style={styles.infoState}>Loading requests...</Text> : null}
                {!isLoading && loadError ? (
                    <View style={styles.retryWrap}>
                        <Text style={styles.errorState}>{loadError}</Text>
                        <Pressable onPress={refresh} style={styles.retryButton}>
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </Pressable>
                    </View>
                ) : null}

                {!isLoading && !loadError ? requestCards : null}
                {!isLoading && !loadError && requests.length === 0 ? <Text style={styles.emptyState}>No requests in this category.</Text> : null}
                {!isLoading && !loadError && pagination.currentPage < pagination.lastPage ? (
                    <Pressable onPress={handleLoadMore} style={[styles.loadMoreButton, isLoadingMore ? styles.loadMoreButtonDisabled : null]}>
                        <Text style={styles.loadMoreButtonText}>{isLoadingMore ? 'Loading...' : 'Load More'}</Text>
                    </Pressable>
                ) : null}
            </View>
        </ConsultantScreenLayout>
    );
}
