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

export function ApprovalRequestCard({
    name,
    role,
    leaveLabel,
    leaveToneKey = 'annual',
    dateRange,
    duration,
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
        </Pressable>
    );
}
