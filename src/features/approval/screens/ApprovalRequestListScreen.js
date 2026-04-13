import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, FlatList, Pressable, ScrollView, Text, View } from 'react-native';

import { ApprovalConfirmDialog } from '../components/ApprovalConfirmDialog';
import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { approveOutOfOfficeRequest, clearApprovalRequestCountsCache, fetchApprovalRequestCounts, fetchApprovalRequests, fetchApprovalRequestsByAdmin } from '../utils/approvalRequestsApi';
import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { ApprovalRequestListScreenStyles as styles } from '../../../styles';
import { ApprovalRequestCard } from '../../../shared/components/dashboard/ApprovalRequestCard';
import { usePaginatedCollection } from '../../../shared/hooks/usePaginatedCollection';

const requestTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Reject' },
    { key: 'by-me', label: 'By Me' },
];

const ApprovalRequestListItem = memo(function ApprovalRequestListItem({ currentUserEmail, currentUserName, item, onApprove, onOpen }) {
    const reviewerLabel = useMemo(() => {
        if (!(item.statusTone === 'approved' || item.statusTone === 'rejected') || !item.reviewerName) {
            return '';
        }

        const reviewerEmail = item.reviewerEmail?.trim()?.toLowerCase() || '';
        const reviewerName = item.reviewerName?.trim()?.toLowerCase() || '';
        const isCurrentReviewer =
            (currentUserEmail && reviewerEmail && currentUserEmail === reviewerEmail) || (currentUserName && reviewerName && currentUserName === reviewerName);

        return isCurrentReviewer ? 'by me' : `by ${item.reviewerName}`;
    }, [currentUserEmail, currentUserName, item]);

    const handleApprovePress = useCallback(() => {
        onApprove(item);
    }, [item, onApprove]);

    const handleOpenPress = useCallback(() => {
        onOpen(item);
    }, [item, onOpen]);

    return (
        <ApprovalRequestCard
            avatarLabel={item.avatarLabel}
            avatarSource={item.avatarSource}
            dateRange={item.dateRange}
            duration={item.duration}
            leaveLabel={item.leaveLabel}
            leaveToneKey={item.leaveToneKey}
            name={item.name}
            onApprovePress={handleApprovePress}
            onPress={handleOpenPress}
            onReviewPress={handleOpenPress}
            reviewerLabel={reviewerLabel}
            role={item.role}
            serverNow={item.serverNow}
            statusLabel={item.statusLabel}
            statusTone={item.statusTone}
            submittedAt={item.raw?.created_at || item.submittedAt}
        />
    );
}, areApprovalRequestListItemPropsEqual);

function areApprovalRequestListItemPropsEqual(previousProps, nextProps) {
    const previousItem = previousProps.item;
    const nextItem = nextProps.item;

    return (
        previousProps.currentUserEmail === nextProps.currentUserEmail &&
        previousProps.currentUserName === nextProps.currentUserName &&
        previousItem === nextItem
    );
}

