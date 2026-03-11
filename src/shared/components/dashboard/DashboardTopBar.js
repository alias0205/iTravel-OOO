import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export function DashboardTopBar({
    title = 'iTravel OOO',
    subtitle = 'Nutrastat',
    variant = 'brand',
    notificationCount = 0,
    avatarLabel,
    avatarSource,
    leftIconName,
    showBrandIcon,
    showNotification = true,
    onNotificationPress,
    onAvatarPress,
    avatarPressRouteName,
    onLeftIconPress,
    sidebarItems = [],
}) {
    const navigation = useNavigation();
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const isLight = variant === 'light';
    const shouldShowBrandIcon = showBrandIcon ?? !isLight;
    const hasAvatar = Boolean(avatarSource || avatarLabel);
    const leftSlotWidth = leftIconName ? 34 : 0;
    const rightSlotWidth = (showNotification ? 36 : 0) + (showNotification && hasAvatar ? 10 : 0) + (hasAvatar ? 36 : 0);
    const sideSlotWidth = Math.max(leftSlotWidth, rightSlotWidth, 36);
    const navigationState = navigation.getState?.();
    const routeNames = navigationState?.routeNames ?? [];
    const currentRoute = navigationState?.routes?.[navigationState.index ?? 0]?.name;
    const visibleSidebarItems = sidebarItems.filter((item) => !item.hidden);

    const handleNotificationPress = () => {
        if (onNotificationPress) {
            onNotificationPress();
            return;
        }

        if (routeNames.includes('ConsultantNotifications')) {
            navigation.navigate('ConsultantNotifications');
        }
    };

    const handleAvatarPress = () => {
        if (onAvatarPress) {
            onAvatarPress();
            return;
        }

        if (avatarPressRouteName && routeNames.includes(avatarPressRouteName)) {
            navigation.navigate(avatarPressRouteName);
        }
    };

    const handleLeftIconPress = () => {
        if (onLeftIconPress) {
            onLeftIconPress();
            return;
        }

        if (leftIconName === 'menu' && sidebarItems.length) {
            setIsSidebarVisible(true);
        }
    };

    const handleSidebarItemPress = (item) => {
        setIsSidebarVisible(false);

        if (!item.routeName || item.routeName === currentRoute) {
            return;
        }

        navigation.navigate(item.routeName);
    };

    return (
        <>
            <View style={[styles.container, isLight ? styles.containerLight : styles.containerBrand]}>
                <View style={[styles.leftWrap, { width: sideSlotWidth }]}>
                    {leftIconName ? (
                        <Pressable hitSlop={20} onPress={handleLeftIconPress} style={[styles.leftButton, isLight ? styles.leftButtonLight : null]}>
                            <MaterialCommunityIcons color={isLight ? '#586273' : '#FFFFFF'} name={leftIconName} size={24} />
                        </Pressable>
                    ) : null}
                </View>

                <View pointerEvents="none" style={styles.brandWrap}>
                    {shouldShowBrandIcon ? (
                        <View style={[styles.logoTile, isLight ? styles.logoTileLight : null]}>
                            <MaterialCommunityIcons color={isLight ? '#FFFFFF' : '#0A6B63'} name="airplane" size={20} />
                        </View>
                    ) : null}

                    <View>
                        <Text style={[styles.brandTitle, isLight ? styles.brandTitleLight : null]}>{title}</Text>
                        <Text style={[styles.brandSubtitle, isLight ? styles.brandSubtitleLight : null]}>{subtitle}</Text>
                    </View>
                </View>

                <View style={[styles.rightWrap, { width: sideSlotWidth }]}>
                    {showNotification ? (
                        <Pressable hitSlop={10} onPress={handleNotificationPress} style={[styles.iconButton, isLight ? styles.iconButtonLight : null]}>
                            <MaterialCommunityIcons color={isLight ? '#586273' : '#FFFFFF'} name="bell-outline" size={28} />
                            {notificationCount ? (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{notificationCount}</Text>
                                </View>
                            ) : null}
                        </Pressable>
                    ) : null}

                    {avatarSource || avatarLabel ? (
                        <Pressable hitSlop={8} onPress={handleAvatarPress} style={styles.avatarButton}>
                            {avatarSource ? (
                                <Image source={avatarSource} style={styles.avatarImage} />
                            ) : (
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{avatarLabel}</Text>
                                </View>
                            )}
                        </Pressable>
                    ) : null}
                </View>
            </View>

            <Modal animationType="fade" onRequestClose={() => setIsSidebarVisible(false)} statusBarTranslucent transparent visible={isSidebarVisible}>
                <View style={styles.sidebarOverlay}>
                    <View style={styles.sidebarPanel}>
                        <View style={styles.sidebarContent}>
                            <View style={styles.sidebarHeader}>
                                <View style={styles.sidebarHeaderTopRow}>
                                    <View style={styles.sidebarBrandRow}>
                                        <View style={styles.sidebarLogoTile}>
                                            <MaterialCommunityIcons color="#0A6B63" name="airplane" size={18} />
                                        </View>
                                        <View>
                                            <Text style={styles.sidebarTitle}>Navigation</Text>
                                            <Text style={styles.sidebarSubtitle}>{title}</Text>
                                        </View>
                                    </View>

                                    <Pressable onPress={() => setIsSidebarVisible(false)} style={styles.sidebarCloseButton}>
                                        <MaterialCommunityIcons color="#475569" name="close" size={20} />
                                    </Pressable>
                                </View>

                                {avatarSource || avatarLabel ? (
                                    <View style={styles.sidebarProfileRow}>
                                        {avatarSource ? (
                                            <Image source={avatarSource} style={styles.sidebarAvatarImage} />
                                        ) : (
                                            <View style={styles.sidebarAvatar}>{avatarLabel ? <Text style={styles.avatarText}>{avatarLabel}</Text> : null}</View>
                                        )}
                                        <View>
                                            <Text style={styles.sidebarProfileName}>Consultant Portal</Text>
                                            <Text style={styles.sidebarProfileMeta}>{subtitle}</Text>
                                        </View>
                                    </View>
                                ) : null}
                            </View>

                            <View style={styles.sidebarBody}>
                                {visibleSidebarItems.map((item) => (
                                    <Pressable
                                        key={item.key}
                                        onPress={() => handleSidebarItemPress(item)}
                                        style={[styles.sidebarItem, currentRoute === item.routeName ? styles.sidebarItemActive : null]}
                                    >
                                        <View style={[styles.sidebarItemIconWrap, currentRoute === item.routeName ? styles.sidebarItemIconWrapActive : null]}>
                                            <MaterialCommunityIcons color={currentRoute === item.routeName ? '#0A6B63' : '#64748B'} name={item.icon} size={20} />
                                        </View>
                                        <Text style={[styles.sidebarItemLabel, currentRoute === item.routeName ? styles.sidebarItemLabelActive : null]}>{item.label}</Text>
                                        {item.badge ? (
                                            <View style={styles.sidebarItemBadge}>
                                                <Text style={styles.sidebarItemBadgeText}>{item.badge}</Text>
                                            </View>
                                        ) : null}
                                    </Pressable>
                                ))}
                            </View>
                            <View style={styles.sidebarFooter}>
                                <Pressable onPress={() => setIsSidebarVisible(false)} style={styles.sidebarSignOutButton}>
                                    <MaterialCommunityIcons color="#DC2626" name="logout-variant" size={18} />
                                    <Text style={styles.sidebarSignOutText}>Sign Out</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    <Pressable onPress={() => setIsSidebarVisible(false)} style={styles.sidebarBackdrop} />
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E4E8ED',
    },
    containerBrand: {
        backgroundColor: '#0A6B63',
        borderBottomColor: '#0A6B63',
    },
    containerLight: {
        backgroundColor: '#FFFFFF',
    },
    leftWrap: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 3,
    },
    brandWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftButton: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
    },
    leftButtonLight: {
        backgroundColor: 'transparent',
    },
    logoTile: {
        width: 32,
        height: 32,
        borderRadius: 9,
        backgroundColor: '#F2F6F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    logoTileLight: {
        width: 32,
        height: 32,
        borderRadius: 9,
        backgroundColor: '#0A6B63',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    brandTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '800',
    },
    brandTitleLight: {
        color: '#212A37',
        fontSize: 16,
        lineHeight: 22,
    },
    brandSubtitle: {
        color: 'rgba(255, 255, 255, 0.86)',
        fontSize: 11,
        lineHeight: 15,
        marginTop: 1,
    },
    brandSubtitleLight: {
        color: '#6F7787',
    },
    rightWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 2,
    },
    iconButton: {
        marginRight: 20,
    },
    iconButtonLight: {
        backgroundColor: 'transparent',
    },
    badge: {
        position: 'absolute',
        top: -1,
        right: -1,
        minWidth: 17,
        height: 17,
        paddingHorizontal: 4,
        borderRadius: 999,
        backgroundColor: '#F04A49',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        lineHeight: 12,
        fontWeight: '800',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1EA7B1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarButton: {
        borderRadius: 18,
    },
    avatarImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '800',
    },
    sidebarOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.28)',
    },
    sidebarBackdrop: {
        ...StyleSheet.absoluteFillObject,
        left: 288,
    },
    sidebarPanel: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 288,
        backgroundColor: '#FFFFFF',
        borderTopRightRadius: 22,
        borderBottomRightRadius: 22,
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 2, height: 0 },
        elevation: 8,
    },
    sidebarContent: {
        flex: 1,
    },
    sidebarHeader: {
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 18,
        paddingTop: 22,
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    sidebarHeaderTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    sidebarBrandRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sidebarLogoTile: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#E7F6F2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    sidebarTitle: {
        color: '#0F172A',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
    },
    sidebarSubtitle: {
        color: '#64748B',
        fontSize: 12,
        lineHeight: 18,
        marginTop: 2,
    },
    sidebarCloseButton: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sidebarProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sidebarAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1EA7B1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    sidebarAvatarImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    sidebarProfileName: {
        color: '#0F172A',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '700',
    },
    sidebarProfileMeta: {
        color: '#64748B',
        fontSize: 13,
        lineHeight: 18,
        marginTop: 2,
    },
    sidebarBody: {
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: 22,
    },
    sidebarFooter: {
        marginTop: 'auto',
        paddingHorizontal: 14,
        paddingBottom: 22,
    },
    sidebarSignOutButton: {
        minHeight: 50,
        borderRadius: 14,
        backgroundColor: '#FEECEC',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sidebarSignOutText: {
        color: '#DC2626',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
        marginLeft: 8,
    },
    sidebarItem: {
        minHeight: 52,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    sidebarItemActive: {
        backgroundColor: '#EEF8F6',
    },
    sidebarItemIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    sidebarItemIconWrapActive: {
        backgroundColor: '#DFF4EE',
    },
    sidebarItemLabel: {
        flex: 1,
        color: '#334155',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '700',
    },
    sidebarItemLabelActive: {
        color: '#0A6B63',
    },
    sidebarItemBadge: {
        minWidth: 24,
        height: 24,
        borderRadius: 999,
        backgroundColor: '#F04A49',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    sidebarItemBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        lineHeight: 13,
        fontWeight: '800',
    },
});
