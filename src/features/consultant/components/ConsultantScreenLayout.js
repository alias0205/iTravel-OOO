import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';

import { DashboardBottomNav } from '../../../shared/components/dashboard/DashboardBottomNav';
import { DashboardTopBar } from '../../../shared/components/dashboard/DashboardTopBar';

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
                sidebarItems={navItems}
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

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F4F5F7',
    },
    headerCard: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E9EF',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 16,
    },
    headerInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerCopyRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#F3F5F8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    headerCopy: {
        flex: 1,
    },
    headerTitle: {
        color: '#1F2937',
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '800',
    },
    headerSubtitle: {
        color: '#5B6575',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 2,
    },
    headerRight: {
        marginLeft: 12,
    },
    scrollContent: {
        paddingBottom: 18,
    },
});
