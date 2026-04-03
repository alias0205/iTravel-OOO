import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { DashboardBottomNav } from '../../../shared/components/dashboard/DashboardBottomNav';
import { DashboardTopBar } from '../../../shared/components/dashboard/DashboardTopBar';
import { ApprovalScreenLayoutStyles as styles } from '../../../styles';

const approvalNavItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'view-dashboard-outline', routeName: 'ApprovalDashboard' },
    { key: 'calendar', label: 'Calendar', icon: 'calendar-month-outline', routeName: 'ApprovalCalendar' },
    { key: 'approvals', label: 'Approvals', icon: 'clipboard-check-outline', routeName: 'ApprovalRequestList', badge: 1 },
    { key: 'notifications', label: 'Notifications', icon: 'bell-outline', routeName: 'ApprovalNotifications', badge: 8 },
    { key: 'settings', label: 'Settings', icon: 'cog-outline', routeName: 'ApprovalSettings' },
];

function ApprovalPageHeader({ title, subtitle, rightContent, showBackButton, onBackPress }) {
    if (!title && !subtitle && !rightContent && !showBackButton) {
        return null;
    }

    return (
        <View style={styles.headerCard}>
            <View style={styles.headerInner}>
                <View style={styles.headerCopyRow}>
                    {showBackButton ? (
                        <Pressable onPress={onBackPress} style={styles.backButton}>
                            <MaterialCommunityIcons color="#334155" name="arrow-left" size={20} />
                        </Pressable>
                    ) : null}

                    <View style={styles.headerCopy}>
                        {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
                        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
                    </View>
                </View>

                {rightContent ? <View style={styles.headerRight}>{rightContent}</View> : null}
            </View>
        </View>
    );
}

export function ApprovalScreenLayout({
    navigation,
    activeNavKey = 'dashboard',
    children,
    headerTitle,
    headerSubtitle,
    headerRight,
    showBackButton = false,
    onBackPress,
    showNotification = false,
    notificationCount = 8,
    scrollContentStyle,
    topBarProps,
}) {
    const { authProfile, signOut } = useAuthSession();

    const navItems = approvalNavItems.map((item) => ({
        ...item,
        badge: item.key === 'notifications' ? notificationCount : item.badge,
    }));

    const handleBottomNavPress = (item) => {
        if (!item.routeName || item.key === activeNavKey) {
            return;
        }

        navigation?.navigate(item.routeName);
    };

    const handleSidebarSignOut = async () => {
        await signOut();
        navigation?.reset({
            index: 0,
            routes: [{ name: 'Splash' }],
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <DashboardTopBar
                avatarPressRouteName="ApprovalSettings"
                avatarLabel={authProfile?.initials ?? 'MJ'}
                leftIconName="menu"
                notificationCount={notificationCount}
                onNotificationPress={() => navigation?.navigate('ApprovalNotifications')}
                onSidebarSignOut={handleSidebarSignOut}
                sidebarProfileMeta={`${authProfile?.title ?? 'Manager'}, ${authProfile?.department ?? 'Nutrastat'}`}
                sidebarProfileName={authProfile?.fullName ?? 'Michael Johnson'}
                sidebarItems={navItems}
                sidebarSubtitle="Nutrastat"
                sidebarTitle="iTravel OOO"
                showBrandIcon
                showNotification={showNotification}
                subtitle="Nutrastat"
                title="iTravel OOO"
                variant="dark"
                {...topBarProps}
            />

            <ApprovalPageHeader
                onBackPress={onBackPress ?? (() => navigation?.goBack())}
                rightContent={headerRight}
                showBackButton={showBackButton}
                subtitle={headerSubtitle}
                title={headerTitle}
            />

            <ScrollView contentContainerStyle={[styles.scrollContent, scrollContentStyle]} showsVerticalScrollIndicator={false}>
                {children}
            </ScrollView>

            <DashboardBottomNav activeKey={activeNavKey} items={navItems} onItemPress={handleBottomNavPress} />
        </SafeAreaView>
    );
}
