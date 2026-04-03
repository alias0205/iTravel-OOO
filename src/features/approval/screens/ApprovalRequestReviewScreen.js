import { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';

import { ApprovalConfirmDialog } from '../components/ApprovalConfirmDialog';
import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { approvalAvatarSources } from '../data/approvalAvatarSources';
import { getApprovalDurationBreakdown } from '../utils/approvalDurationUtils';
import { LEAVE_TYPE_ICON } from '../../../shared/constants/leaveTypeIcon';
import { ApprovalRequestReviewScreenStyles as styles } from '../../../styles';

const employeeAvatar = require('../../../../assets/nutra/avatars/avatar-5.jpg');

const defaultRequest = {
    avatarLabel: 'SJ',
    name: 'Sarah Johnson',
    role: 'Senior Marketing Specialist',
    department: 'Marketing Department',
    office: 'London Office',
    manager: 'David Smith',
    employeeId: 'MKT-2019-045',
    leaveLabel: 'Annual Leave',
    leaveToneKey: 'annual',
    dateRange: 'Dec 20 - Dec 27, 2024',
    duration: '8 days',
    durationLabel: '8 business days',
    submittedAt: 'Dec 15, 2024 at 2:30 PM',
    reason: 'Family vacation to celebrate holidays. Planning to visit parents and extended family during Christmas week.',
    daysAvailable: '15',
    daysRequested: '8',
    daysRemaining: '7',
    usedThisYear: '10',
    annualLeaveUsage: '18/25 days',
    annualLeaveUsagePercent: 72,
};

const leaveTypeColors = {
    annual: { backgroundColor: '#F2E8FF', color: '#7D32DB' },
    sick: { backgroundColor: '#FDECEC', color: '#D33A33' },
    business: { backgroundColor: '#E7EEFD', color: '#356AE6' },
    remote: { backgroundColor: '#E3F4E7', color: '#2A8C46' },
};

function SectionCard({ icon, title, children }) {
    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons color="#0A6B63" name={icon} size={20} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            {children}
        </View>
    );
}

function SummaryRow({ label, value, trailingTag }) {
    return (
        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{label}</Text>
            {trailingTag ? trailingTag : <Text style={styles.summaryValue}>{value}</Text>}
        </View>
    );
}

function BalanceMetric({ value, label, tone = 'default' }) {
    return (
        <View style={styles.balanceMetric}>
            <Text
                style={[
                    styles.balanceMetricValue,
                    tone === 'orange' ? styles.balanceMetricValueOrange : null,
                    tone === 'green' ? styles.balanceMetricValueGreen : null,
                    tone === 'slate' ? styles.balanceMetricValueSlate : null,
                ]}
            >
                {value}
            </Text>
            <Text style={styles.balanceMetricLabel}>{label}</Text>
        </View>
    );
}

