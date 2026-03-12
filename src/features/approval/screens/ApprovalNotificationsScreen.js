import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { ApprovalNotificationsScreenStyles as styles } from '../../../styles';

const notificationTabs = [
    { key: 'all', label: 'All' },
    { key: 'approvals', label: 'Approvals' },
    { key: 'requests', label: 'Requests' },
];

const approvalNotifications = [
    {
        id: 'new-leave-request',
        title: 'New Leave Request',
        message: 'Sarah Johnson submitted an annual leave request for Dec 20-27, 2024',
        time: '2 hours ago',
        category: 'approvals',
        unread: true,
        accent: '#F97316',
        dot: '#F97316',
        icon: 'clock-time-three',
        iconColor: '#EA580C',
        iconBackground: '#F6E6D2',
        actionLabel: 'Review',
        request: {
            id: 'sarah-johnson-annual',
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
            attachmentName: 'flight-confirmation.pdf',
            attachmentCountLabel: '1 file',
            daysAvailable: '15',
            daysRequested: '8',
            daysRemaining: '7',
            usedThisYear: '10',
            annualLeaveUsage: '18/25 days',
            annualLeaveUsagePercent: 72,
            coverageAlert: 'No backup assigned for ongoing Christmas campaign project. Consider assigning coverage.',
            teamMemberName: 'Mark Wilson',
            teamMemberLeave: 'Dec 23-26 • Annual Leave',
            dependencyTitle: 'Q4 Campaign Review',
            dependencyDue: 'Due Dec 22',
            policyNotice: 'This request falls during the holiday blackout period (Dec 20-27). Special approval may be required from HR.',
        },
    },
    {
        id: 'team-member-request',
        title: 'Team Member Request',
        message: 'Michael Chen requested sick leave for Dec 18-19, 2024',
        time: '4 hours ago',
        category: 'requests',
        unread: true,
        accent: '#3B82F6',
        dot: '#3B82F6',
        icon: 'account-plus',
        iconColor: '#2563EB',
        iconBackground: '#DCE8FA',
        actionLabel: 'View',
        request: {
            id: 'michael-chen-sick',
            avatarLabel: 'MC',
            name: 'Michael Chen',
            role: 'Software Engineer II',
            department: 'Engineering',
            office: 'Singapore Office',
            manager: 'Priya Kapoor',
            employeeId: 'ENG-2021-118',
            leaveLabel: 'Sick Leave',
            leaveToneKey: 'sick',
            dateRange: 'Dec 18 - Dec 19, 2024',
            duration: '2 days',
            durationLabel: '2 business days',
            submittedAt: 'Dec 17, 2024 at 8:10 AM',
            reason: 'Medical recovery time requested after outpatient treatment.',
            attachmentName: 'medical-note.pdf',
            attachmentCountLabel: '1 file',
            daysAvailable: '10',
            daysRequested: '2',
            daysRemaining: '8',
            usedThisYear: '4',
            annualLeaveUsage: '4/12 days',
            annualLeaveUsagePercent: 33,
            coverageAlert: 'Sprint QA sign-off needs reassignment for the release branch.',
            teamMemberName: 'Alyssa Tan',
            teamMemberLeave: 'Dec 18-18 • Remote Work',
            dependencyTitle: 'Release Candidate QA',
            dependencyDue: 'Due Dec 19',
            policyNotice: 'Sick leave over one day may require HR verification within 48 hours.',
        },
    },
    {
        id: 'request-approved',
        title: 'Request Approved',
        message: "Your approval for Emily Rodriguez's business trip has been processed",
        time: '6 hours ago',
        category: 'approvals',
        unread: false,
        accent: '#22C55E',
        dot: null,
        icon: 'check',
        iconColor: '#16A34A',
        iconBackground: '#D7EEDD',
        actionLabel: 'Details',
    },
    {
        id: 'policy-alert',
        title: 'Policy Alert',
        message: "David Kumar's remote work request conflicts with team meeting schedule",
        time: '8 hours ago',
        category: 'approvals',
        unread: true,
        accent: '#A855F7',
        dot: '#A855F7',
        icon: 'alert',
        iconColor: '#9333EA',
        iconBackground: '#E8DDF8',
        actionLabel: 'Resolve',
        request: {
            id: 'david-kumar-remote',
            avatarLabel: 'DK',
            name: 'David Kumar',
            role: 'Finance Analyst',
            department: 'Finance',
            office: 'Dubai Office',
            manager: 'Leila Hassan',
            employeeId: 'FIN-2020-084',
            leaveLabel: 'Remote Work',
            leaveToneKey: 'remote',
            dateRange: 'Dec 21 - Dec 23, 2024',
            duration: '3 days',
            durationLabel: '3 business days',
            submittedAt: 'Dec 14, 2024 at 4:05 PM',
            reason: 'Remote support requested while assisting family relocation logistics.',
            attachmentName: 'connectivity-plan.pdf',
            attachmentCountLabel: '1 file',
            daysAvailable: 'N/A',
            daysRequested: '3',
            daysRemaining: 'N/A',
            usedThisYear: '12',
            annualLeaveUsage: '12 remote days used',
            annualLeaveUsagePercent: 60,
            coverageAlert: 'Remote work request overlaps with on-site budget review meeting.',
            teamMemberName: 'Nadia Rahman',
            teamMemberLeave: 'Dec 22-23 • Annual Leave',
            dependencyTitle: 'Budget Review Workshop',
            dependencyDue: 'Due Dec 23',
            policyNotice: 'On-site attendance may still be required for executive finance reviews.',
        },
    },
    {
        id: 'urgent-coverage',
        title: 'Urgent: Coverage Needed',
        message: "Jessica Lee's leave request requires immediate coverage assignment",
        time: '12 hours ago',
        category: 'requests',
        unread: true,
        accent: '#EF4444',
        dot: '#EF4444',
        icon: 'clock-alert',
        iconColor: '#DC2626',
        iconBackground: '#F4DADC',
        actionLabel: 'Assign',
        request: {
            id: 'jessica-lee-annual',
            avatarLabel: 'JL',
            name: 'Jessica Lee',
            role: 'HR Business Partner',
            department: 'HR Department',
            office: 'Toronto Office',
            manager: 'Monica Reed',
            employeeId: 'HR-2017-029',
            leaveLabel: 'Annual Leave',
            leaveToneKey: 'annual',
            dateRange: 'Jan 02 - Jan 05, 2025',
            duration: '4 days',
            durationLabel: '4 business days',
            submittedAt: 'Dec 13, 2024 at 11:20 AM',
            reason: 'Planned family visit following year-end onboarding closeout.',
            attachmentName: 'coverage-handoff.docx',
            attachmentCountLabel: '1 file',
            daysAvailable: '11',
            daysRequested: '4',
            daysRemaining: '7',
            usedThisYear: '14',
            annualLeaveUsage: '14/18 days',
            annualLeaveUsagePercent: 78,
            coverageAlert: 'New hire onboarding queue needs ownership during absence.',
            teamMemberName: 'Paul Bennett',
            teamMemberLeave: 'Jan 03-03 • Conference',
            dependencyTitle: 'January Onboarding Wave',
            dependencyDue: 'Due Jan 04',
            policyNotice: 'HR coverage must be confirmed before multi-day annual leave is approved.',
        },
    },
    {
        id: 'system-update',
        title: 'System Update',
        message: 'Leave balance calculations have been updated for Q4 2024',
        time: '1 day ago',
        category: 'all',
        unread: false,
        accent: '#D1D5DB',
        dot: null,
        icon: 'information',
        iconColor: '#4B5563',
        iconBackground: '#ECEEF2',
        actionLabel: 'Info',
    },
    {
        id: 'holiday-schedule',
        title: 'Holiday Schedule',
        message: 'Company holiday calendar updated with 2025 dates',
        time: '2 days ago',
        category: 'all',
        unread: false,
        accent: '#D1D5DB',
        dot: null,
        icon: 'calendar',
        iconColor: '#4B5563',
        iconBackground: '#ECEEF2',
        actionLabel: 'View',
    },
    {
        id: 'monthly-reminder',
        title: 'Reminder',
        message: 'Monthly consuldant leave report due by end of week',
        time: '3 days ago',
        category: 'all',
        unread: false,
        accent: '#D1D5DB',
        dot: null,
        icon: 'bell-ring',
        iconColor: '#4B5563',
        iconBackground: '#ECEEF2',
        actionLabel: 'Generate',
    },
];

