import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { ConsultantRequestListScreenStyles as styles } from '../../../styles';
import { RequestCard } from '../../../shared/components/dashboard/RequestCard';

const requests = [
    {
        id: 'annual-pending-dec',
        title: 'Annual Leave',
        dateRange: 'Dec 23 - Dec 27, 2024',
        duration: '5 days',
        detail: 'Christmas holidays',
        meta: 'Submitted 2 days ago',
        icon: 'beach',
        iconColor: 'blue',
        statusLabel: 'Pending',
        statusTone: 'pending',
    },
    {
        id: 'sick-approved-nov',
        title: 'Sick Leave',
        dateRange: 'Nov 18 - Nov 19, 2024',
        duration: '2 days',
        detail: 'Medical recovery',
        meta: 'Approved by T. Robb',
        icon: 'account-injury',
        iconColor: 'purple',
        statusLabel: 'Approved',
        statusTone: 'approved',
    },
    {
        id: 'annual-rejected-nov',
        title: 'Annual Leave',
        dateRange: 'Nov 10 - Nov 12, 2024',
        duration: '3 days',
        detail: 'Personal time',
        meta: 'Declined · Insufficient coverage',
        icon: 'close',
        iconColor: 'red',
        statusLabel: 'Rejected',
        statusTone: 'rejected',
    },
    {
        id: 'vacation-approved-oct',
        title: 'Vacation Leave',
        dateRange: 'Oct 02 - Oct 04, 2024',
        duration: '3 days',
        detail: 'Family trip',
        meta: 'Approved by M. Chen',
        icon: 'airplane-takeoff',
        iconColor: 'blue',
        statusLabel: 'Approved',
        statusTone: 'approved',
    },
    {
        id: 'personal-pending-jan',
        title: 'Personal Leave',
        dateRange: 'Jan 14 - Jan 14, 2025',
        duration: '1 day',
        detail: 'Personal appointment',
        meta: 'Awaiting manager review',
        icon: 'account-heart-outline',
        iconColor: 'purple',
        statusLabel: 'Pending',
        statusTone: 'pending',
    },
];

const requestTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Reject' },
];

export function ConsultantRequestListScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('all');

    const tabCounts = useMemo(
        () => ({
            all: requests.length,
            pending: requests.filter((request) => request.statusTone === 'pending').length,
            approved: requests.filter((request) => request.statusTone === 'approved').length,
            rejected: requests.filter((request) => request.statusTone === 'rejected').length,
        }),
        []
    );

    const filteredRequests = useMemo(() => {
        if (activeTab === 'all') {
            return requests;
        }

        return requests.filter((request) => request.statusTone === activeTab);
    }, [activeTab]);
    return (
        <ConsultantScreenLayout
            activeNavKey="requests"
            headerSubtitle="Track every leave submission and status change"
            headerTitle="All Requests"
            navigation={navigation}
            notificationCount={3}
            scrollContentStyle={styles.scrollContent}
            showBackButton
        >
            <ScrollView contentContainerStyle={styles.tabRow} horizontal showsHorizontalScrollIndicator={false}>
                {requestTabs.map((tab) => (
                    <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)} style={[styles.tabItem, activeTab === tab.key ? styles.tabItemActive : null]}>
                        <Text style={[styles.tabLabel, activeTab === tab.key ? styles.tabLabelActive : null]}>{tab.label}</Text>
                        <View style={[styles.tabCountBadge, activeTab === tab.key ? styles.tabCountBadgeActive : null]}>
                            <Text style={[styles.tabCountText, activeTab === tab.key ? styles.tabCountTextActive : null]}>{tabCounts[tab.key]}</Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>

            <View style={styles.pagePadding}>
                {filteredRequests.map((request) => (
                    <RequestCard
                        key={request.id}
                        dateRange={request.dateRange}
                        detail={request.detail}
                        duration={request.duration}
                        icon={request.icon}
                        iconColor={request.iconColor}
                        meta={request.meta}
                        onPress={() => navigation.navigate('ConsultantRequestDetail')}
                        statusLabel={request.statusLabel}
                        statusTone={request.statusTone}
                        title={request.title}
                    />
                ))}
                {filteredRequests.length === 0 ? <Text style={styles.emptyState}>No requests in this category.</Text> : null}
            </View>
        </ConsultantScreenLayout>
    );
}
