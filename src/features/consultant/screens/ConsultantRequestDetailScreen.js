import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { ConsultantRequestDetailScreenStyles as styles } from '../../../styles';
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
