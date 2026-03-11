import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';

const notificationTabs = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'requests', label: 'Requests' },
    { key: 'approvals', label: 'Approvals' },
];

const notifications = [
    {
        id: 'team-conflict',
        title: 'Team Conflict Detected',
        message: "Your leave request (Dec 18-20) overlaps with Tom Roberts' approved leave. Manager review required.",
        time: '2h ago',
        accent: '#EF4444',
        dot: '#EF4444',
        unread: true,
        category: 'requests',
        icon: 'alert',
        iconColor: '#DC2626',
        iconBackground: '#F7DADA',
        primaryAction: 'View Details',
        secondaryAction: 'Dismiss',
    },
    {
        id: 'request-approved',
        title: 'Request Approved',
        message: 'Your vacation request for Jan 15-19, 2025 has been approved by Sarah Martinez.',
        time: '5h ago',
        accent: '#0F766E',
        dot: '#0F766E',
        unread: true,
        category: 'approvals',
        icon: 'check-circle',
        iconColor: '#0F766E',
        iconBackground: '#E5EFEF',
        primaryAction: 'View Calendar',
    },
    {
        id: 'upcoming-reminder',
        title: 'Upcoming Leave Reminder',
        message: "Your approved vacation starts in 3 days (Jan 15, 2025). Don't forget to set your out-of-office message.",
        time: '1d ago',
        accent: '#EAB308',
        dot: '#D4A200',
        unread: true,
        category: 'approvals',
        icon: 'clock',
        iconColor: '#A16207',
        iconBackground: '#F5E9AF',
        primaryAction: 'Set OOO Message',
        secondaryAction: 'Snooze',
    },
    {
        id: 'request-submitted',
        title: 'Request Submitted Successfully',
        message: 'Your sick leave request for Dec 12, 2024 has been submitted and is pending manager approval.',
        time: '2d ago',
        accent: '#3B82F6',
        dot: '#3B82F6',
        unread: true,
        category: 'requests',
        icon: 'send',
        iconColor: '#2563EB',
        iconBackground: '#D9E6FB',
        primaryAction: 'Track Status',
    },
    {
        id: 'changes-requested',
        title: 'Changes Requested',
        message: 'Your manager requested changes to your leave request (Feb 10-14). Please review and update.',
        time: '2d ago',
        accent: '#F97316',
        dot: '#F97316',
        unread: true,
        category: 'requests',
        icon: 'pencil-box-outline',
        iconColor: '#EA580C',
        iconBackground: '#F7E1C7',
        primaryAction: 'Review Request',
    },
    {
        id: 'balance-update',
        title: 'Leave Balance Update',
        message: 'Your annual leave balance has been updated. You now have 18 days available for 2025.',
        time: '3d ago',
        accent: '#D1D5DB',
        dot: null,
        unread: false,
        category: 'approvals',
        icon: 'information',
        iconColor: '#6B7280',
        iconBackground: '#EFEFF1',
        primaryAction: 'View Balance',
        muted: true,
    },
    {
        id: 'team-member-return',
        title: 'Team Member Return',
        message: 'Sarah Johnson returned from leave today. Welcome back message sent.',
        time: '4d ago',
        accent: '#D1D5DB',
        dot: null,
        unread: false,
        category: 'approvals',
        icon: 'calendar-check',
        iconColor: '#4B5563',
        iconBackground: '#EFEFF1',
    },
    {
        id: 'policy-update',
        title: 'Policy Update',
        message: 'Company leave policy has been updated. Please review the new guidelines.',
        time: '1w ago',
        accent: '#D1D5DB',
        dot: null,
        unread: false,
        category: 'approvals',
        icon: 'bell',
        iconColor: '#4B5563',
        iconBackground: '#EFEFF1',
        primaryAction: 'Read Policy',
        muted: true,
    },
];

function NotificationCard({ notification }) {
    return (
        <View style={[styles.notificationCard, { borderLeftColor: notification.accent }]}>
            <View style={styles.notificationHeaderRow}>
                <View style={[styles.notificationIconWrap, { backgroundColor: notification.iconBackground }]}>
                    <MaterialCommunityIcons color={notification.iconColor} name={notification.icon} size={20} />
                </View>

                <View style={styles.notificationCopy}>
                    <View style={styles.notificationTitleRow}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        <View style={styles.notificationMetaRow}>
                            <Text style={styles.notificationTime}>{notification.time}</Text>
                            {notification.dot ? <View style={[styles.notificationDot, { backgroundColor: notification.dot }]} /> : null}
                        </View>
                    </View>

                    <Text style={styles.notificationMessage}>{notification.message}</Text>

                    {notification.primaryAction ? (
                        <View style={styles.notificationActionRow}>
                            <Pressable style={[styles.actionButton, notification.muted ? styles.actionButtonMuted : styles.actionButtonPrimary]}>
                                <Text style={[styles.actionButtonText, notification.muted ? styles.actionButtonTextMuted : styles.actionButtonTextPrimary]}>
                                    {notification.primaryAction}
                                </Text>
                            </Pressable>
                            {notification.secondaryAction ? (
                                <Pressable style={[styles.actionButton, styles.actionButtonMuted, styles.secondaryButton]}>
                                    <Text style={[styles.actionButtonText, styles.actionButtonTextMuted]}>{notification.secondaryAction}</Text>
                                </Pressable>
                            ) : null}
                        </View>
                    ) : null}
                </View>
            </View>
        </View>
    );
}

