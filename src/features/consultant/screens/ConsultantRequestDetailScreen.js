import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { DetailSectionCard } from '../../../shared/components/dashboard/DetailSectionCard';
import { InfoField } from '../../../shared/components/dashboard/InfoField';
import { PersonSummaryRow } from '../../../shared/components/dashboard/PersonSummaryRow';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { TimelineItem } from '../../../shared/components/dashboard/TimelineItem';

const consultantAvatar = require('../../../../assets/nutra/avatars/avatar-1.jpg');
const managerAvatar = require('../../../../assets/nutra/avatars/avatar-4.jpg');

export function ConsultantRequestDetailScreen({ navigation }) {
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
                    <PersonSummaryRow avatarSource={consultantAvatar} name="Your Vacation Leave" subtitle="December 18-20, 2024" />

                    <View style={styles.heroMetaRow}>
                        <StatusBadge label="Approved" tone="approved" />
                        <Text style={styles.heroDays}>3 days</Text>
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
                        <PersonSummaryRow avatarSource={consultantAvatar} name="Sarah Johnson" subtitle="Engineering Team" />
                    </View>

                    <View style={styles.twoColumnRow}>
                        <View style={styles.column}>
                            <InfoField label="Start Date" value="December 18, 2024" />
                        </View>
                        <View style={styles.columnSpacer} />
                        <View style={styles.column}>
                            <InfoField label="End Date" value="December 20, 2024" />
                        </View>
                    </View>

                    <View style={styles.leaveTypeWrap}>
                        <Text style={styles.fieldLabel}>Leave Type</Text>
                        <View style={styles.leaveTypeRow}>
                            <MaterialCommunityIcons color="#2563EB" name="beach" size={18} />
                            <Text style={styles.leaveTypeText}>Vacation</Text>
                        </View>
                    </View>
                    <InfoField label="Reason" value="Family vacation to celebrate the holidays. Will be traveling out of state and completely offline." />

                    <View style={styles.statusGroup}>
                        <Text style={styles.fieldLabel}>Status</Text>
                        <StatusBadge label="Approved" tone="approved" />
                    </View>
                </DetailSectionCard>

                <DetailSectionCard title="Manager Information">
                    <PersonSummaryRow avatarSource={managerAvatar} extra="michael.chen@company.com" name="Michael Chen" showAction subtitle="Engineering Manager" />

                    <View style={styles.managerApprovalBox}>
                        <View style={styles.managerApprovalHeader}>
                            <MaterialCommunityIcons color="#16A34A" name="check-circle" size={18} />
                            <Text style={styles.managerApprovalTitle}>Approved on December 15, 2024</Text>
                        </View>
                        <Text style={styles.managerApprovalNote}>"Approved. Enjoy your vacation!"</Text>
                    </View>
                </DetailSectionCard>

                <DetailSectionCard title="Request Timeline">
                    <TimelineItem detail="Leave request submitted for manager approval" timestamp="December 10, 2024 at 2:30 PM" title="Request Submitted" tone="submitted" />
                    <TimelineItem detail="Manager reviewing request and checking team availability" timestamp="December 12, 2024 at 9:15 AM" title="Under Review" tone="review" />
                    <TimelineItem
                        detail="Request approved by Michael Chen with coverage arrangements"
                        isLast
                        timestamp="December 15, 2024 at 11:45 AM"
                        title="Approved"
                        tone="approved"
                    />
                </DetailSectionCard>

                <Pressable style={[styles.footerActionButton, styles.footerActionPrimary]}>
                    <MaterialCommunityIcons color="#FFFFFF" name="email" size={18} />
                    <Text style={[styles.footerActionText, styles.footerActionTextPrimary]}>Contact Manager</Text>
                </Pressable>
                <Pressable style={[styles.footerActionButton, styles.footerActionMuted]}>
                    <MaterialCommunityIcons color="#4D5867" name="calendar-month" size={18} />
                    <Text style={[styles.footerActionText, styles.footerActionTextMuted]}>Add to Calendar</Text>
                </Pressable>
            </View>
        </ConsultantScreenLayout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 24,
    },
    pagePadding: {
        paddingHorizontal: 16,
        paddingTop: 18,
    },
    heroCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E3E8EE',
        padding: 16,
        marginBottom: 16,
    },
    heroMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    heroDays: {
        color: '#6E7686',
        fontSize: 16,
        lineHeight: 22,
        marginLeft: 12,
    },
    heroActionRow: {
        flexDirection: 'row',
    },
    heroButton: {
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    heroButtonMuted: {
        backgroundColor: '#EEF1F5',
        marginRight: 10,
    },
    heroButtonDanger: {
        backgroundColor: '#FBE8E7',
    },
    heroButtonText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '700',
        marginLeft: 6,
    },
    heroButtonTextMuted: {
        color: '#4A5563',
    },
    heroButtonTextDanger: {
        color: '#D33A33',
    },
    fieldLabel: {
        color: '#414B5A',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        marginBottom: 6,
    },
    leaveTypeWrap: {
        marginBottom: 16,
    },
    leaveTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leaveTypeText: {
        color: '#242D39',
        fontSize: 16,
        lineHeight: 24,
        marginLeft: 6,
    },
    personRowWrap: {
        marginBottom: 16,
    },
    twoColumnRow: {
        flexDirection: 'row',
    },
    column: {
        flex: 1,
    },
    columnSpacer: {
        width: 14,
    },
    statusGroup: {
        marginTop: 2,
    },
    managerApprovalBox: {
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#BBF7D0',
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        padding: 14,
    },
    managerApprovalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    managerApprovalTitle: {
        color: '#1B7841',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        marginLeft: 8,
    },
    managerApprovalNote: {
        color: '#238147',
        fontSize: 14,
        lineHeight: 22,
    },
    footerActionButton: {
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 12,
    },
    footerActionPrimary: {
        backgroundColor: '#0A6B63',
    },
    footerActionMuted: {
        backgroundColor: '#F1F3F6',
    },
    footerActionText: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
        marginLeft: 8,
    },
    footerActionTextPrimary: {
        color: '#FFFFFF',
    },
    footerActionTextMuted: {
        color: '#4D5867',
    },
    footerActionTextBlue: {
        color: '#245FEA',
    },
});
