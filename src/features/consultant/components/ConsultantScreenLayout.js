import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { useConsultantNotifications } from '../context/ConsultantNotificationsContext';
import { DashboardBottomNav } from '../../../shared/components/dashboard/DashboardBottomNav';
import { DashboardTopBar } from '../../../shared/components/dashboard/DashboardTopBar';
import { ConsultantScreenLayoutStyles as styles } from '../../../styles';

const consultantNavItems = [
    { key: 'home', label: 'Home', icon: 'home', routeName: 'ConsultantDashboard' },
    { key: 'requests', label: 'Requests', icon: 'clipboard-text-outline', routeName: 'ConsultantRequestList' },
    { key: 'new-request', label: 'New', icon: 'plus-circle-outline', routeName: 'ConsultantNewRequest' },
    { key: 'notifications', label: 'Alerts', icon: 'bell-outline', routeName: 'ConsultantNotifications' },
    { key: 'settings', label: 'Settings', icon: 'cog-outline', routeName: 'ConsultantSettings' },
];

function ConsultantPageHeader({ title, subtitle, showBackButton, onBackPress, rightContent }) {
    if (!title && !subtitle && !showBackButton && !rightContent) {
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

export function ConsultantScreenLayout({
    navigation,
    activeNavKey = 'home',
    children,
    headerTitle,
    headerSubtitle,
    showBackButton = false,
    onBackPress,
    headerRight,
    showNotification = false,
    topBarVariant = 'light',
    topBarProps,
    scrollContentStyle,
    scrollEnabled = true,
    useScrollView = true,
}) {
    const { authProfile, signOut } = useAuthSession();
    const { unreadCount } = useConsultantNotifications();
    const resolvedNotificationCount = unreadCount;

    const navItems = consultantNavItems.map((item) => ({
        ...item,
        badge: item.key === 'notifications' && resolvedNotificationCount ? resolvedNotificationCount : undefined,
    }));

    const handleNavPress = (item) => {
        if (!navigation || !item.routeName) {
            return;
        }

        if (item.key === activeNavKey) {
            return;
        }

        navigation.navigate(item.routeName);
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
                avatarPressRouteName="ConsultantSettings"
                avatarLabel={authProfile?.initials ?? 'CU'}
                avatarSource={authProfile?.avatarSource}
                leftIconName="menu"
                notificationCount={resolvedNotificationCount}
                onNotificationPress={() => navigation?.navigate('ConsultantNotifications')}
                onSidebarSignOut={handleSidebarSignOut}
                sidebarProfileMeta={`${authProfile?.title ?? 'Consultant'}${authProfile?.department ? `, ${authProfile.department}` : ''}`}
                sidebarProfileName={authProfile?.fullName ?? 'Consultant User'}
                sidebarItems={navItems}
                sidebarSubtitle="iTravel OOO"
                sidebarTitle="Consultant Navigation"
                showBrandIcon
                showNotification={showNotification}
                subtitle="Nutrastat"
                title="iTravel OOO"
                variant={topBarVariant}
                {...topBarProps}
            />

            <ConsultantPageHeader
                onBackPress={onBackPress ?? (() => navigation?.goBack())}
                rightContent={headerRight}
                showBackButton={showBackButton}
                subtitle={headerSubtitle}
                title={headerTitle}
            />

            {useScrollView ? (
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, scrollContentStyle]}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                    scrollEnabled={scrollEnabled}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            ) : (
                <View style={[styles.contentBody, styles.scrollContent, scrollContentStyle]}>{children}</View>
            )}

            <DashboardBottomNav activeKey={activeNavKey} items={navItems} onItemPress={handleNavPress} />
        </SafeAreaView>
    );
}
