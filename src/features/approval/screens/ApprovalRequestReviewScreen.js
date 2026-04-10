import { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';

import { ApprovalConfirmDialog } from '../components/ApprovalConfirmDialog';
import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { getApprovalDurationBreakdown } from '../utils/approvalDurationUtils';
import { approveOutOfOfficeRequest, rejectOutOfOfficeRequest } from '../utils/approvalRequestsApi';
import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { LEAVE_TYPE_ICON } from '../../../shared/constants/leaveTypeIcon';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { ApprovalRequestReviewScreenStyles as styles } from '../../../styles';

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
    submittedAt: 'Dec 15, 2024, 2:30 PM',
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

function buildAvatarLabel(fullName) {
    const parts = String(fullName || '')
        .split(' ')
        .filter(Boolean);

    return `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase() || 'RV';
}

function formatDatePart(dateValue) {
    return dateValue.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatTimePart(dateValue) {
    return dateValue.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

function formatDateTimeValue(dateValue) {
    return `${formatDatePart(dateValue)}, ${formatTimePart(dateValue)}`;
}

function formatReviewedAt(dateValue) {
    if (!dateValue) {
        return 'Review date unavailable';
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
        return 'Review date unavailable';
    }

    return formatDateTimeValue(parsedDate);
}

function normalizeTimestampText(value, fallbackValue) {
    const source = typeof value === 'string' && value.trim() ? value : fallbackValue;

    if (typeof source !== 'string') {
        return fallbackValue;
    }

    return source.replace(/\s+at\s+/i, ', ');
}

function formatSubmittedAt(dateValue, fallbackValue = 'Submission date unavailable') {
    if (!dateValue) {
        return normalizeTimestampText(fallbackValue, 'Submission date unavailable');
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
        return normalizeTimestampText(fallbackValue, 'Submission date unavailable');
    }

    return formatDateTimeValue(parsedDate);
}

function formatRequestDates(startDateValue, endDateValue, fallbackValue = 'Date unavailable') {
    if (!startDateValue || !endDateValue) {
        return normalizeTimestampText(fallbackValue, 'Date unavailable');
    }

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return normalizeTimestampText(fallbackValue, 'Date unavailable');
    }

    const sameDay = startDate.getFullYear() === endDate.getFullYear() && startDate.getMonth() === endDate.getMonth() && startDate.getDate() === endDate.getDate();

    if (sameDay) {
        const dayLabel = formatDatePart(startDate);

        return `${dayLabel}, ${formatTimePart(startDate)} - ${formatTimePart(endDate)}`;
    }

    return `${formatDateTimeValue(startDate)} - ${formatDateTimeValue(endDate)}`;
}

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
    const { session, signOut } = useAuthSession();
    const [comment, setComment] = useState('');
    const [pendingDecision, setPendingDecision] = useState(null);
    const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

    const request = useMemo(() => ({ ...defaultRequest, ...(route?.params?.request ?? {}) }), [route?.params?.request]);
    const leaveTone = leaveTypeColors[request.leaveToneKey] ?? leaveTypeColors.annual;
    const durationBreakdown = useMemo(() => getApprovalDurationBreakdown(request), [request]);
    const isReadOnlyRequest = request.statusTone === 'approved' || request.statusTone === 'rejected';
    const commentValue = isReadOnlyRequest ? request.reviewComment || '' : comment;
    const reviewerName = request.reviewerName || request?.raw?.review?.reviewer?.name || 'Reviewer unavailable';
    const reviewerEmail = request?.raw?.review?.reviewer?.email || 'Email unavailable';
    const reviewerAvatarLabel = buildAvatarLabel(reviewerName);
    const reviewerSummaryTitle = 'Review Information';
    const reviewerSummaryHeading = request.statusTone === 'approved' ? `Approved by ${reviewerName}` : `Rejected by ${reviewerName}`;
    const reviewerSummaryTone = request.statusTone === 'approved' ? styles.reviewerSummaryBoxApproved : styles.reviewerSummaryBoxRejected;
    const reviewerSummaryTitleStyle = request.statusTone === 'approved' ? styles.reviewerSummaryTitleApproved : styles.reviewerSummaryTitleRejected;
    const reviewerSummaryNoteStyle = request.statusTone === 'approved' ? styles.reviewerSummaryNoteApproved : styles.reviewerSummaryNoteRejected;
    const reviewerSummaryIconColor = request.statusTone === 'approved' ? '#1B7841' : '#B42318';
    const reviewerSummaryIcon = request.statusTone === 'approved' ? 'check-circle' : 'close-circle';
    const reviewerSummaryNote = request.reviewComment || request.reason || 'No review comment provided.';
    const submittedAtLabel = formatSubmittedAt(request?.raw?.created_at || request?.submittedAt, request?.submittedAt);
    const requestDatesLabel = formatRequestDates(request?.raw?.start_date || request?.startDate, request?.raw?.end_date || request?.endDate, request?.dateRange);

    const handleApprovalDecision = () => {
        void (async () => {
            const decision = pendingDecision;
            const isRejectDecision = decision === 'reject';

            if (isReadOnlyRequest) {
                setPendingDecision(null);
                return;
            }

            if ((decision !== 'approve' && !isRejectDecision) || isSubmittingDecision) {
                return;
            }

            setIsSubmittingDecision(true);

            try {
                if (isRejectDecision) {
                    await rejectOutOfOfficeRequest({
                        holidayId: request?.raw?.id || request?.id,
                        reviewComment: comment.trim(),
                        token: session?.token,
                    });
                } else {
                    await approveOutOfOfficeRequest({
                        holidayId: request?.raw?.id || request?.id,
                        reviewComment: comment.trim(),
                        token: session?.token,
                    });
                }

                setPendingDecision(null);
                Alert.alert(
                    isRejectDecision ? 'Request Rejected' : 'Request Approved',
                    request.name +
                        "'s " +
                        request.leaveLabel.toLowerCase() +
                        ` request was ${isRejectDecision ? 'rejected' : 'approved'}` +
                        (comment ? '. Your comment was included.' : '.'),
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );
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
                    Alert.alert(
                        isRejectDecision ? 'Rejection Not Allowed' : 'Approval Not Allowed',
                        message || `You are not allowed to ${isRejectDecision ? 'reject' : 'approve'} requests.`
                    );
                    return;
                }

                if (status === 409) {
                    Alert.alert('Already Reviewed', message || 'This request has already been reviewed.');
                    return;
                }

                Alert.alert(isRejectDecision ? 'Rejection Failed' : 'Approval Failed', message);
            } finally {
                setIsSubmittingDecision(false);
            }
        })();
    };

    return (
        <ApprovalScreenLayout
            activeNavKey="approvals"
            headerSubtitle={request.leaveLabel + ' Request'}
            headerTitle="Review Request"
            navigation={navigation}
            notificationCount={5}
            scrollContentStyle={styles.scrollContent}
            showBackButton
        >
            <View style={styles.pagePadding}>
                <View style={styles.sectionCard}>
                    <View style={styles.employeeCardTop}>
                        <View style={styles.sectionBody}>
                            <View style={styles.employeeCardInline}>
                                {request.avatarSource ? (
                                    <Image source={request.avatarSource} style={styles.employeeAvatar} />
                                ) : (
                                    <View style={styles.employeeAvatarFallback}>
                                        <Text style={styles.employeeAvatarText}>{request.avatarLabel}</Text>
                                    </View>
                                )}

                                <View style={styles.employeeCopy}>
                                    <Text style={styles.employeeName}>{request.name}</Text>
                                    <Text style={styles.employeeRole}>{request.role}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons color="#0A6B63" name="clipboard-text" size={20} />
                        <Text style={styles.sectionTitle}>Request Summary</Text>
                    </View>

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
                        <SummaryRow label="Dates" value={requestDatesLabel} />
                        <SummaryRow label="Duration" value={durationBreakdown?.label ?? request.durationLabel ?? request.duration} />
                        <SummaryRow label="Status" trailingTag={<StatusBadge label={request.statusLabel} tone={request.statusTone} />} />
                        <SummaryRow label="Submitted" value={submittedAtLabel} />

                        <View style={styles.sectionDivider} />

                        <Text style={styles.reasonLabel}>Reason</Text>
                        <Text style={styles.reasonText}>{request.reason}</Text>
                    </View>
                </View>

                {isReadOnlyRequest ? (
                    <SectionCard icon="account-check-outline" title={reviewerSummaryTitle}>
                        <View style={styles.sectionBody}>
                            <View style={styles.reviewerRow}>
                                <View style={styles.reviewerAvatarFallback}>
                                    <Text style={styles.reviewerAvatarText}>{reviewerAvatarLabel}</Text>
                                </View>

                                <View style={styles.reviewerCopy}>
                                    <Text style={styles.reviewerName}>{reviewerName}</Text>
                                    <Text style={styles.reviewerRole}>{formatReviewedAt(request.reviewedAt)}</Text>
                                    <Text style={styles.reviewerEmail}>{reviewerEmail}</Text>
                                </View>
                            </View>

                            <View style={[styles.reviewerSummaryBox, reviewerSummaryTone]}>
                                <View style={styles.reviewerSummaryHeader}>
                                    <MaterialCommunityIcons color={reviewerSummaryIconColor} name={reviewerSummaryIcon} size={18} />
                                    <Text style={[styles.reviewerSummaryTitle, reviewerSummaryTitleStyle]}>{reviewerSummaryHeading}</Text>
                                </View>
                                <Text style={[styles.reviewerSummaryNote, reviewerSummaryNoteStyle]}>"{reviewerSummaryNote}"</Text>
                            </View>
                        </View>
                    </SectionCard>
                ) : null}

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

                {!isReadOnlyRequest ? (
                    <View style={styles.commentCard}>
                        <Text style={styles.commentTitle}>Add Comment (Optional)</Text>
                        <TextInput
                            editable
                            multiline
                            onChangeText={setComment}
                            placeholder="Add a note for the employee or HR..."
                            placeholderTextColor="#9CA3AF"
                            style={styles.commentInput}
                            textAlignVertical="top"
                            value={commentValue}
                        />
                    </View>
                ) : null}

                {!isReadOnlyRequest ? (
                    <>
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
                    </>
                ) : null}
            </View>

            <ApprovalConfirmDialog
                confirmLabel={isSubmittingDecision ? 'Processing...' : pendingDecision === 'reject' ? 'Reject Request' : 'Approve Request'}
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