export function ConsultantNotificationsScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('all');

    const tabCounts = useMemo(
        () => ({
            all: notifications.length,
            unread: notifications.filter((notification) => notification.unread).length,
            requests: notifications.filter((notification) => notification.category === 'requests').length,
            approvals: notifications.filter((notification) => notification.category === 'approvals').length,
        }),
        []
    );

    const filteredNotifications = useMemo(() => {
        if (activeTab === 'all') {
            return notifications;
        }

        if (activeTab === 'unread') {
            return notifications.filter((notification) => notification.unread);
        }

        return notifications.filter((notification) => notification.category === activeTab);
    }, [activeTab]);

    return (
        <ConsultantScreenLayout
            activeNavKey="notifications"
            headerSubtitle="Stay updated with alerts and approvals"
            headerTitle="Notifications"
            navigation={navigation}
            notificationCount={3}
            scrollContentStyle={styles.scrollContent}
            showBackButton
            showNotification={false}
        >
            <View style={styles.tabRow}>
                {notificationTabs.map((tab) => (
                    <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)} style={[styles.tabItem, activeTab === tab.key ? styles.tabItemActive : null]}>
                        <Text style={[styles.tabLabel, activeTab === tab.key ? styles.tabLabelActive : null]}>{tab.label}</Text>
                        {tabCounts[tab.key] ? (
                            <View style={[styles.tabCountBadge, activeTab === tab.key ? styles.tabCountBadgeActive : null]}>
                                <Text style={[styles.tabCountText, activeTab === tab.key ? styles.tabCountTextActive : null]}>{tabCounts[tab.key]}</Text>
                            </View>
                        ) : null}
                    </Pressable>
                ))}
            </View>

            <View style={styles.pagePadding}>
                {filteredNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                ))}
                {filteredNotifications.length === 0 ? <Text style={styles.emptyState}>No notifications in this category.</Text> : null}
            </View>
        </ConsultantScreenLayout>
    );
}

const styles = StyleSheet.create({
    settingsButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabRow: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E9EF',
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        marginRight: 18,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabItemActive: {
        borderBottomColor: '#0A6B63',
    },
    tabLabel: {
        color: '#4B5563',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '700',
    },
    tabLabelActive: {
        color: '#0A6B63',
    },
    tabCountBadge: {
        minWidth: 24,
        height: 24,
        paddingHorizontal: 6,
        borderRadius: 999,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    tabCountBadgeActive: {
        backgroundColor: '#D9F1EA',
    },
    tabCountText: {
        color: '#4B5563',
        fontSize: 12,
        lineHeight: 14,
        fontWeight: '700',
    },
    tabCountTextActive: {
        color: '#0A6B63',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    pagePadding: {
        paddingHorizontal: 16,
        paddingTop: 18,
    },
    emptyState: {
        color: '#6B7280',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        paddingVertical: 30,
    },
    notificationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E9EF',
        borderLeftWidth: 4,
        padding: 14,
        marginBottom: 14,
    },
    notificationHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    notificationIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    notificationCopy: {
        flex: 1,
    },
    notificationTitleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    notificationTitle: {
        color: '#1F2937',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
        flex: 1,
        paddingRight: 10,
    },
    notificationMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationTime: {
        color: '#6B7280',
        fontSize: 13,
        lineHeight: 18,
    },
    notificationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
    },
    notificationMessage: {
        color: '#4B5563',
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 14,
    },
    notificationActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        minHeight: 34,
        borderRadius: 10,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonPrimary: {
        backgroundColor: '#0A6B63',
    },
    actionButtonMuted: {
        backgroundColor: '#E5E7EB',
    },
    secondaryButton: {
        marginLeft: 10,
    },
    actionButtonText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '700',
    },
    actionButtonTextPrimary: {
        color: '#FFFFFF',
    },
    actionButtonTextMuted: {
        color: '#4B5563',
    },
});
