import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { consultantDefaultRequest } from '../data/consultantRequests';
import { ConsultantRequestDetailScreenStyles as styles } from '../../../styles';
import { DetailSectionCard } from '../../../shared/components/dashboard/DetailSectionCard';
import { InfoField } from '../../../shared/components/dashboard/InfoField';
import { PersonSummaryRow } from '../../../shared/components/dashboard/PersonSummaryRow';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { TimelineItem } from '../../../shared/components/dashboard/TimelineItem';

export function ConsultantRequestDetailScreen({ navigation, route }) {
    const request = route?.params?.request ?? consultantDefaultRequest;

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
                    <PersonSummaryRow avatarSource={request.employeeAvatarSource} name={`Your ${request.title}`} subtitle={request.dateRange} />

                    <View style={styles.heroMetaRow}>
                        <StatusBadge label={request.statusLabel} tone={request.statusTone} />
                        <Text style={styles.heroDays}>{request.duration}</Text>
                    </View>

                    <View style={styles.heroActionRow}>
                        <Pressable style={[styles.heroButton, styles.heroButtonMuted]}>
                            <MaterialCommunityIcons color="#4A5563" name="square-edit-outline" size={18} />
                            <Text style={[styles.heroButtonText, styles.heroButtonTextMuted]}>Edit</Text>
                        </Pressable>
                        <Pressable style={[styles.heroButton, styles.heroButtonDanger]}>
                            <MaterialCommunityIcons color="#D33A33" name="close" size={18} />
                            <Text style={[styles.heroButtonText, styles.heroButtonTextDanger]}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>

                <DetailSectionCard title="Request Details">
                    <Text style={styles.fieldLabel}>Employee</Text>
                    <View style={styles.personRowWrap}>
                        <PersonSummaryRow avatarSource={request.employeeAvatarSource} name={request.employeeName} subtitle={request.employeeTeam} />
                    </View>

                    <View style={styles.twoColumnRow}>
                        <View style={styles.column}>
                            <InfoField label="Start Date" value={request.startDate} />
                        </View>
                        <View style={styles.columnSpacer} />
                        <View style={styles.column}>
                            <InfoField label="End Date" value={request.endDate} />
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

                <DetailSectionCard title="Manager Information">
                    <PersonSummaryRow
                        avatarSource={request.managerAvatarSource}
                        extra={request.managerEmail}
                        name={request.managerName}
                        showAction
                        subtitle={request.managerRole}
                    />

                    <View style={styles.managerApprovalBox}>
                        <View style={styles.managerApprovalHeader}>
                            <MaterialCommunityIcons color={request.managerApprovalIconColor} name={request.managerApprovalIcon} size={18} />
                            <Text style={styles.managerApprovalTitle}>{request.managerApprovalTitle}</Text>
                        </View>
                        <Text style={styles.managerApprovalNote}>"{request.managerApprovalNote}"</Text>
                    </View>
                </DetailSectionCard>

                <DetailSectionCard title="Request Timeline">
                    {request.timeline.map((item, index) => (
                        <TimelineItem
                            detail={item.detail}
                            isLast={index === request.timeline.length - 1}
                            key={`${request.id}-${item.title}-${index}`}
                            timestamp={item.timestamp}
                            title={item.title}
                            tone={item.tone}
                        />
                    ))}
                </DetailSectionCard>

                <Pressable style={[styles.footerActionButton, styles.footerActionPrimary]}>
                    <MaterialCommunityIcons color="#FFFFFF" name="email" size={18} />
                    <Text style={[styles.footerActionText, styles.footerActionTextPrimary]}>Contact Manager</Text>
                </Pressable>
                {/* <Pressable style={[styles.footerActionButton, styles.footerActionMuted]}>
                    <MaterialCommunityIcons color="#4D5867" name="calendar-month" size={18} />
                    <Text style={[styles.footerActionText, styles.footerActionTextMuted]}>Add to Calendar</Text>
                </Pressable> */}
            </View>
        </ConsultantScreenLayout>
    );
}
