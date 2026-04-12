import { memo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

import { LEAVE_TYPE_ICON } from '../../constants/leaveTypeIcon';
import { StatusBadge } from './StatusBadge';
import { ApprovalRequestCardStyles as styles } from '../../../styles';

const leaveTone = {
    annual: { backgroundColor: '#F1EAFE', color: '#7D32DB', icon: LEAVE_TYPE_ICON },
    sick: { backgroundColor: '#FDECEC', color: '#D33A33', icon: LEAVE_TYPE_ICON },
    business: { backgroundColor: '#E7EEFD', color: '#356AE6', icon: LEAVE_TYPE_ICON },
    remote: { backgroundColor: '#E3F4E7', color: '#2A8C46', icon: LEAVE_TYPE_ICON },
};

function formatRelativeSubmittedTime(submittedAtValue, referenceTimeValue) {
    if (!submittedAtValue) {
        return '';
    }

    const parsedDate = new Date(submittedAtValue);

    if (Number.isNaN(parsedDate.getTime())) {
        return submittedAtValue;
    }

    const referenceDate = referenceTimeValue ? new Date(referenceTimeValue) : null;
    const referenceTime = referenceDate && !Number.isNaN(referenceDate.getTime()) ? referenceDate.getTime() : Date.now();
    const diffMs = referenceTime - parsedDate.getTime();
    const safeDiffMs = diffMs < 0 ? 0 : diffMs;
    const minuteMs = 60 * 1000;
    const hourMs = 60 * minuteMs;
    const dayMs = 24 * hourMs;

    if (safeDiffMs < minuteMs) {
        return 'Just now';
    }

    if (safeDiffMs < hourMs) {
        const minutes = Math.floor(safeDiffMs / minuteMs);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    if (safeDiffMs < dayMs) {
        const hours = Math.floor(safeDiffMs / hourMs);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }

    if (safeDiffMs < 7 * dayMs) {
        const days = Math.floor(safeDiffMs / dayMs);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }

    const weeks = Math.floor(safeDiffMs / (7 * dayMs));

    if (weeks < 5) {
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }

    const months = Math.floor(safeDiffMs / (30 * dayMs));

    if (months < 12) {
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }

    const years = Math.floor(safeDiffMs / (365 * dayMs));
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

function ApprovalRequestCardComponent({
    name,
    role,
    leaveLabel,
    leaveToneKey = 'annual',
    dateRange,
    duration,
    submittedAt,
    serverNow,
    avatarLabel,
    avatarSource,
    reviewerLabel,
    statusLabel,
    statusTone,
    onPress,
    onApprovePress,
    onReviewPress,
}) {
    const tone = leaveTone[leaveToneKey] ?? leaveTone.annual;
    const isClosedRequest = statusTone === 'approved' || statusTone === 'rejected';
    const submittedLabel = formatRelativeSubmittedTime(submittedAt, serverNow);

    return (
        <Pressable disabled={!isClosedRequest} onPress={onPress} style={styles.card}>
            <View style={styles.headerRow}>
                {avatarSource ? (
                    <Image source={avatarSource} style={styles.avatarImage} />
                ) : (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{avatarLabel}</Text>
                    </View>
                )}

                <View style={styles.headerCopy}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.role}>{role}</Text>
                    <View style={styles.leaveMetaRow}>
                        <View style={[styles.leavePill, { backgroundColor: tone.backgroundColor }]}>
                            <MaterialCommunityIcons color={tone.color} name={tone.icon} size={12} />
                            <Text style={[styles.leaveText, { color: tone.color }]}>{leaveLabel}</Text>
                        </View>
                        {reviewerLabel ? <Text style={styles.leaveReviewerText}>{reviewerLabel}</Text> : null}
                    </View>
                </View>

                {statusLabel ? (
                    <View style={styles.statusWrap}>
                        <StatusBadge label={statusLabel} tone={statusTone} />
                    </View>
                ) : null}
            </View>

            <View style={[styles.dateRow, isClosedRequest ? styles.dateRowClosed : null]}>
                <MaterialCommunityIcons color="#969EAB" name="calendar-month-outline" size={15} />
                <Text style={styles.dateText}>{dateRange}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.dateText}>{duration}</Text>
            </View>

            {!isClosedRequest ? (
                <View style={styles.actionRow}>
                    <Pressable onPress={onApprovePress} style={[styles.button, styles.buttonGhost]}>
                        <Text style={[styles.buttonText, styles.buttonTextGhost]}>Approve</Text>
                    </Pressable>
                    <Pressable onPress={onReviewPress} style={[styles.button, styles.buttonSolid]}>
                        <Text style={[styles.buttonText, styles.buttonTextSolid]}>Review</Text>
                    </Pressable>
                </View>
            ) : null}

            {submittedLabel ? (
                <View style={styles.submittedFooter}>
                    <View style={styles.submittedDivider} />
                    <View style={styles.submittedRow}>
                        <MaterialCommunityIcons color="#969EAB" name="clock-outline" size={15} />
                        <Text style={styles.submittedText}>Submitted {submittedLabel}</Text>
                    </View>
                </View>
            ) : null}
        </Pressable>
    );
}

function arePropsEqual(previousProps, nextProps) {
    return (
        previousProps.name === nextProps.name &&
        previousProps.role === nextProps.role &&
        previousProps.leaveLabel === nextProps.leaveLabel &&
        previousProps.leaveToneKey === nextProps.leaveToneKey &&
        previousProps.dateRange === nextProps.dateRange &&
        previousProps.duration === nextProps.duration &&
        previousProps.submittedAt === nextProps.submittedAt &&
        previousProps.serverNow === nextProps.serverNow &&
        previousProps.avatarLabel === nextProps.avatarLabel &&
        previousProps.avatarSource === nextProps.avatarSource &&
        previousProps.reviewerLabel === nextProps.reviewerLabel &&
        previousProps.statusLabel === nextProps.statusLabel &&
        previousProps.statusTone === nextProps.statusTone
    );
}

export const ApprovalRequestCard = memo(ApprovalRequestCardComponent, arePropsEqual);