function ApprovalNotificationCard({ item, onActionPress }) {
    return (
        <View style={[styles.notificationCard, { borderLeftColor: item.accent }]}>
            <View style={styles.notificationRow}>
                <View style={[styles.notificationIconWrap, { backgroundColor: item.iconBackground }]}>
                    <MaterialCommunityIcons color={item.iconColor} name={item.icon} size={18} />
                </View>

                <View style={styles.notificationCopy}>
                    <View style={styles.notificationTitleRow}>
                        <Text style={styles.notificationTitle}>{item.title}</Text>
                        {item.dot ? <View style={[styles.notificationDot, { backgroundColor: item.dot }]} /> : null}
                    </View>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                    <View style={styles.notificationFooterRow}>
                        <Text style={styles.notificationTime}>{item.time}</Text>
                        <Pressable onPress={onActionPress}>
                            <Text style={styles.notificationAction}>{item.actionLabel}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

export function ApprovalNotificationsScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('all');

    const unreadCount = useMemo(() => approvalNotifications.filter((item) => item.unread).length, []);

    const tabCounts = useMemo(
        () => ({
            all: approvalNotifications.length,
            approvals: approvalNotifications.filter((item) => item.category === 'approvals').length,
            requests: approvalNotifications.filter((item) => item.category === 'requests').length,
        }),
        []
    );

    const filteredNotifications = useMemo(() => {
        if (activeTab === 'all') {
            return approvalNotifications;
        }

        return approvalNotifications.filter((item) => item.category === activeTab);
    }, [activeTab]);

    return (
        <ApprovalScreenLayout
            activeNavKey="notifications"
            headerRight={
                <Pressable>
                    <Text style={styles.headerAction}>Mark all read</Text>
                </Pressable>
            }
            headerSubtitle="Activity & Updates"
            headerTitle="Notifications"
            navigation={navigation}
            notificationCount={8}
            showBackButton
            scrollContentStyle={styles.scrollContent}
        >
            <ScrollView contentContainerStyle={styles.tabRow} horizontal showsHorizontalScrollIndicator={false}>
                {notificationTabs.map((tab) => (
                    <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)} style={[styles.tabItem, activeTab === tab.key ? styles.tabItemActive : null]}>
                        <Text style={[styles.tabLabel, activeTab === tab.key ? styles.tabLabelActive : null]}>{tab.label}</Text>
                        <View style={[styles.tabCountBadge, activeTab === tab.key ? styles.tabCountBadgeActive : null]}>
                            <Text style={[styles.tabCountText, activeTab === tab.key ? styles.tabCountTextActive : null]}>{tabCounts[tab.key]}</Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>

            <View style={styles.pagePadding}>
                <View style={styles.subHeaderRow}>
                    <Text style={styles.subHeaderText}>{unreadCount} unread notifications</Text>
                    <Pressable>
                        <Text style={styles.clearAllText}>Clear all</Text>
                    </Pressable>
                </View>

                {filteredNotifications.map((item) => (
                    <ApprovalNotificationCard item={item} key={item.id} onActionPress={() => navigation.navigate('ApprovalRequestReview', { request: item.request })} />
                ))}
            </View>
        </ApprovalScreenLayout>
    );
}
