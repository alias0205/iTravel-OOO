import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, Text, View, Pressable } from 'react-native';

import { DashboardBottomNav } from '../../../shared/components/dashboard/DashboardBottomNav';
import { DashboardTopBar } from '../../../shared/components/dashboard/DashboardTopBar';
import { ConsultantScreenLayoutStyles as styles } from '../../../styles';

const consultantAvatar = require('../../../../assets/nutra/avatars/avatar-1.jpg');

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
    notificationCount = 3,
    topBarVariant = 'light',
    topBarProps,
    scrollContentStyle,
}) {
    const navItems = consultantNavItems.map((item) => ({
        ...item,
        badge: item.key === 'notifications' && notificationCount ? notificationCount : undefined,
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <DashboardTopBar
                avatarPressRouteName="ConsultantSettings"
                avatarSource={consultantAvatar}
                leftIconName="menu"
                notificationCount={notificationCount}
                onNotificationPress={() => navigation?.navigate('ConsultantNotifications')}
                onSidebarSignOut={() =>
                    navigation?.reset({
                        index: 0,
                        routes: [{ name: 'SignIn' }],
                    })
                }
                sidebarProfileMeta="Nutrastat"
                sidebarProfileName="Consultant Portal"
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

            <ScrollView contentContainerStyle={[styles.scrollContent, scrollContentStyle]} showsVerticalScrollIndicator={false}>
                {children}
            </ScrollView>

            <DashboardBottomNav activeKey={activeNavKey} items={navItems} onItemPress={handleNavPress} />
        </SafeAreaView>
    );
}
