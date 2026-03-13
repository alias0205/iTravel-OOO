import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { consultantRequests } from '../data/consultantRequests';
import { ConsultantRequestListScreenStyles as styles } from '../../../styles';
import { RequestCard } from '../../../shared/components/dashboard/RequestCard';

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
            all: consultantRequests.length,
            pending: consultantRequests.filter((request) => request.statusTone === 'pending').length,
            approved: consultantRequests.filter((request) => request.statusTone === 'approved').length,
            rejected: consultantRequests.filter((request) => request.statusTone === 'rejected').length,
        }),
        []
    );

    const filteredRequests = useMemo(() => {
        if (activeTab === 'all') {
            return consultantRequests;
        }

        return consultantRequests.filter((request) => request.statusTone === activeTab);
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
                        onPress={() => navigation.navigate('ConsultantRequestDetail', { request })}
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
