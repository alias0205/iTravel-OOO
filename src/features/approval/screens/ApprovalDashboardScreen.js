import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { ApprovalMetricCard } from '../../../shared/components/dashboard/ApprovalMetricCard';
import { ApprovalRequestCard } from '../../../shared/components/dashboard/ApprovalRequestCard';
import { DashboardBottomNav } from '../../../shared/components/dashboard/DashboardBottomNav';
import { DashboardFilterChip } from '../../../shared/components/dashboard/DashboardFilterChip';
import { DashboardSearchInput } from '../../../shared/components/dashboard/DashboardSearchInput';
import { DashboardSectionHeader } from '../../../shared/components/dashboard/DashboardSectionHeader';
import { DashboardTopBar } from '../../../shared/components/dashboard/DashboardTopBar';

const approvalNavItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'view-dashboard-outline' },
    { key: 'calendar', label: 'Calendar', icon: 'calendar-month-outline' },
    { key: 'approvals', label: 'Approvals', icon: 'clipboard-check-outline', badge: 1 },
    { key: 'settings', label: 'Settings', icon: 'cog-outline' },
];

export function ApprovalDashboardScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <DashboardTopBar avatarLabel="MJ" notificationCount={5} subtitle="Approval Dashboard" title="iTravel" variant="light" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.pagePadding}>
                    <DashboardSearchInput placeholder="Search by name or department..." />

                    <View style={styles.filtersRow}>
                        <DashboardFilterChip active label="All" />
                        <DashboardFilterChip label="Department" />
                        <DashboardFilterChip label="Status" />
                    </View>

                    <View style={styles.metricsRow}>
                        <ApprovalMetricCard icon="clock-time-three" title="Pending Approvals" tone="orange" value="5" />
                        <View style={styles.metricsSpacer} />
                        <ApprovalMetricCard icon="account-group" subtitle="Team Out Today" title="Team Out Today" tone="blue" value="2" />
                    </View>

                    <DashboardSectionHeader actionLabel="View All" title="Recent Requests" />

                    <ApprovalRequestCard
                        avatarLabel="SJ"
                        dateRange="Dec 20 - Dec 27, 2024"
                        department="Marketing Department"
                        duration="8 days"
                        leaveLabel="Annual Leave"
                        leaveToneKey="annual"
                        name="Sarah Johnson"
                    />
                    <ApprovalRequestCard
                        avatarLabel="MC"
                        dateRange="Dec 18 - Dec 19, 2024"
                        department="Engineering"
                        duration="2 days"
                        leaveLabel="Sick Leave"
                        leaveToneKey="sick"
                        name="Michael Chen"
                    />
                    <ApprovalRequestCard
                        avatarLabel="ER"
                        dateRange="Jan 05 - Jan 10, 2025"
                        department="Sales Department"
                        duration="6 days"
                        leaveLabel="Business Trip"
                        leaveToneKey="business"
                        name="Emily Rodriguez"
                    />
                    <ApprovalRequestCard
                        avatarLabel="DK"
                        dateRange="Dec 21 - Dec 23, 2024"
                        department="Finance"
                        duration="3 days"
                        leaveLabel="Remote Work"
                        leaveToneKey="remote"
                        name="David Kumar"
                    />
                    <ApprovalRequestCard
                        avatarLabel="JL"
                        dateRange="Jan 02 - Jan 05, 2025"
                        department="HR Department"
                        duration="4 days"
                        leaveLabel="Annual Leave"
                        leaveToneKey="annual"
                        name="Jessica Lee"
                    />
                </View>
            </ScrollView>

            <DashboardBottomNav activeKey="approvals" items={approvalNavItems} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F4F5F7',
    },
    scrollContent: {
        paddingBottom: 14,
    },
    pagePadding: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    filtersRow: {
        flexDirection: 'row',
        marginBottom: 18,
    },
    metricsRow: {
        flexDirection: 'row',
        marginBottom: 26,
    },
    metricsSpacer: {
        width: 14,
    },
});
