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
    department,
    leaveLabel,
    leaveToneKey = 'annual',
    dateRange,
    duration,
    avatarLabel,
    avatarSource,
    statusLabel,
    statusTone,
    onApprovePress,
    onReviewPress,
}) {
    const tone = leaveTone[leaveToneKey] ?? leaveTone.annual;

    return (
        <View style={styles.card}>
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
                    <Text style={styles.department}>{department}</Text>
                    <View style={[styles.leavePill, { backgroundColor: tone.backgroundColor }]}>
                        <MaterialCommunityIcons color={tone.color} name={tone.icon} size={12} />
                        <Text style={[styles.leaveText, { color: tone.color }]}>{leaveLabel}</Text>
                    </View>
                </View>

                {statusLabel ? <StatusBadge label={statusLabel} tone={statusTone} /> : null}
            </View>

            <View style={styles.dateRow}>
                <MaterialCommunityIcons color="#969EAB" name="calendar-month-outline" size={15} />
                <Text style={styles.dateText}>{dateRange}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.dateText}>{duration}</Text>
            </View>

            <View style={styles.actionRow}>
                <Pressable onPress={onApprovePress} style={[styles.button, styles.buttonGhost]}>
                    <Text style={[styles.buttonText, styles.buttonTextGhost]}>Approve</Text>
                </Pressable>
                <Pressable onPress={onReviewPress} style={[styles.button, styles.buttonSolid]}>
                    <Text style={[styles.buttonText, styles.buttonTextSolid]}>Review</Text>
                </Pressable>
            </View>
        </View>
    );
}
