import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { ConsultantNotificationsScreenStyles as styles } from '../../../styles';

const notificationTabs = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
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

const notificationsByTab = {
    all: notifications,
    unread: notifications.filter((notification) => notification.unread),
};

const tabCounts = {
    all: notificationsByTab.all.length,
    unread: notificationsByTab.unread.length,
};

const unreadCount = notificationsByTab.unread.length;

const NotificationCard = memo(function NotificationCard({ notification }) {
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
});

export function ConsultantNotificationsScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('all');
    const filteredNotifications = useMemo(() => notificationsByTab[activeTab] || notificationsByTab.all, [activeTab]);
    const renderNotificationItem = useCallback(({ item }) => <NotificationCard notification={item} />, []);
    const keyExtractor = useCallback((item) => item.id, []);

    return (
        <ConsultantScreenLayout
            activeNavKey="notifications"
            headerRight={
                <Pressable>
                    <Text style={styles.headerAction}>Mark all read</Text>
                </Pressable>
            }
            headerSubtitle="Stay updated with alerts"
            headerTitle="Notifications"
            navigation={navigation}
            notificationCount={3}
            showBackButton
            showNotification={false}
            useScrollView={false}
        >
            <View style={styles.tabRow}>
                {notificationTabs.map((tab, index) => (
                    <Pressable
                        key={tab.key}
                        onPress={() => setActiveTab(tab.key)}
                        style={[
                            styles.tabItem,
                            index < notificationTabs.length - 1 ? styles.tabItemSpacing : null,
                            activeTab === tab.key ? styles.tabItemActive : null,
                        ]}
                    >
                        <Text style={[styles.tabLabel, activeTab === tab.key ? styles.tabLabelActive : null]}>{tab.label}</Text>
                        {tabCounts[tab.key] ? (
                            <View style={[styles.tabCountBadge, activeTab === tab.key ? styles.tabCountBadgeActive : null]}>
                                <Text style={[styles.tabCountText, activeTab === tab.key ? styles.tabCountTextActive : null]}>{tabCounts[tab.key]}</Text>
                            </View>
                        ) : null}
                    </Pressable>
                ))}
            </View>

            <FlatList
                contentContainerStyle={[styles.pagePadding, styles.scrollContent]}
                data={filteredNotifications}
                extraData={activeTab}
                keyExtractor={keyExtractor}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <View style={styles.subHeaderRow}>
                        <Text style={styles.subHeaderText}>{unreadCount} unread notifications</Text>
                        <Pressable>
                            <Text style={styles.clearAllText}>Clear all</Text>
                        </Pressable>
                    </View>
                }
                ListEmptyComponent={<Text style={styles.emptyState}>No notifications in this category.</Text>}
                renderItem={renderNotificationItem}
                removeClippedSubviews
                showsVerticalScrollIndicator={false}
            />
        </ConsultantScreenLayout>
    );
}