export function ApprovalRequestListScreen({ navigation, route }) {
    const { authProfile, session, signOut, user } = useAuthSession();
    const adminId = user?.id;
    const [activeTab, setActiveTab] = useState('all');
    const [pendingApprovalRequest, setPendingApprovalRequest] = useState(null);
    const [isApprovingRequest, setIsApprovingRequest] = useState(false);
    const refreshKey = route?.params?.refreshKey;

    const handleUnauthorized = useCallback(async () => {
        await signOut();
        navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
    }, [navigation, signOut]);

    const loadCounts = useCallback(() => fetchApprovalRequestCounts({ adminId, token: session?.token }), [adminId, session?.token]);

    const loadPage = useCallback(
        ({ page, activeTab: nextTab }) => {
            if (nextTab === 'by-me') {
                return fetchApprovalRequestsByAdmin({
                    adminId,
                    page,
                    perPage: 15,
                    token: session?.token,
                });
            }

            return fetchApprovalRequests({
                page,
                perPage: 15,
                status: nextTab === 'all' ? undefined : nextTab,
                token: session?.token,
            });
        },
        [adminId, session?.token]
    );

    const { isLoading, isLoadingMore, items: requests, loadError, loadMore, pagination, refresh, setItems: setRequests, tabCounts } = usePaginatedCollection({
        activeTab,
        initialCounts: { all: 0, pending: 0, approved: 0, rejected: 0, 'by-me': 0 },
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
        if (refreshKey == null) {
            return;
        }

        refresh();
    }, [refresh, refreshKey]);

    const handleLoadMore = useCallback(() => {
        void (async () => {
            const result = await loadMore();

            if (!result.ok && result.reason === 'error') {
                Alert.alert('Load More Failed', result.message || 'Unable to load more requests.');
            }
        })();
    }, [loadMore]);

    const currentUserEmail = authProfile?.email?.trim()?.toLowerCase() || '';
    const currentUserName = authProfile?.fullName?.trim()?.toLowerCase() || '';

    const handleOpenRequest = useCallback(
        (request) => {
            navigation.navigate('ApprovalRequestReview', { request });
        },
        [navigation]
    );

    const handleQueueApprove = useCallback((request) => {
        setPendingApprovalRequest(request);
    }, []);

    const renderRequestItem = useCallback(
        ({ item }) => (
            <ApprovalRequestListItem
                currentUserEmail={currentUserEmail}
                currentUserName={currentUserName}
                item={item}
                onApprove={handleQueueApprove}
                onOpen={handleOpenRequest}
            />
        ),
        [currentUserEmail, currentUserName, handleOpenRequest, handleQueueApprove]
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
        <>
            <ApprovalScreenLayout
                activeNavKey="approvals"
                headerSubtitle="Track every consultant request"
                headerTitle="All Requests"
                navigation={navigation}
                notificationCount={8}
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
                        initialNumToRender={6}
                        keyExtractor={keyExtractor}
                        keyboardShouldPersistTaps="handled"
                        ListEmptyComponent={listEmptyComponent}
                        ListFooterComponent={listFooter}
                        maxToRenderPerBatch={4}
                        removeClippedSubviews
                        renderItem={renderRequestItem}
                        showsVerticalScrollIndicator={false}
                        style={styles.list}
                        updateCellsBatchingPeriod={60}
                        windowSize={5}
                    />
                )}
            </ApprovalScreenLayout>

            <ApprovalConfirmDialog
                confirmLabel={isApprovingRequest ? 'Approving...' : 'Approve Now'}
                message="This action will immediately approve the selected leave request. Please confirm the request details before proceeding."
                onClose={() => setPendingApprovalRequest(null)}
                onConfirm={() => {
                    void (async () => {
                        if (!pendingApprovalRequest || isApprovingRequest) {
                            return;
                        }

                        setIsApprovingRequest(true);

                        try {
                            const approvedRequest = await approveOutOfOfficeRequest({
                                holidayId: pendingApprovalRequest?.raw?.id || pendingApprovalRequest?.id,
                                token: session?.token,
                            });

                            clearApprovalRequestCountsCache();

                            setPendingApprovalRequest(null);
                            setRequests((currentValue) =>
                                currentValue
                                    .map((request) => (request.id === approvedRequest.id ? approvedRequest : request))
                                    .filter((request) => {
                                        if (activeTab === 'pending') {
                                            return request.statusTone === 'pending';
                                        }

                                        if (activeTab === 'by-me') {
                                            return request.reviewerEmail?.trim()?.toLowerCase() === authProfile?.email?.trim()?.toLowerCase();
                                        }

                                        return true;
                                    })
                            );
                            refresh();
                            Alert.alert('Request Approved', approvedRequest.name + "'s request has been approved.");
                        } catch (error) {
                            const message = error instanceof Error ? error.message : 'Unable to approve this request right now.';
                            const status = error?.status;

                            if (status === 401 || message.toLowerCase().includes('unauthenticated')) {
                                await signOut();
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Splash' }],
                                });
                                return;
                            }

                            if (status === 403) {
                                Alert.alert('Approval Not Allowed', message || 'You are not allowed to approve requests.');
                                return;
                            }

                            if (status === 409) {
                                clearApprovalRequestCountsCache();
                                Alert.alert('Already Reviewed', message || 'This request has already been reviewed.');
                                setPendingApprovalRequest(null);
                                refresh();
                                return;
                            }

                            Alert.alert('Approval Failed', message);
                        } finally {
                            setIsApprovingRequest(false);
                        }
                    })();
                }}
                request={pendingApprovalRequest}
                title="Approve This Request?"
                tone="approve"
                visible={Boolean(pendingApprovalRequest)}
            />
        </>
    );
}
