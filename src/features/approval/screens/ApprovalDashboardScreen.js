import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Pressable, Text, View } from 'react-native';

import { ApprovalConfirmDialog } from '../components/ApprovalConfirmDialog';
import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { approveOutOfOfficeRequest, clearApprovalRequestCountsCache, fetchApprovalRequestCounts, fetchApprovalRequests } from '../utils/approvalRequestsApi';
import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { ApprovalDashboardScreenStyles as styles } from '../../../styles';
import { ApprovalMetricCard } from '../../../shared/components/dashboard/ApprovalMetricCard';
import { ApprovalRequestCard } from '../../../shared/components/dashboard/ApprovalRequestCard';
import { DashboardSearchInput } from '../../../shared/components/dashboard/DashboardSearchInput';
import { DashboardSectionHeader } from '../../../shared/components/dashboard/DashboardSectionHeader';

export function ApprovalDashboardScreen({ navigation }) {
    const { authProfile, session, signOut } = useAuthSession();
    const [pendingApprovalRequest, setPendingApprovalRequest] = useState(null);
    const [recentRequests, setRecentRequests] = useState([]);
    const [requestCounts, setRequestCounts] = useState({ all: 0, approved: 0, pending: 0, rejected: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isApprovingRequest, setIsApprovingRequest] = useState(false);
    const [loadError, setLoadError] = useState('');

    const loadDashboard = useCallback(async () => {
        if (!session?.token) {
            setRecentRequests([]);
            setRequestCounts({ all: 0, approved: 0, pending: 0, rejected: 0 });
            setLoadError('');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setLoadError('');

        try {
            const [counts, recent] = await Promise.all([
                fetchApprovalRequestCounts({ token: session.token }),
                fetchApprovalRequests({ page: 1, perPage: 5, token: session.token }),
            ]);

            setRequestCounts(counts);
            setRecentRequests(Array.isArray(recent?.items) ? recent.items : []);
        } catch (error) {
            if (error?.status === 401) {
                await signOut();
                navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
                return;
            }

            setLoadError(error instanceof Error ? error.message : 'Unable to load the dashboard right now.');
            setRecentRequests([]);
        } finally {
            setIsLoading(false);
        }
    }, [navigation, session?.token, signOut]);

    useFocusEffect(
        useCallback(() => {
            void loadDashboard();
        }, [loadDashboard])
    );

    const filteredRequests = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        if (!normalizedQuery) {
            return recentRequests;
        }

        return recentRequests.filter((request) => {
            const haystack = [request.name, request.role, request.department, request.leaveLabel]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(normalizedQuery);
        });
    }, [recentRequests, searchQuery]);

    const reviewedCount = Number(requestCounts.approved || 0) + Number(requestCounts.rejected || 0);

    const handleOpenRequest = useCallback(
        (request) => {
            navigation.navigate('ApprovalRequestReview', { request });
        },
        [navigation]
    );

    return (
        <>
            <ApprovalScreenLayout
                activeNavKey="dashboard"
                headerSubtitle="Review requests and pending actions"
                headerTitle={authProfile?.fullName ? `Welcome, ${authProfile.fullName}` : 'Approval Dashboard'}
                navigation={navigation}
                scrollContentStyle={styles.scrollContent}
            >
                <View style={styles.pagePadding}>
                    <DashboardSearchInput onChangeText={setSearchQuery} placeholder="Search by name or department..." value={searchQuery} />

                    <View style={styles.metricsRow}>
                        <ApprovalMetricCard icon="clock-time-three" title="Pending Requests" tone="orange" value={String(requestCounts.pending || 0)} />
                        <View style={styles.metricsSpacer} />
                        <ApprovalMetricCard icon="account-group" title="Reviewed Requests" tone="blue" value={String(reviewedCount)} />
                    </View>

                    <DashboardSectionHeader actionLabel="View All" onActionPress={() => navigation.navigate('ApprovalRequestList')} title="Recent Requests" />

                    {loadError ? (
                        <View style={styles.retryWrap}>
                            <Text style={styles.errorState}>{loadError}</Text>
                            <Pressable onPress={() => void loadDashboard()} style={styles.retryButton}>
                                <Text style={styles.retryButtonText}>Try Again</Text>
                            </Pressable>
                        </View>
                    ) : isLoading ? (
                        <Text style={styles.infoState}>Loading recent requests...</Text>
                    ) : filteredRequests.length ? (
                        filteredRequests.map((request) => (
                            <ApprovalRequestCard
                                avatarLabel={request.avatarLabel}
                                avatarSource={request.avatarSource}
                                dateRange={request.dateRange}
                                duration={request.duration}
                                key={request.id}
                                leaveLabel={request.leaveLabel}
                                leaveToneKey={request.leaveToneKey}
                                name={request.name}
                                onApprovePress={() => setPendingApprovalRequest(request)}
                                onPress={() => handleOpenRequest(request)}
                                onReviewPress={() => handleOpenRequest(request)}
                                reviewerLabel={request.statusTone === 'approved' || request.statusTone === 'rejected' ? (request.reviewerName ? `by ${request.reviewerName}` : '') : ''}
                                role={request.role}
                                serverNow={request.serverNow}
                                statusLabel={request.statusLabel}
                                statusTone={request.statusTone}
                                submittedAt={request.raw?.created_at || request.submittedAt}
                            />
                        ))
                    ) : (
                        <Text style={styles.infoState}>{searchQuery.trim() ? 'No requests match your search.' : 'No recent requests available.'}</Text>
                    )}
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

                            clearApprovalRequestCountsCache();
                            setPendingApprovalRequest(null);
                            setRecentRequests((currentValue) => currentValue.map((request) => (request.id === approvedRequest.id ? approvedRequest : request)));
                            await loadDashboard();
                            Alert.alert('Request Approved', approvedRequest.name + "'s request has been approved.");
                        } catch (error) {
                            const message = error instanceof Error ? error.message : 'Unable to approve this request right now.';

                            if (error?.status === 401) {
                                await signOut();
                                navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
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
