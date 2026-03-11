import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

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
}) {
    const isLight = variant === 'light';
    const shouldShowBrandIcon = showBrandIcon ?? !isLight;
    const hasAvatar = Boolean(avatarSource || avatarLabel);
    const leftSlotWidth = leftIconName ? 34 : 0;
    const rightSlotWidth = (showNotification ? 36 : 0) + (showNotification && hasAvatar ? 10 : 0) + (hasAvatar ? 36 : 0);
    const sideSlotWidth = Math.max(leftSlotWidth, rightSlotWidth, 36);

    return (
        <View style={[styles.container, isLight ? styles.containerLight : styles.containerBrand]}>
            <View style={[styles.leftWrap, { width: sideSlotWidth }]}>
                {leftIconName ? (
                    <Pressable style={[styles.leftButton, isLight ? styles.leftButtonLight : null]}>
                        <MaterialCommunityIcons color={isLight ? '#586273' : '#FFFFFF'} name={leftIconName} size={20} />
                    </Pressable>
                ) : null}
            </View>

            <View pointerEvents="none" style={styles.brandWrap}>
                {shouldShowBrandIcon ? (
                    <View style={styles.logoTile}>
                        <MaterialCommunityIcons color="#0A6B63" name="airplane" size={20} />
                    </View>
                ) : null}

                <View>
                    <Text style={[styles.brandTitle, isLight ? styles.brandTitleLight : null]}>{title}</Text>
                    <Text style={[styles.brandSubtitle, isLight ? styles.brandSubtitleLight : null]}>{subtitle}</Text>
                </View>
            </View>

            <View style={[styles.rightWrap, { width: sideSlotWidth }]}>
                {showNotification ? (
                    <Pressable style={[styles.iconButton, isLight ? styles.iconButtonLight : null]}>
                        <MaterialCommunityIcons color={isLight ? '#586273' : '#FFFFFF'} name="bell-outline" size={20} />
                        {notificationCount ? (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{notificationCount}</Text>
                            </View>
                        ) : null}
                    </Pressable>
                ) : null}

                {avatarSource ? (
                    <Image source={avatarSource} style={styles.avatarImage} />
                ) : avatarLabel ? (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{avatarLabel}</Text>
                    </View>
                ) : null}
            </View>
        </View>
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
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
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
});
