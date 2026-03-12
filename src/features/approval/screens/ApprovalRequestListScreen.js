import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { ApprovalConfirmDialog } from '../components/ApprovalConfirmDialog';
import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { approvalRequests } from '../data/approvalRequests';
import { ApprovalRequestListScreenStyles as styles } from '../../../styles';
import { ApprovalRequestCard } from '../../../shared/components/dashboard/ApprovalRequestCard';

const requestTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Reject' },
];

export function ApprovalRequestListScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('all');
    const [pendingApprovalRequest, setPendingApprovalRequest] = useState(null);

    const tabCounts = useMemo(
        () => ({
            all: approvalRequests.length,
            pending: approvalRequests.filter((request) => request.statusTone === 'pending').length,
            approved: approvalRequests.filter((request) => request.statusTone === 'approved').length,
            rejected: approvalRequests.filter((request) => request.statusTone === 'rejected').length,
        }),
        []
    );

    const filteredRequests = useMemo(() => {
        if (activeTab === 'all') {
            return approvalRequests;
        }

        return approvalRequests.filter((request) => request.statusTone === activeTab);
    }, [activeTab]);

    return (
        <>
            <ApprovalScreenLayout
                activeNavKey="approvals"
                // headerSubtitle="Track every consultant request and its approval status"
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
                    {filteredRequests.map((request) => (
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
                    {filteredRequests.length === 0 ? <Text style={styles.emptyState}>No requests in this category.</Text> : null}
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
