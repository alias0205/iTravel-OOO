import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { ConsultantDashboardScreenStyles as styles } from '../../../styles';
import { DashboardSectionHeader } from '../../../shared/components/dashboard/DashboardSectionHeader';
import { MetricStatCard } from '../../../shared/components/dashboard/MetricStatCard';
import { QuickStatCard } from '../../../shared/components/dashboard/QuickStatCard';
import { RequestCard } from '../../../shared/components/dashboard/RequestCard';

export function ConsultantDashboardScreen({ navigation }) {
    return (
        <ConsultantScreenLayout
            activeNavKey="home"
            headerSubtitle="Manage your availability and time off"
            headerTitle="Welcome back, Sarah"
            navigation={navigation}
            notificationCount={3}
            scrollContentStyle={styles.scrollContent}
            topBarVariant="brand"
        >
            <View style={styles.pagePadding}>
                <View style={styles.statusCard}>
                    <View style={styles.statusHeaderRow}>
                        <Text style={styles.cardHeading}>Current Status</Text>

                        <View style={styles.statusHeaderIcon}>
                            <MaterialCommunityIcons color="#16A34A" name="office-building" size={18} />
                        </View>
                    </View>

                    <View style={styles.statusBanner}>
                        <View>
                            <Text style={styles.statusTitle}>In Office</Text>
                            <Text style={styles.statusSubtitle}>Available for assignments</Text>
                        </View>
                        <View style={styles.statusDot} />
                    </View>

                    <View style={styles.metricRow}>
                        <MetricStatCard subtitle="days remaining" title="Annual Leave" value="18" />
                        <View style={styles.metricSpacer} />
                        <MetricStatCard subtitle="days taken" title="Used This Year" tone="neutral" value="7" />
                    </View>
                </View>

                <Pressable onPress={() => navigation.navigate('ConsultantNewRequest')} style={styles.primaryActionCard}>
                    <View style={styles.primaryActionIconWrap}>
                        <MaterialCommunityIcons color="#FFFFFF" name="plus" size={22} />
                    </View>

                    <View style={styles.primaryActionCopy}>
                        <Text style={styles.primaryActionTitle}>New OOO Request</Text>
                        <Text style={styles.primaryActionSubtitle}>Submit time off request</Text>
                    </View>

                    <MaterialCommunityIcons color="#FFFFFF" name="chevron-right" size={22} />
                </Pressable>

                <DashboardSectionHeader actionLabel="View All" onActionPress={() => navigation.navigate('ConsultantRequestList')} title="Recent Requests" />

                <RequestCard
                    dateRange="Dec 23 - Dec 27, 2024"
                    detail="Christmas holidays"
                    duration="5 days"
                    icon="beach"
                    iconColor="blue"
                    meta="Submitted 2 days ago"
                    onPress={() => navigation.navigate('ConsultantRequestDetail')}
                    statusLabel="Pending"
                    statusTone="pending"
                    title="Annual Leave"
                />
                <RequestCard
                    dateRange="Nov 18 - Nov 19, 2024"
                    detail="Medical recovery"
                    duration="2 days"
                    icon="account-injury"
                    iconColor="purple"
                    meta="Approved by T. Robb"
                    onPress={() => navigation.navigate('ConsultantRequestDetail')}
                    statusLabel="Approved"
                    statusTone="approved"
                    title="Sick Leave"
                />
                <RequestCard
                    dateRange="Nov 10 - Nov 12, 2024"
                    detail="Personal time"
                    duration="3 days"
                    icon="close"
                    iconColor="red"
                    meta="Declined · Insufficient coverage"
                    onPress={() => navigation.navigate('ConsultantRequestDetail')}
                    statusLabel="Rejected"
                    statusTone="rejected"
                    title="Annual Leave"
                />

                <DashboardSectionHeader title="Quick Stats" />

                <View style={styles.quickStatsRow}>
                    <QuickStatCard icon="calendar-month" subtitle="days off" title="This Month" value="3" />
                    <View style={styles.quickStatsSpacer} />
                    <QuickStatCard icon="clock-time-three-outline" subtitle="request" title="Pending" tone="purple" value="1" />
                </View>

                <DashboardSectionHeader title="Upcoming Time Off" />

                <View style={styles.upcomingCard}>
                    <View style={styles.upcomingTopRow}>
                        <View>
                            <Text style={styles.upcomingLabel}>Next Absence</Text>
                            <Text style={styles.upcomingDates}>Dec 23 - Dec 27</Text>
                        </View>

                        <View style={styles.upcomingIconWrap}>
                            <MaterialCommunityIcons color="#FFFFFF" name="calendar-month" size={22} />
                        </View>
                    </View>

                    <View style={styles.upcomingMetaRow}>
                        <MaterialCommunityIcons color="#D8F2ED" name="beach" size={16} />
                        <Text style={styles.upcomingMetaText}>Annual Leave · 5 days</Text>
                    </View>
                </View>
            </View>
        </ConsultantScreenLayout>
    );
}
