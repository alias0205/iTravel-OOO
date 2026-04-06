import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { getApprovalDurationBreakdown } from '../../approval/utils/approvalDurationUtils';
import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { fetchOutOfOfficeRequestCounts, fetchOutOfOfficeRequests } from '../utils/outOfOfficeApi';
import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { ConsultantRequestListScreenStyles as styles } from '../../../styles';
import { RequestCard } from '../../../shared/components/dashboard/RequestCard';

const requestTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Reject' },
];

function getCompactDurationBreakdown(request) {
    const durationBreakdown = getApprovalDurationBreakdown(request);

    if (!durationBreakdown) {
        return request.detail;
    }

    return `${durationBreakdown.totalDays}/${durationBreakdown.weekendDays}/${durationBreakdown.bankHolidayDays}`;
}

export function ConsultantRequestListScreen({ navigation }) {
    const { session, signOut } = useAuthSession();
    const [activeTab, setActiveTab] = useState('all');
    const [requests, setRequests] = useState([]);
    const [tabCounts, setTabCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);
    const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });

    useEffect(() => {
        let isMounted = true;

        void (async () => {
            try {
                const counts = await fetchOutOfOfficeRequestCounts({ token: session?.token });

                if (isMounted) {
                    setTabCounts((currentValue) => ({ ...currentValue, ...counts }));
                }
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (error?.status === 401) {
                    await signOut();
                    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [navigation, session?.token, signOut]);

    useEffect(() => {
        let isMounted = true;

        void (async () => {
            setIsLoading(true);
            setLoadError('');

            try {
                const result = await fetchOutOfOfficeRequests({
                    page: 1,
                    perPage: 15,
                    status: activeTab === 'all' ? undefined : activeTab,
                    token: session?.token,
                });

                if (!isMounted) {
                    return;
                }

                setRequests(result.items);
                setPagination(result.meta);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                const message = error instanceof Error ? error.message : 'Unable to load requests right now.';

                if (error?.status === 401) {
                    await signOut();
                    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
                    return;
                }

                setLoadError(message);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [activeTab, navigation, reloadKey, session?.token, signOut]);

    const handleLoadMore = () => {
        void (async () => {
            if (isLoadingMore || isLoading || pagination.currentPage >= pagination.lastPage) {
                return;
            }

            setIsLoadingMore(true);

            try {
                const nextPage = pagination.currentPage + 1;
                const result = await fetchOutOfOfficeRequests({
                    page: nextPage,
                    perPage: 15,
                    status: activeTab === 'all' ? undefined : activeTab,
                    token: session?.token,
                });

                setRequests((currentValue) => [...currentValue, ...result.items]);
                setPagination(result.meta);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to load more requests.';

                if (error?.status === 401) {
                    await signOut();
                    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
                    return;
                }

                Alert.alert('Load More Failed', message);
            } finally {
                setIsLoadingMore(false);
            }
        })();
    };

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
                {isLoading ? <Text style={styles.infoState}>Loading requests...</Text> : null}
                {!isLoading && loadError ? (
                    <View style={styles.retryWrap}>
                        <Text style={styles.errorState}>{loadError}</Text>
                        <Pressable onPress={() => setReloadKey((currentValue) => currentValue + 1)} style={styles.retryButton}>
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </Pressable>
                    </View>
                ) : null}

                {!isLoading && !loadError
                    ? requests.map((request) => (
                          <RequestCard
                              key={request.id}
                              dateRange={request.dateRange}
                              detail={getCompactDurationBreakdown(request)}
                              duration={request.duration}
                              icon={request.icon}
                              iconColor={request.iconColor}
                              meta={request.meta}
                              onPress={() => navigation.navigate('ConsultantRequestDetail', { request })}
                              statusLabel={request.statusLabel}
                              statusTone={request.statusTone}
                              title={request.title}
                          />
                      ))
                    : null}
                {!isLoading && !loadError && requests.length === 0 ? <Text style={styles.emptyState}>No requests in this category.</Text> : null}
                {!isLoading && !loadError && pagination.currentPage < pagination.lastPage ? (
                    <Pressable onPress={handleLoadMore} style={[styles.loadMoreButton, isLoadingMore ? styles.loadMoreButtonDisabled : null]}>
                        <Text style={styles.loadMoreButtonText}>{isLoadingMore ? 'Loading...' : 'Load More'}</Text>
                    </Pressable>
                ) : null}
            </View>
        </ConsultantScreenLayout>
    );
}
