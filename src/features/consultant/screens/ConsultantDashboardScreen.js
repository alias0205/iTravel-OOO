import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { consultantRecentRequests } from '../data/consultantRequests';
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
                        <MetricStatCard subtitle="days remaining" title="Annual Leave" value="3" />
                        <View style={styles.metricSpacer} />
                        <MetricStatCard subtitle="Requests" title="Pending" tone="neutral" value="2" />
                    </View>

                    {/* <View style={styles.statusQuickStatsWrap}>
                        <Text style={styles.statusQuickStatsTitle}>Quick Stats</Text>

                        <View style={styles.quickStatsRow}>
                            <QuickStatCard icon="calendar-month" subtitle="days off" title="This Month" value="3" />
                            <View style={styles.quickStatsSpacer} />
                            <QuickStatCard icon="clock-time-three-outline" subtitle="request" title="Pending" tone="purple" value="1" />
                        </View>
                    </View> */}
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

                {consultantRecentRequests.map((request) => (
                    <RequestCard
                        dateRange={request.dateRange}
                        detail={request.detail}
                        duration={request.duration}
                        icon={request.icon}
                        iconColor={request.iconColor}
                        key={request.id}
                        meta={request.meta}
                        onPress={() => navigation.navigate('ConsultantRequestDetail', { request })}
                        statusLabel={request.statusLabel}
                        statusTone={request.statusTone}
                        title={request.title}
                    />
                ))}

                {/* <DashboardSectionHeader title="Upcoming Time Off" />

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
                </View> */}
            </View>
        </ConsultantScreenLayout>
    );
}
