import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { getApprovalDurationBreakdown } from '../../approval/utils/approvalDurationUtils';
import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { fetchOutOfOfficeRequestCounts, fetchOutOfOfficeRequests } from '../utils/outOfOfficeApi';
import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { ConsultantDashboardScreenStyles as styles } from '../../../styles';
import { DashboardSectionHeader } from '../../../shared/components/dashboard/DashboardSectionHeader';
import { MetricStatCard } from '../../../shared/components/dashboard/MetricStatCard';
import { RequestCard } from '../../../shared/components/dashboard/RequestCard';

function getCompactDurationBreakdown(request) {
    const durationBreakdown = getApprovalDurationBreakdown(request);

    if (!durationBreakdown) {
        return request.detail;
    }

    return `${durationBreakdown.totalDays}/${durationBreakdown.weekendDays}/${durationBreakdown.bankHolidayDays}`;
}

export function ConsultantDashboardScreen({ navigation }) {
    const { authProfile, session, signOut } = useAuthSession();
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [recentRequests, setRecentRequests] = useState([]);
    const [requestCounts, setRequestCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 });

    const loadDashboard = useCallback(() => {
        if (!session?.token) {
            setRecentRequests([]);
            setRequestCounts({ all: 0, pending: 0, approved: 0, rejected: 0 });
            setIsLoading(false);
            return () => {};
        }

        let isActive = true;

        void (async () => {
            setIsLoading(true);
            setLoadError('');

            try {
                const [countsResult, requestsResult] = await Promise.all([
                    fetchOutOfOfficeRequestCounts({ token: session.token }),
                    fetchOutOfOfficeRequests({ page: 1, perPage: 5, token: session.token }),
                ]);

                if (!isActive) {
                    return;
                }

                setRequestCounts(countsResult);
                setRecentRequests(requestsResult.items);
            } catch (error) {
                if (!isActive) {
                    return;
                }

                if (error?.status === 401) {
                    await signOut();
                    navigation?.reset({
                        index: 0,
                        routes: [{ name: 'Splash' }],
                    });
                    return;
                }

                setLoadError(error?.message || 'Unable to load your dashboard right now.');
                setRecentRequests([]);
                setRequestCounts({ all: 0, pending: 0, approved: 0, rejected: 0 });
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            isActive = false;
        };
    }, [navigation, session?.token, signOut]);

    useFocusEffect(loadDashboard);

    const activeApprovedRequest = useMemo(() => {
        const now = Date.now();

        return recentRequests.find((request) => {
            if (request.statusTone !== 'approved') {
                return false;
            }

            const start = new Date(request?.raw?.start_date || '').getTime();
            const end = new Date(request?.raw?.end_date || '').getTime();

            if (Number.isNaN(start) || Number.isNaN(end)) {
                return false;
            }

            return start <= now && end >= now;
        });
    }, [recentRequests]);

    const statusTitle = activeApprovedRequest ? 'Out of Office' : 'In Office';
    const statusSubtitle = activeApprovedRequest ? activeApprovedRequest.dateRange : 'Available for assignments';
    const statusAccentColor = activeApprovedRequest ? '#D97706' : '#16A34A';
    const statusIconName = activeApprovedRequest ? 'airplane' : 'office-building';
    const statusIconWrapStyle = activeApprovedRequest ? styles.statusHeaderIconWarning : null;
    const statusBannerStyle = activeApprovedRequest ? styles.statusBannerWarning : null;
    const statusTitleStyle = activeApprovedRequest ? styles.statusTitleWarning : null;
    const statusSubtitleStyle = activeApprovedRequest ? styles.statusSubtitleWarning : null;

    return (
        <ConsultantScreenLayout
            activeNavKey="home"
            headerSubtitle="Manage your availability and time off"
            headerTitle={`Welcome back, ${authProfile?.firstName ?? 'Consultant'}`}
            navigation={navigation}
            scrollContentStyle={styles.scrollContent}
            topBarVariant="brand"
        >
            <View style={styles.pagePadding}>
                <View style={styles.statusCard}>
                    <View style={styles.statusHeaderRow}>
                        <Text style={styles.cardHeading}>Current Status</Text>

                        <View style={[styles.statusHeaderIcon, statusIconWrapStyle]}>
                            <MaterialCommunityIcons color={statusAccentColor} name={statusIconName} size={18} />
                        </View>
                    </View>

                    <View style={[styles.statusBanner, statusBannerStyle]}>
                        <View>
                            <Text style={[styles.statusTitle, statusTitleStyle]}>{statusTitle}</Text>
                            <Text style={[styles.statusSubtitle, statusSubtitleStyle]}>{statusSubtitle}</Text>
                        </View>
                        <View style={[styles.statusDot, { backgroundColor: statusAccentColor }]} />
                    </View>

                    <View style={styles.metricRow}>
                        <MetricStatCard subtitle="submitted" title="All Requests" value={String(requestCounts.all)} />
                        <View style={styles.metricSpacer} />
                        <MetricStatCard subtitle="requests" title="Pending" tone="neutral" value={String(requestCounts.pending)} />
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

                {loadError ? <Text style={styles.errorState}>{loadError}</Text> : null}
                {!loadError && isLoading ? <Text style={styles.infoState}>Loading recent requests...</Text> : null}
                {!loadError && !isLoading && recentRequests.length === 0 ? <Text style={styles.infoState}>No requests yet.</Text> : null}

                {!loadError && !isLoading
                    ? recentRequests.map((request) => (
                          <RequestCard
                              dateRange={request.dateRange}
                              detail={getCompactDurationBreakdown(request)}
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
                      ))
                    : null}

                {loadError ? (
                    <View style={styles.retryWrap}>
                        <Pressable onPress={() => loadDashboard()} style={styles.retryButton}>
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </Pressable>
                    </View>
                ) : null}
            </View>
        </ConsultantScreenLayout>
    );
}
