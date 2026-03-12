import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, Text, View, Pressable } from 'react-native';

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <DashboardTopBar
                avatarPressRouteName="ApprovalSettings"
                avatarLabel="MJ"
                leftIconName="menu"
                notificationCount={notificationCount}
                onNotificationPress={() => navigation?.navigate('ApprovalNotifications')}
                onSidebarSignOut={() =>
                    navigation?.reset({
                        index: 0,
                        routes: [{ name: 'SignIn' }],
                    })
                }
                sidebarProfileMeta="Manager, Nutrastat"
                sidebarProfileName="Michael Johnson"
                sidebarItems={navItems}
                sidebarSubtitle="Nutrastat"
                sidebarTitle="iTravel"
                showBrandIcon
                showNotification={showNotification}
                subtitle="Nutrastat"
                title="iTravel"
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
