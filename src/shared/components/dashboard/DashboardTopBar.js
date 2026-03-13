import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';

import { DashboardTopBarStyles as styles } from '../../../styles';

export function DashboardTopBar({
    title = 'iTravel OOO',
    subtitle = 'Nutrastat',
    variant = 'brand',
    notificationCount = 0,
    avatarLabel,
    avatarSource,
    leftIconName,
    showBrandIcon,
    showNotification = false,
    onNotificationPress,
    onAvatarPress,
    avatarPressRouteName,
    onLeftIconPress,
    sidebarItems = [],
    sidebarTitle = 'Navigation',
    sidebarSubtitle,
    sidebarProfileName = 'Consultant Portal',
    sidebarProfileMeta,
    sidebarSignOutLabel = 'Sign Out',
    onSidebarSignOut,
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
    const sidebarSubtitleText = sidebarSubtitle ?? title;
    const sidebarProfileMetaText = sidebarProfileMeta ?? subtitle;

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

    const handleSidebarSignOut = () => {
        setIsSidebarVisible(false);

        if (onSidebarSignOut) {
            onSidebarSignOut();
        }
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
                            {/* <MaterialCommunityIcons color={isLight ? '#FFFFFF' : '#0A6B63'} name="airplane" size={20} /> */}
                            <Text style={isLight ? { color: '#FFFFFF', fontSize: 24, marginTop: -4 } : { color: '#0A6B63', fontSize: 24, marginTop: -4 }}>{'ns'}</Text>
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
                                            {/* <MaterialCommunityIcons color="#0A6B63" name="airplane" size={18} /> */}
                                            <Text style={isLight ? { color: '#FFFFFF', fontSize: 24, marginTop: -4 } : { color: '#0A6B63', fontSize: 24, marginTop: -4 }}>
                                                {'ns'}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.sidebarTitle}>{sidebarTitle}</Text>
                                            <Text style={styles.sidebarSubtitle}>{sidebarSubtitleText}</Text>
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
                                            <Text style={styles.sidebarProfileName}>{sidebarProfileName}</Text>
                                            <Text style={styles.sidebarProfileMeta}>{sidebarProfileMetaText}</Text>
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
                                <Pressable onPress={handleSidebarSignOut} style={styles.sidebarSignOutButton}>
                                    <MaterialCommunityIcons color="#DC2626" name="logout-variant" size={18} />
                                    <Text style={styles.sidebarSignOutText}>{sidebarSignOutLabel}</Text>
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