export function ApprovalRequestReviewScreen({ navigation, route }) {
    const [comment, setComment] = useState('');
    const [pendingDecision, setPendingDecision] = useState(null);

    const request = useMemo(() => ({ ...defaultRequest, ...(route?.params?.request ?? {}) }), [route?.params?.request]);
    const leaveTone = leaveTypeColors[request.leaveToneKey] ?? leaveTypeColors.annual;
    const employeePhoto = request.avatarSource ?? approvalAvatarSources[request.avatarLabel] ?? employeeAvatar;
    const durationBreakdown = useMemo(() => getApprovalDurationBreakdown(request), [request]);

    const handleApprovalDecision = () => {
        const decision = pendingDecision;
        const actionLabel = decision === 'approve' ? 'Approve' : 'Reject';
        const successLabel = decision === 'approve' ? 'approved' : 'rejected';

        setPendingDecision(null);
        Alert.alert('Request Updated', request.name + "'s " + request.leaveLabel.toLowerCase() + ' request was ' + successLabel + (comment ? '. Your comment was included.' : '.'));
        navigation.goBack();
    };

    return (
        <ApprovalScreenLayout
            activeNavKey="approvals"
            headerSubtitle={request.leaveLabel + ' Application'}
            headerTitle="Review Request"
            navigation={navigation}
            notificationCount={5}
            scrollContentStyle={styles.scrollContent}
            showBackButton
        >
            <View style={styles.pagePadding}>
                <View style={styles.employeeCard}>
                    <Image source={employeePhoto} style={styles.employeeAvatar} />

                    <View style={styles.employeeCopy}>
                        <Text style={styles.employeeName}>{request.name}</Text>
                        <Text style={styles.employeeRole}>{request.role}</Text>

                        <View style={styles.employeeMetaRow}>
                            <MaterialCommunityIcons color="#6B7280" name="office-building-outline" size={15} />
                            <Text style={styles.employeeMetaText}>{request.department + ' - ' + request.office}</Text>
                        </View>
                        <View style={styles.employeeMetaRow}>
                            <MaterialCommunityIcons color="#6B7280" name="account-supervisor-outline" size={15} />
                            <Text style={styles.employeeMetaText}>{'Reports to: ' + request.manager + ' -> You'}</Text>
                        </View>
                        <View style={styles.employeeMetaRow}>
                            <MaterialCommunityIcons color="#6B7280" name="card-account-details-outline" size={15} />
                            <Text style={styles.employeeMetaText}>{'Employee ID: ' + request.employeeId}</Text>
                        </View>
                    </View>
                </View>

                <SectionCard icon="clipboard-text" title="Request Summary">
                    <View style={styles.sectionBody}>
                        <SummaryRow
                            label="Leave Type"
                            trailingTag={
                                <View style={[styles.leaveTypeTag, { backgroundColor: leaveTone.backgroundColor }]}>
                                    <MaterialCommunityIcons color={leaveTone.color} name={LEAVE_TYPE_ICON} size={12} />
                                    <Text style={[styles.leaveTypeTagText, { color: leaveTone.color }]}>{request.leaveLabel}</Text>
                                </View>
                            }
                        />
                        <SummaryRow label="Dates" value={request.dateRange} />
                        <SummaryRow label="Duration" value={durationBreakdown?.label ?? request.durationLabel ?? request.duration} />
                        <SummaryRow label="Submitted" value={request.submittedAt} />

                        <View style={styles.sectionDivider} />

                        <Text style={styles.reasonLabel}>Reason</Text>
                        <Text style={styles.reasonText}>{request.reason}</Text>
                    </View>
                </SectionCard>

                {/* <SectionCard icon="chart-donut" title="Leave Balance">
                    <View style={styles.sectionBody}>
                        <View style={styles.balanceGrid}>
                            <BalanceMetric label="Days Available" value={request.daysAvailable} />
                            <BalanceMetric label="Days Requested" tone="orange" value={request.daysRequested} />
                            <BalanceMetric label="Remaining" tone="green" value={request.daysRemaining} />
                            <BalanceMetric label="Used This Year" tone="slate" value={request.usedThisYear} />
                        </View>

                        <View style={styles.usageRow}>
                            <Text style={styles.usageLabel}>Annual Leave Usage</Text>
                            <Text style={styles.usageValue}>{request.annualLeaveUsage}</Text>
                        </View>
                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: request.annualLeaveUsagePercent + '%' }]} />
                        </View>
                    </View>
                </SectionCard> */}

                <View style={styles.commentCard}>
                    <Text style={styles.commentTitle}>Add Comment (Optional)</Text>
                    <TextInput
                        multiline
                        onChangeText={setComment}
                        placeholder="Add a note for the employee or HR..."
                        placeholderTextColor="#9CA3AF"
                        style={styles.commentInput}
                        textAlignVertical="top"
                        value={comment}
                    />
                </View>

                <Pressable onPress={() => setPendingDecision('approve')} style={[styles.actionButton, styles.actionButtonApprove]}>
                    <MaterialCommunityIcons color="#FFFFFF" name="check" size={18} />
                    <Text style={styles.actionButtonApproveText}>Approve Request</Text>
                </Pressable>

                <View style={styles.secondaryActionRow}>
                    <Pressable onPress={() => setPendingDecision('reject')} style={[styles.actionButton, styles.actionButtonReject]}>
                        <MaterialCommunityIcons color="#FFFFFF" name="close" size={18} />
                        <Text style={styles.actionButtonRejectText}>Reject</Text>
                    </Pressable>
                </View>
            </View>

            <ApprovalConfirmDialog
                confirmLabel={pendingDecision === 'reject' ? 'Reject Request' : 'Approve Request'}
                message={
                    pendingDecision === 'reject'
                        ? 'This request will be marked as rejected. Make sure the employee has the necessary feedback before you continue.'
                        : 'This request will be marked as approved and sent back to the employee immediately.'
                }
                onClose={() => setPendingDecision(null)}
                onConfirm={handleApprovalDecision}
                request={request}
                title={pendingDecision === 'reject' ? 'Reject This Request?' : 'Approve This Request?'}
                tone={pendingDecision === 'reject' ? 'reject' : 'approve'}
                visible={Boolean(pendingDecision)}
            />
        </ApprovalScreenLayout>
    );
}
