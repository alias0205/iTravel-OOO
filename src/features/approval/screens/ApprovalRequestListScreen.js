import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { ApprovalConfirmDialog } from '../components/ApprovalConfirmDialog';
import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { approveOutOfOfficeRequest, fetchApprovalRequestCounts, fetchApprovalRequests, fetchApprovalRequestsByAdmin } from '../utils/approvalRequestsApi';
import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { ApprovalRequestListScreenStyles as styles } from '../../../styles';
import { ApprovalRequestCard } from '../../../shared/components/dashboard/ApprovalRequestCard';

const requestTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Reject' },
    { key: 'by-me', label: 'By Me' },
];

export function ApprovalRequestListScreen({ navigation, route }) {
    const { authProfile, session, signOut, user } = useAuthSession();
    const adminId = user?.id;
    const [activeTab, setActiveTab] = useState('all');
    const [pendingApprovalRequest, setPendingApprovalRequest] = useState(null);
    const [isApprovingRequest, setIsApprovingRequest] = useState(false);
    const [requests, setRequests] = useState([]);
    const [tabCounts, setTabCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0, 'by-me': 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);
    const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });
    const refreshKey = route?.params?.refreshKey;

    useFocusEffect(
        useCallback(() => {
            setReloadKey((currentValue) => currentValue + 1);
        }, [])
    );

    useEffect(() => {
        let isMounted = true;

        void (async () => {
            try {
                const counts = await fetchApprovalRequestCounts({ adminId, token: session?.token });

                if (isMounted) {
                    setTabCounts((currentValue) => ({ ...currentValue, ...counts }));
                }
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (error?.status === 401) {
                    await signOut();
                    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [adminId, navigation, reloadKey, session?.token, signOut]);

    useEffect(() => {
        let isMounted = true;

        void (async () => {
            setIsLoading(true);
            setLoadError('');

            try {
                const result =
                    activeTab === 'by-me'
                        ? await fetchApprovalRequestsByAdmin({
                              adminId,
                              page: 1,
                              perPage: 15,
                              token: session?.token,
                          })
                        : await fetchApprovalRequests({
                              page: 1,
                              perPage: 15,
                              status: activeTab === 'all' ? undefined : activeTab,
                              token: session?.token,
                          });

                if (!isMounted) {
                    return;
                }

                setRequests(result.items);
                setPagination(result.meta);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                const message = error instanceof Error ? error.message : 'Unable to load requests right now.';

                if (error?.status === 401) {
                    await signOut();
                    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
                    return;
                }

                setLoadError(message);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [activeTab, adminId, navigation, refreshKey, reloadKey, session?.token, signOut]);

    const handleLoadMore = () => {
        void (async () => {
            if (isLoadingMore || isLoading || pagination.currentPage >= pagination.lastPage) {
                return;
            }

            setIsLoadingMore(true);

            try {
                const nextPage = pagination.currentPage + 1;
                const result =
                    activeTab === 'by-me'
                        ? await fetchApprovalRequestsByAdmin({
                              adminId,
                              page: nextPage,
                              perPage: 15,
                              token: session?.token,
                          })
                        : await fetchApprovalRequests({
                              page: nextPage,
                              perPage: 15,
                              status: activeTab === 'all' ? undefined : activeTab,
                              token: session?.token,
                          });

                setRequests((currentValue) => [...currentValue, ...result.items]);
                setPagination(result.meta);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to load more requests.';

                if (error?.status === 401) {
                    await signOut();
                    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
                    return;
                }

                Alert.alert('Load More Failed', message);
            } finally {
                setIsLoadingMore(false);
            }
        })();
    };

    const getReviewerLabel = (request) => {
        if (!(request.statusTone === 'approved' || request.statusTone === 'rejected') || !request.reviewerName) {
            return '';
        }

        const currentUserEmail = authProfile?.email?.trim()?.toLowerCase() || '';
        const reviewerEmail = request.reviewerEmail?.trim()?.toLowerCase() || '';
        const currentUserName = authProfile?.fullName?.trim()?.toLowerCase() || '';
        const reviewerName = request.reviewerName?.trim()?.toLowerCase() || '';
        const isCurrentReviewer =
            (currentUserEmail && reviewerEmail && currentUserEmail === reviewerEmail) || (currentUserName && reviewerName && currentUserName === reviewerName);

        return isCurrentReviewer ? 'by me' : `by ${request.reviewerName}`;
    };

    return (
        <>
            <ApprovalScreenLayout
                activeNavKey="approvals"
                headerSubtitle="Track every consultant request"
                headerTitle="All Requests"
                navigation={navigation}
                notificationCount={8}
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
                            <Pressable onPress={() => setReloadKey((currentValue) => currentValue + 1)} style={styles.retryButton}>
                                <Text style={styles.retryButtonText}>Try Again</Text>
                            </Pressable>
                        </View>
                    ) : null}

                    {!isLoading && !loadError
                        ? requests.map((request) => (
                              <ApprovalRequestCard
                                  avatarLabel={request.avatarLabel}
                                  avatarSource={request.avatarSource}
                                  dateRange={request.dateRange}
                                  duration={request.duration}
                                  key={request.id}
                                  leaveLabel={request.leaveLabel}
                                  leaveToneKey={request.leaveToneKey}
                                  name={request.name}
                                  serverNow={request.serverNow}
                                  submittedAt={request.raw?.created_at || request.submittedAt}
                                  onPress={() => navigation.navigate('ApprovalRequestReview', { request })}
                                  reviewerLabel={getReviewerLabel(request)}
                                  role={request.role}
                                  statusLabel={request.statusLabel}
                                  statusTone={request.statusTone}
                                  onApprovePress={() => setPendingApprovalRequest(request)}
                                  onReviewPress={() => navigation.navigate('ApprovalRequestReview', { request })}
                              />
                          ))
                        : null}
                    {!isLoading && !loadError && requests.length === 0 ? <Text style={styles.emptyState}>No requests in this category.</Text> : null}
                    {!isLoading && !loadError && pagination.currentPage < pagination.lastPage ? (
                        <Pressable onPress={handleLoadMore} style={[styles.loadMoreButton, isLoadingMore ? styles.loadMoreButtonDisabled : null]}>
                            <Text style={styles.loadMoreButtonText}>{isLoadingMore ? 'Loading...' : 'Load More'}</Text>
                        </Pressable>
                    ) : null}
                </View>
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
                            setReloadKey((currentValue) => currentValue + 1);
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
                                Alert.alert('Already Reviewed', message || 'This request has already been reviewed.');
                                setPendingApprovalRequest(null);
                                setReloadKey((currentValue) => currentValue + 1);
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
