import { useState } from 'react';
import { Alert, View } from 'react-native';

import { ApprovalConfirmDialog } from '../components/ApprovalConfirmDialog';
import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { approvalRequests } from '../data/approvalRequests';
import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { ApprovalDashboardScreenStyles as styles } from '../../../styles';
import { ApprovalMetricCard } from '../../../shared/components/dashboard/ApprovalMetricCard';
import { ApprovalRequestCard } from '../../../shared/components/dashboard/ApprovalRequestCard';
import { DashboardSearchInput } from '../../../shared/components/dashboard/DashboardSearchInput';
import { DashboardSectionHeader } from '../../../shared/components/dashboard/DashboardSectionHeader';

export function ApprovalDashboardScreen({ navigation }) {
    const { authProfile } = useAuthSession();
    const [pendingApprovalRequest, setPendingApprovalRequest] = useState(null);

    return (
        <>
            <ApprovalScreenLayout
                activeNavKey="dashboard"
                headerSubtitle="Review requests and pending actions"
                headerTitle={`Welcome, ${authProfile?.fullName ?? 'Michael Johnson'}`}
                navigation={navigation}
                notificationCount={8}
                scrollContentStyle={styles.scrollContent}
            >
                <View style={styles.pagePadding}>
                    <DashboardSearchInput placeholder="Search by name or department..." />

                    <View style={styles.metricsRow}>
                        <ApprovalMetricCard icon="clock-time-three" title="Pending Approvals" tone="orange" value="5" />
                        <View style={styles.metricsSpacer} />
                        <ApprovalMetricCard icon="account-group" title="OOO Consultants" tone="blue" value="2" />
                    </View>

                    <DashboardSectionHeader actionLabel="View All" onActionPress={() => navigation.navigate('ApprovalRequestList')} title="Recent Requests" />

                    {approvalRequests.map((request) => (
                        <ApprovalRequestCard
                            avatarLabel={request.avatarLabel}
                            avatarSource={request.avatarSource}
                            dateRange={request.dateRange}
                            department={request.department}
                            duration={request.duration}
                            key={request.id}
                            leaveLabel={request.leaveLabel}
                            leaveToneKey={request.leaveToneKey}
                            name={request.name}
                            statusLabel={request.statusLabel}
                            statusTone={request.statusTone}
                            onApprovePress={() => setPendingApprovalRequest(request)}
                            onReviewPress={() => navigation.navigate('ApprovalRequestReview', { request })}
                        />
                    ))}
                </View>
            </ApprovalScreenLayout>

            <ApprovalConfirmDialog
                confirmLabel="Approve Now"
                message="This action will immediately approve the selected leave request. Please confirm the request details before proceeding."
                onClose={() => setPendingApprovalRequest(null)}
                onConfirm={() => {
                    const approvedRequest = pendingApprovalRequest;
                    setPendingApprovalRequest(null);
                    if (approvedRequest) {
                        Alert.alert('Request Approved', approvedRequest.name + "'s request has been approved.");
                    }
                }}
                request={pendingApprovalRequest}
                title="Approve This Request?"
                tone="approve"
                visible={Boolean(pendingApprovalRequest)}
            />
        </>
    );
}
