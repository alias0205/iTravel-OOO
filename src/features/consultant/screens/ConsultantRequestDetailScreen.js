import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { getApprovalDurationBreakdown } from '../../approval/utils/approvalDurationUtils';
import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { consultantDefaultRequest } from '../data/consultantRequests';
import { ConsultantRequestDetailScreenStyles as styles } from '../../../styles';
import { DetailSectionCard } from '../../../shared/components/dashboard/DetailSectionCard';
import { InfoField } from '../../../shared/components/dashboard/InfoField';
import { PersonSummaryRow } from '../../../shared/components/dashboard/PersonSummaryRow';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { TimelineItem } from '../../../shared/components/dashboard/TimelineItem';

function normalizeTimestampText(value, fallbackValue = 'N/A') {
    const source = typeof value === 'string' && value.trim() ? value : fallbackValue;

    if (typeof source !== 'string') {
        return fallbackValue;
    }

    return source.replace(/\s+at\s+/gi, ', ');
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

function formatDateTimeValue(dateValue, fallbackValue = 'N/A') {
    if (!dateValue) {
        return normalizeTimestampText(fallbackValue, 'N/A');
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
        return normalizeTimestampText(fallbackValue, 'N/A');
    }

    return `${formatDatePart(parsedDate)}, ${formatTimePart(parsedDate)}`;
}

function formatTimelineTimestamp(dateValue, fallbackValue = 'Recently') {
    return formatDateTimeValue(dateValue, fallbackValue);
}

function buildFallbackTimeline(request) {
    const submittedTimestamp = formatTimelineTimestamp(request?.raw?.created_at, 'Recently');
    const updatedTimestamp = formatTimelineTimestamp(request?.raw?.updated_at || request?.raw?.created_at, submittedTimestamp);
    const reviewerName = request?.managerName && request.managerName !== 'Reviewer unavailable' ? request.managerName : '';
    const timeline = [
        {
            title: 'Request Submitted',
            detail: 'Out of office request submitted for review',
            timestamp: submittedTimestamp,
            tone: 'submitted',
        },
    ];

    if (request?.statusTone === 'pending') {
        timeline.push({
            title: 'Pending Review',
            detail: reviewerName ? `Awaiting review from ${reviewerName}` : 'Awaiting approval review',
            timestamp: updatedTimestamp,
            tone: 'review',
        });
    }

    if (request?.statusTone === 'approved') {
        timeline.push({
            title: 'Approved',
            detail: reviewerName ? `Approved by ${reviewerName}` : 'Request approved',
            timestamp: updatedTimestamp,
            tone: 'approved',
        });
    }

    if (request?.statusTone === 'rejected') {
        timeline.push({
            title: 'Rejected',
            detail: reviewerName ? `Rejected by ${reviewerName}` : 'Request rejected',
            timestamp: updatedTimestamp,
            tone: 'rejected',
        });
    }

    return timeline;
}

export function ConsultantRequestDetailScreen({ navigation, route }) {
    const request = route?.params?.request ?? consultantDefaultRequest;
    const isReviewedRequest = request.statusTone === 'approved' || request.statusTone === 'rejected';
    const shouldShowManagerInformation = request.statusTone !== 'pending';
    const reviewerLabel = isReviewedRequest ? 'Reviewer Information' : 'Manager Information';
    const canEditRequest = request.canEdit ?? request.statusTone === 'pending';
    const durationBreakdown = getApprovalDurationBreakdown(request);
    const durationLabel = durationBreakdown?.label ?? request.duration;
    const timelineItems = (Array.isArray(request.timeline) && request.timeline.length > 0 ? request.timeline : buildFallbackTimeline(request)).map((item) => ({
        ...item,
        timestamp: normalizeTimestampText(item.timestamp, 'Recently'),
    }));
    const startDateLabel = formatDateTimeValue(request?.raw?.start_date || request?.startDate, request?.startDate || 'N/A');
    const endDateLabel = formatDateTimeValue(request?.raw?.end_date || request?.endDate, request?.endDate || 'N/A');
    const reviewerBoxStyles = [
        styles.managerApprovalBox,
        request.statusTone === 'approved' ? styles.managerApprovalBoxApproved : null,
        request.statusTone === 'rejected' ? styles.managerApprovalBoxRejected : null,
    ];
    const reviewerTitleStyles = [
        styles.managerApprovalTitle,
        request.statusTone === 'approved' ? styles.managerApprovalTitleApproved : null,
        request.statusTone === 'rejected' ? styles.managerApprovalTitleRejected : null,
    ];
    const reviewerNoteStyles = [
        styles.managerApprovalNote,
        request.statusTone === 'approved' ? styles.managerApprovalNoteApproved : null,
        request.statusTone === 'rejected' ? styles.managerApprovalNoteRejected : null,
    ];

    return (
        <ConsultantScreenLayout
            activeNavKey="requests"
            headerSubtitle="Review dates, approvals, and request history"
            headerTitle="Leave Request Details"
            navigation={navigation}
            notificationCount={3}
            scrollContentStyle={styles.scrollContent}
            showBackButton
        >
            <View style={styles.pagePadding}>
                <View style={styles.heroCard}>
                    <PersonSummaryRow
                        avatarLabel={request.employeeAvatarLabel}
                        avatarSource={request.employeeAvatarSource}
                        name={`Your ${request.title}`}
                        subtitle={request.dateRange}
                    />

                    <View style={styles.heroMetaRow}>
                        <StatusBadge label={request.statusLabel} tone={request.statusTone} />
                        <Text style={styles.heroDays}>{durationLabel}</Text>
                    </View>

                    <View style={styles.heroActionRow}>
                        <Pressable
                            disabled={!canEditRequest}
                            onPress={() => navigation.navigate('ConsultantNewRequest', { request })}
                            style={[styles.heroButton, styles.heroButtonMuted, !canEditRequest ? styles.heroButtonDisabled : null]}
                        >
                            <MaterialCommunityIcons color="#FFFFFF" name="square-edit-outline" size={18} />
                            <Text style={[styles.heroButtonText, styles.heroButtonTextMuted]}>Edit</Text>
                        </Pressable>
                        <Pressable style={[styles.heroButton, styles.heroButtonDanger]}>
                            <MaterialCommunityIcons color="#D33A33" name="close" size={18} />
                            <Text style={[styles.heroButtonText, styles.heroButtonTextDanger]}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>

                <DetailSectionCard title="Request Details">
                    <View style={styles.personRowWrap}>
                        <PersonSummaryRow
                            avatarLabel={request.employeeAvatarLabel}
                            avatarSource={request.employeeAvatarSource}
                            name={request.employeeName}
                            subtitle={'Consultant'}
                        />
                    </View>

                    <View style={styles.twoColumnRow}>
                        <View style={styles.column}>
                            <InfoField label="Start Date" value={startDateLabel} />
                        </View>
                        <View style={styles.columnSpacer} />
                        <View style={styles.column}>
                            <InfoField label="End Date" value={endDateLabel} />
                        </View>
                    </View>

                    <View style={styles.leaveTypeWrap}>
                        <Text style={styles.fieldLabel}>Leave Type</Text>
                        <View style={styles.leaveTypeRow}>
                            <MaterialCommunityIcons color={request.leaveTypeColor} name={request.leaveTypeIcon} size={18} />
                            <Text style={styles.leaveTypeText}>{request.leaveTypeLabel}</Text>
                        </View>
                    </View>
                    <InfoField label="Reason" value={request.reason} />

                    <View style={styles.statusGroup}>
                        <Text style={styles.fieldLabel}>Status</Text>
                        <StatusBadge label={request.statusLabel} tone={request.statusTone} />
                    </View>
                </DetailSectionCard>

                {shouldShowManagerInformation ? (
                    <DetailSectionCard title={reviewerLabel}>
                        <PersonSummaryRow
                            avatarLabel={request.managerAvatarLabel}
                            avatarSource={request.managerAvatarSource}
                            extra={request.managerEmail}
                            name={request.managerName}
                            showAction
                        />

                        <View style={reviewerBoxStyles}>
                            <View style={styles.managerApprovalHeader}>
                                <MaterialCommunityIcons color={request.managerApprovalIconColor} name={request.managerApprovalIcon} size={18} />
                                <Text style={reviewerTitleStyles}>{request.managerApprovalTitle}</Text>
                            </View>
                            <Text style={reviewerNoteStyles}>"{request.managerApprovalNote}"</Text>
                        </View>
                    </DetailSectionCard>
                ) : null}

                <DetailSectionCard title="Request Timeline">
                    {timelineItems.map((item, index) => (
                        <TimelineItem
                            detail={item.detail}
                            isLast={index === timelineItems.length - 1}
                            key={`${request.id}-${item.title}-${index}`}
                            timestamp={item.timestamp}
                            title={item.title}
                            tone={item.tone}
                        />
                    ))}
                </DetailSectionCard>
            </View>
        </ConsultantScreenLayout>
    );
}
